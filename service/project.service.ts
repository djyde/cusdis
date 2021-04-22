import { Prisma, User } from "@prisma/client";
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

  async get(projectId: string, options?: {
    select?: Prisma.ProjectSelect
  }) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      select: options?.select
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

}