import { Comment } from '@prisma/client'
import { RequestScopeService } from '.'
import { prisma, resolvedConfig } from '../utils.server'
import * as nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'
import { UserService } from './user.service'

import MarkdownIt from 'markdown-it'
const markdown = MarkdownIt({
  linkify: true,
})

export class NotificationService extends RequestScopeService {

  userService = new UserService(this.req)

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
            id: true,
            email: true,
            enableNewCommentNotification: true,
            notificationEmail: true,
            unsubscribeNewCommentToken: true
          },
        },
      },
    })

    const fullComment = await prisma.comment.findUnique({
      where: {
        id: comment.id
      },
      select: {
        page: {
          select: {
            slug: true
          }
        }
      }
    })

    const notificationEmail = project.owner.notificationEmail || project.owner.email

    if (
      project.owner.enableNewCommentNotification
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
          to: notificationEmail,
          subject: `New comment`,
          text: `${comment.content}`,
        })

        console.log(info)
      }

      if (resolvedConfig.sendgrid.apiKey) {

        let unsubscribeToken = project.owner.unsubscribeNewCommentToken

        if (!unsubscribeToken) {
          unsubscribeToken = await this.userService.generateUnsubscribeNewCommentToken(project.owner.id)
        }

        // send using mailgun
        try {
          sgMail.setApiKey(resolvedConfig.sendgrid.apiKey)
          const msg = {
            to: notificationEmail, // Change to your recipient
            from: 'Cusdis Notification<notification@cusdis.com>', // Change to your verified sender
            subject: 'New comment in your website',
            html: markdown.render(`**${comment.by_nickname}** comments in page '${fullComment.page.slug}':

---

${comment.content}

---

[Unsubscribe](https://cusdis.com/api/open/unsubscribe?token=${unsubscribeToken}&type=new_comment) it if you don't want to receive new comment notification.

Thanks for using [Cusdis](https://cusdis.com)
            `)
          }

          const res = await sgMail.send(msg)

        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
