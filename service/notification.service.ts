import { Comment } from "@prisma/client";
import { RequestScopeService } from ".";
import { prisma, resolvedConfig } from "../utils.server";
import * as nodemailer from 'nodemailer'

export class NotificationService extends RequestScopeService {

  // notify when new comment added
  async addComment(comment: Comment, projectId: string) {
    // check if user enable notify
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      select: {
        owner: {
          select: {
            enableNewCommentNotification: true,
            notificationEmail: true
          }
        }
      }
    })

    if (project.owner.enableNewCommentNotification && project.owner.notificationEmail) {
      if (
        resolvedConfig.smtp.auth.user !== 'undefined' &&
        resolvedConfig.smtp.auth.pass !== 'undefined' &&
        resolvedConfig.smtp.host !== 'undefined' &&
        resolvedConfig.smtp.senderAddress !== 'undefined'
      ) {
        // send mail using smtp
        console.log({
          host: resolvedConfig.smtp.host,
          port: resolvedConfig.smtp.port,
          secure: resolvedConfig.smtp.secure,
          auth: resolvedConfig.smtp.auth,
        })
        const transporter = nodemailer.createTransport({
          host: resolvedConfig.smtp.host,
          port: resolvedConfig.smtp.port,
          secure: resolvedConfig.smtp.secure,
          auth: resolvedConfig.smtp.auth,
        })

        const info = await transporter.sendMail({
          from: resolvedConfig.smtp.senderAddress,
          to: project.owner.notificationEmail,
          subject: `New comment`,
          text: `${comment.content}`,
        })

        console.log(info)
      }
    }
  }
}