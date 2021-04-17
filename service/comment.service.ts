import { Comment, Prisma } from "@prisma/client";
import { RequestScopeService } from ".";
import { prisma } from "../utils.server";
import { PageService } from "./page.service";
import dayjs from "dayjs";

export class CommentService extends RequestScopeService {
  pageService = new PageService(this.req);

  async getComments(
    projectId: string,
    pageSlug: string,
    options?: {
      include?: Prisma.CommentInclude,
      parentId?: string
    }
  ) {
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: options?.include,
      where: {
        approved: true,
        parentId: options?.parentId,
        deletedAt: {
          equals: null,
        },
        page: {
          slug: pageSlug,
          projectId,
        },
      },
    });

    const allComments = await Promise.all(
      comments.map(async (comment) => {
        // get replies
        const replies = await this.getComments(projectId, pageSlug, {
          parentId: comment.id
        });
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
            parsedCreatedAt,
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

  async addCommentAsModerator(
    parentId: string,
    content: string
  ) {
    const session = await this.getSession()
    const parent = await prisma.comment.findUnique({
      where: {
        id: parentId
      }
    })

    const created = await prisma.comment.create({
      data: {
        content: content,
        by_email: session.user.email,
        by_nickname: session.user.name,
        moderatorId: session.uid,
        pageId: parent.pageId,
        approved: true,
        parentId,
      },
    });

    return created;
  }

  async approve(commentId: string) {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        approved: true,
      },
    });
  }

  async delete(commentId: string) {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
