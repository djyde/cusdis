import { Comment } from '@prisma/client'
import { RequestScopeService } from '.'
import { prisma, resolvedConfig } from '../utils.server'
import * as nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'

export class NotificationService extends RequestScopeService {
  // notify when new comment added
  async addComment(comment: Comment, projectId: string) {
    // check if user enable notify
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        owner: {
          select: {
            enableNewCommentNotification: true,
            notificationEmail: true,
          },
        },
      },
    })

    if (
      project.owner.enableNewCommentNotification &&
      project.owner.notificationEmail
    ) {
      if (
        resolvedConfig.smtp.auth.user !== undefined &&
        resolvedConfig.smtp.auth.pass !== undefined &&
        resolvedConfig.smtp.host !== undefined &&
        resolvedConfig.smtp.senderAddress !== undefined
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

      if (resolvedConfig.sendgrid.apiKey) {
        // send using mailgun
        try {
          sgMail.setApiKey(resolvedConfig.sendgrid.apiKey)
          const msg = {
            to: 'randypriv@gmail.com', // Change to your recipient
            from: 'notification@cusdis.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          }

          const res = await sgMail.send(msg)

        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
