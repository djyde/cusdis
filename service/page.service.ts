import { RequestScopeService } from ".";
import { prisma } from "../utils.server";

export class PageService extends RequestScopeService {
  async upsertPage(slug: string, projectId: string) {

    const exist = await prisma.page.findFirst({
      where: {
        projectId,
        slug
      }
    })

    if (!exist) {
      return await prisma.page.create({
        data: {
          slug,
          projectId
        }
      })
    } else {
      return exist
    }
  }
}