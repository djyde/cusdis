import { nanoid } from "nanoid";
import { RequestScopeService } from ".";
import { prisma } from "../utils.server";

export class UserService extends RequestScopeService {
  async update(userId: string, options: {
    displayName?: string,
    notificationEmail?: string,
    enableNewCommentNotification?: boolean
  }) {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        displayName: options.displayName,
        notificationEmail: options.notificationEmail,
        enableNewCommentNotification: options.enableNewCommentNotification
      }
    })
  }
}