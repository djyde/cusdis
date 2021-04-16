import { RequestScopeService } from ".";
import { prisma } from "../utils.server";
import { PageService } from "./page.service";

export class CommentService extends RequestScopeService {

  pageService = new PageService(this.req)

  async addComment(projectId: string, pageId: string, body: {
    content: string,
    email: string,
    nickname: string
  }, parentId?: string) {

    // touch page
    const page = await this.pageService.upsertPage(pageId, projectId)

    const created = await prisma.comment.create({
      data: {
        content: body.content,
        by_email: body.email,
        by_nickname: body.nickname,
        pageId: page.id,
        parentId
      }
    })

    return created
  }
}