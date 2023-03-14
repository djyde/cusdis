import 'server-only'

import { prisma } from "../../utils/prisma"
import dayjs from '../../utils/dayjs'

export async function getComments(projectId: string, pageSlug: string, page: number, timezoneOffset: number, options?: {
  parentId?: string,
  onlyApproved?: boolean,
}) {
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      page: {
        projectId: projectId,
        slug: pageSlug,
      },
      deletedAt: null,
      approved: options?.onlyApproved ? true : undefined,
      parentId: options?.parentId || null
    },
    select: {
      id: true,
      by_nickname: true,
      createdAt: true,
      moderator: {
        select: {
          displayName: true,
          name: true,
          id: true,
        }
      },
      content: true,
      approved: true,
      page: {
        select: {
          slug: true,
          projectId: true,
          project: {
            select: {
              ownerId: true
            }
          }
        }
      }
    }
  })

  for (let c of comments) {
    // @ts-expect-error
    c.createdAt = dayjs
      .utc(c.createdAt)
      .utcOffset(timezoneOffset)
      .format('YYYY-MM-DD HH:mm')
  }
  return comments
}

