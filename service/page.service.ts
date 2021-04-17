import { RequestScopeService } from ".";
import { prisma } from "../utils.server";

export class PageService extends RequestScopeService {
  async upsertPage(
    slug: string,
    projectId: string,
    options?: {
      pageUrl?: string;
      pageTitle?: string;
    }
  ) {
    const exist = await prisma.page.findFirst({
      where: {
        projectId,
        slug,
      },
    });

    if (!exist) {
      return await prisma.page.create({
        data: {
          title: options?.pageTitle,
          url: options?.pageUrl,
          slug,
          projectId,
        },
      });
    } else {
      return exist;
    }
  }
}