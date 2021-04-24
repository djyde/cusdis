import { Comment, Prisma } from '@prisma/client'
import { RequestScopeService } from '.'
import { prisma } from '../utils.server'
import { PageService } from './page.service'
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'
import { HookService } from './hook.service'
import { groupBy, get } from 'lodash'
export const markdown = MarkdownIt({
  linkify: true,
})

markdown.disable(['image', 'link'])

export class CommentService extends RequestScopeService {
  pageService = new PageService(this.req)
  hookService = new HookService(this.req)
  /**
   *  @deprecated
   */
  async getComments(
    projectId: string,
    options?: {
      parentId?: string
      page?: number
      select?: Prisma.CommentSelect
      pageSlug?: string | Prisma.StringFilter
      onlyOwn?: boolean
      approved?: boolean
    },
  ): Promise<Comment[]> {
    const pageSize = 10

    const select = {
      id: true,
      createdAt: true,
      content: true,
      ...options?.select,
      page: true,
      ancestorId: true,
      parentId: true,
    }

    const comments = await prisma.comment.findMany({
      skip: options?.page ? (options.page - 1) * pageSize : 0,
      take: options?.page ? pageSize : 100,
      orderBy: {
        createdAt: 'desc',
      },
      select,
      where: {
        approved: options?.approved === true ? true : options?.approved,
        parentId: options?.parentId,
        deletedAt: {
          equals: null,
        },
        page: {
          slug: options?.pageSlug,
          projectId,
          project: {
            ownerId: options?.onlyOwn
              ? await (await this.getSession()).uid
              : undefined,
          },
        },
      },
    })

    const allComments = await Promise.all(
      comments.map(async (comment) => {
        // get replies
        const replies = await this.getComments(projectId, {
          ...options,
          parentId: comment.id,
          pageSlug: options?.pageSlug,
          select,
        })
        const parsedCreatedAt = dayjs(comment.createdAt).format(
          'YYYY-MM-DD HH:mm',
        )
        const parsedContent = markdown.render(comment.content)
        if (replies.length) {
          return {
            ...comment,
            replies,
            parsedContent,
            parsedCreatedAt,
          }
        } else {
          return {
            ...comment,
            replies: [],
            parsedContent,
            parsedCreatedAt,
          }
        }
      }),
    )

    return allComments as any[]
  }

  async getCommentsV2(
    projectId: string,
    options?: {
      parentId?: string
      page?: number
      select?: Prisma.CommentSelect
      pageSlug?: string | Prisma.StringFilter
      onlyOwn?: boolean
      approved?: boolean
    },
  ): Promise<any[]> {
    const pageSize = 10

    const select = {
      id: true,
      createdAt: true,
      content: true,
      ...options?.select,
      page: true,
      ancestorId: true,
      parentId: true,
    }

    const rootComments = await prisma.comment.findMany({
      skip: options?.page ? (options.page - 1) * pageSize : 0,
      take: options?.page ? pageSize : 100,
      orderBy: {
        createdAt: 'desc',
      },
      select,
      where: {
        approved: options?.approved === true ? true : options?.approved,
        parentId: null,
        deletedAt: {
          equals: null,
        },
        page: {
          slug: options?.pageSlug,
          projectId,
          project: {
            ownerId: options?.onlyOwn
              ? await (await this.getSession()).uid
              : undefined,
          },
        },
      },
    })

    const rootId = rootComments.map((v) => v.id)

    const replies = await prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select,
      where: {
        approved: options?.approved === true ? true : options?.approved,
        deletedAt: {
          equals: null,
        },
        ancestorId: {
          in: rootId,
        },
        page: {
          slug: options?.pageSlug,
          projectId,
        },
      },
    })

    const parseResult = (v) => ({
      ...v,
      parsedCreatedAt: dayjs(v.createdAt).format('YYYY-MM-DD HH:mm'),
      parsedContent: markdown.render(v.content),
    })

    const parsedComment = rootComments.map((v) => parseResult(v))
    const parsedReply = replies.map((v) => parseResult(v))
    const childrenDict = groupBy(parsedReply, 'parentId')
    const makeChildren = (v) => {
      if (get(childrenDict, v.id)) {
        return {
          ...v,
          replies: get(childrenDict, v.id).map((v) => makeChildren(v)),
        }
      }
      return {
        ...v,
        replies: [],
      }
    }

    const replaiesTree = parsedReply.map((v) => makeChildren(v))
    const replaiesDict = groupBy(replaiesTree, 'parentId')

    return parsedComment.map((v) => ({
      ...v,
      replies: get(replaiesDict, v.id, []),
    }))
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
  /**
   *  @deprecated
   */
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

  async addCommentV2(
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
    ancestorId?: string,
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
        ancestorId,
      },
    })

    this.hookService.addComment(created, projectId)

    return created
  }
  /**
   *  @deprecated
   */
  async addCommentAsModerator(parentId: string, content: string) {
    const session = await this.getSession()
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

  async addCommentAsModeratorV2(
    parentId: string,
    content: string,
    ancestorId?: string,
  ) {
    const session = await this.getSession()
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
        ancestorId,
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
}
