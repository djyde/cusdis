import { Page, Prisma, Comment } from "@prisma/client"
import dayjs from "dayjs"
import MarkdownIt from 'markdown-it'
import { prisma } from "../utils/prisma"
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const markdown = MarkdownIt({
  linkify: true,
})

markdown.disable(['image', 'link'])

export type CommentItem = Comment & {
  page: Page
} & {
  replies: CommentWrapper
  parsedContent: string
  parsedCreatedAt: string
}
export type CommentWrapper = {
  commentCount: number
  pageSize: number
  pageCount: number
  data: CommentItem[]
}
export async function getComments(
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
          ? await (
              await this.getSession()
            ).uid
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

      const parsedCreatedAt = dayjs
        .utc(comment.createdAt)
        .utcOffset(timezoneOffset)
        .format('YYYY-MM-DD HH:mm')
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
