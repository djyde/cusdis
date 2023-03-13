import 'server-only'

import { prisma } from "../../utils/prisma"

export async function getComments(projectId: string, pageSlug: string, page: number, options?: {
  parentId?: string,
  onlyApproved?: boolean
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
  return comments
}

