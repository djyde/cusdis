import { RequestScopeService } from ".";
import { prisma } from "../utils.server";

export class PageService extends RequestScopeService {
  async upsertPage(id: string, projectId: string) {
    const exist = await prisma.page.findFirst({
      where: {
        projectId,
        id
      }
    })

    if (!exist) {
      return await prisma.page.create({
        data: {
          id,
          projectId
        }
      })
    } else {
      return exist
    }
  }
}