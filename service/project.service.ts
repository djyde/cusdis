import { Prisma, User } from '@prisma/client'
import { nanoid } from 'nanoid'
import { RequestScopeService } from '.'
import { prisma } from '../utils.server'
import { statService } from './stat.service'

export class ProjectService extends RequestScopeService {
  async create(title: string) {
    const session = await this.getSession()
    const created = await prisma.project.create({
      data: {
        title,
        owner: {
          connect: {
            id: session.uid,
          },
        },
      },
    })

    statService.capture('project_create')

    return created
  }

  async get(
    projectId: string,
    options?: {
      select?: Prisma.ProjectSelect
    },
  ) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: options?.select,
    })

    return project
  }

  // list all projects
  async list() {
    const session = await this.getSession()
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null,
        ownerId: session.uid,
      },
    })

    return projects
  }

  // (re)generate token
  async regenerateToken(projectId: string) {
    const id = nanoid(24)
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        token: id,
      },
    })

    return id
  }

  async fetchLatestComment(
    projectId: string,
    options?: {
      from?: Date
      take?: number,
      markAsRead?: boolean
    },
  ) {
    const now = new Date()
    const results = await prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: options?.take || 20,
      where: {
        deletedAt: {
          equals: null
        },
        approved: false,
        moderatorId: {
          equals: null
        },
        page: {
          projectId,
        },
        createdAt: {
          gte: options?.from ? options?.from : undefined,
        },
      },
      select: {
        by_email: true,
        by_nickname: true,
        content: true,
        createdAt: true,
      },
    })

    if (options?.markAsRead) {
      await prisma.project.update({
        where: {
          id: projectId
        },
        data: {
          fetchLatestCommentsAt: now
        }
      })
    }

    return results
  }

  async delete(projectId: string) {
    await prisma.project.update({
      where: {
        id: projectId
      },
      data:{
        deletedAt: new Date()
      }
    })

    statService.capture('project_delete')
  }

  async isDeleted(projectId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      select: {
        deletedAt: true
      }
    })

    if (project && !project.deletedAt) {
      return false
    }

    return true
  }
}
