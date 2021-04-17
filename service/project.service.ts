import { User } from "@prisma/client";
import { RequestScopeService } from ".";
import { prisma } from "../utils.server";

export class ProjectService extends RequestScopeService {

  async create(title: string) {
    const session = await this.getSession()
    const created = await prisma.project.create({
      data: {
        title,
        owner: {
          connect: {
            id: session.uid
          }
        }
      }
    })

    return created
  }

  async get(projectId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    })

    return project
  }

  // list all projects
  async list() {
    const session = await this.getSession();
    const projects = await prisma.project.findMany({
      where: {
        ownerId: session.uid,
      }
    })

    return projects
  }

  // list all comments
  async listComments(projectId: string) {
    const comments = await prisma.comment.findMany({
      orderBy: {
        'createdAt': 'desc'
      },
      where: {
        page: {
          projectId
        },
        deletedAt: {
          equals: null
        }
      },
      include: {
        page: true
      }
    })

    return comments
  }
}