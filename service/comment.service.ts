import { Comment } from "@prisma/client";
import { RequestScopeService } from ".";
import { prisma } from "../utils.server";
import { PageService } from "./page.service";
import dayjs from "dayjs";

export class CommentService extends RequestScopeService {
  pageService = new PageService(this.req);

  async getComments(
    projectId: string,
    pageSlug: string,
    parentId: string | null = null
  ) {
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        parentId,
        page: {
          slug: pageSlug,
          projectId,
        },
      },
    });

    const allComments = await Promise.all(
      comments.map(async (comment) => {
        // get replies
        const replies = await this.getComments(projectId, pageSlug, comment.id);
        const parsedCreatedAt = dayjs(comment.createdAt).format(
          "YYYY-MM-DD HH:mm"
        );
        if (replies.length) {
          return {
            ...comment,
            replies,
            parsedCreatedAt,
          };
        } else {
          return {
            ...comment,
            replies: [],
            parsedCreatedAt
          };
        }
      })
    );

    return allComments as Comment[];
  }

  async addComment(
    projectId: string,
    pageSlug: string,
    body: {
      content: string;
      email: string;
      nickname: string;
    },
    parentId?: string
  ) {
    // touch page
    const page = await this.pageService.upsertPage(pageSlug, projectId);

    const created = await prisma.comment.create({
      data: {
        content: body.content,
        by_email: body.email,
        by_nickname: body.nickname,
        pageId: page.id,
        parentId,
      },
    });

    return created;
  }
}
