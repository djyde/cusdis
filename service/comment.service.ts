import { Comment, Page, Prisma, User } from '@prisma/client'
import { RequestScopeService, UserSession } from '.'
import { prisma, resolvedConfig } from '../utils.server'
import { PageService } from './page.service'
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'
import { HookService } from './hook.service'
import { statService } from './stat.service'
import { EmailService } from './email.service'
import { TokenService } from './token.service'
import { makeConfirmReplyNotificationTemplate } from '../templates/confirm_reply_notification'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const markdown = MarkdownIt({
  linkify: true,
})

markdown.disable(['image', 'link'])

export type CommentWrapper = {
  commentCount: number
  pageSize: number
  pageCount: number
  data: CommentItem[]
}

export type CommentItem = Comment & {
  page: Page
} & {
  replies: CommentWrapper
  parsedContent: string
  parsedCreatedAt: string
}

export class CommentService extends RequestScopeService {
  pageService = new PageService(this.req)
  hookService = new HookService(this.req)
  emailService = new EmailService()
  tokenService = new TokenService()

  async getComments(
    projectId: string,
    timezoneOffset: number,
    options?: {
      parentId?: string
      page?: number
      select?: Prisma.CommentSelect
      pageSlug?: string | Prisma.StringFilter
      onlyOwn?: boolean
      approved?: boolean
      pageSize?: number
    },
  ): Promise<CommentWrapper> {
    const pageSize = options?.pageSize || 10

    const select = {
      id: true,
      createdAt: true,
      content: true,
      ...options?.select,
      page: true,
      moderatorId: true,
    } as Prisma.CommentSelect

    const where = {
      approved: options?.approved === true ? true : options?.approved,
      parentId: options?.parentId,
      deletedAt: {
        equals: null,
      },
      page: {
        slug: options?.pageSlug,
        projectId,
        project: {
          deletedAt: {
            equals: null,
          },
          ownerId: options?.onlyOwn
            ? await (await this.getSession()).uid
            : undefined,
        },
      },
    } as Prisma.CommentWhereInput

    const baseQuery = {
      select,
      where,
    }

    const page = options?.page || 1

    const [commentCount, comments] = await prisma.$transaction([
      prisma.comment.count({ where }),
      prisma.comment.findMany({
        ...baseQuery,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    // If there are 0 comments, there is still 1 page
    const pageCount = Math.ceil(commentCount / pageSize) || 1

    const allComments = await Promise.all(
      comments.map(async (comment: Comment) => {
        // get replies
        const replies = await this.getComments(projectId, timezoneOffset, {
          ...options,
          page: 1,
          // hard code 100 because we havent implement pagination in nested comment
          pageSize: 100,
          parentId: comment.id,
          pageSlug: options?.pageSlug,
          select,
        })

        const parsedCreatedAt = dayjs.utc(comment.createdAt).utcOffset(timezoneOffset).format(
          'YYYY-MM-DD HH:mm',
        )
        const parsedContent = markdown.render(comment.content) as string
        return {
          ...comment,
          replies,
          parsedContent,
          parsedCreatedAt,
        } as CommentItem
      }),
    )

    return {
      data: allComments,
      commentCount,
      pageSize,
      pageCount,
    }
  }

  async getProject(commentId: string) {
    const res = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        page: {
          select: {
            project: {
              select: {
                id: true,
                ownerId: true,
              },
            },
          },
        },
      },
    })

    return res.page.project
  }

  async addComment(
    projectId: string,
    pageSlug: string,
    body: {
      content: string
      email: string
      nickname: string
      pageUrl?: string
      pageTitle?: string
    },
    parentId?: string,
  ) {
    // touch page
    const page = await this.pageService.upsertPage(pageSlug, projectId, {
      pageTitle: body.pageTitle,
      pageUrl: body.pageUrl,
    })

    const created = await prisma.comment.create({
      data: {
        content: body.content,
        by_email: body.email,
        by_nickname: body.nickname,
        pageId: page.id,
        parentId,
      },
    })

    this.hookService.addComment(created, projectId)

    return created
  }

  async addCommentAsModerator(parentId: string, content: string, options?: {
    owner?: User
  }) {
    const session = options?.owner ? {
      user: options.owner,
      uid: options.owner.id
    } : await this.getSession()
    const parent = await prisma.comment.findUnique({
      where: {
        id: parentId,
      },
    })

    const created = await prisma.comment.create({
      data: {
        content: content,
        by_email: session.user.email,
        by_nickname: session.user.name,
        moderatorId: session.uid,
        pageId: parent.pageId,
        approved: true,
        parentId,
      },
    })

    return created
  }

  async approve(commentId: string) {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        approved: true,
      },
    })

    statService.capture('comment_approve')
  }

  async delete(commentId: string) {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async sendConfirmReplyNotificationEmail(
    to: string,
    pageSlug: string,
    commentId: string,
  ) {
    const confirmToken = this.tokenService.genAcceptNotifyToken(commentId)
    const confirmLink = `${resolvedConfig.host}/api/open/confirm_reply_notification?token=${confirmToken}`
    this.emailService.send({
      to,
      from: this.emailService.sender,
      subject: `Please confirm reply notification`,
      html: makeConfirmReplyNotificationTemplate({
        page_slug: pageSlug,
        confirm_url: confirmLink,
      }),
    })
    statService.capture('send_reply_confirm_email')
  }
}
