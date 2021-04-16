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
}