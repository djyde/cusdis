import { Page, Comment } from ".prisma/client";
import { nanoid } from "nanoid";
import { RequestScopeService } from ".";
import { prisma } from "../utils.server";

export class UserService extends RequestScopeService {
  async update(userId: string, options: {
    notificationEmail?: string,
    enableNewCommentNotification?: boolean
  }) {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        notificationEmail: options.notificationEmail,
        enableNewCommentNotification: options.enableNewCommentNotification
      }
    })
  }

  async delete(userId: string) {
    await prisma.user.delete({
      where: {
        id: userId
      }
    })
  }
}