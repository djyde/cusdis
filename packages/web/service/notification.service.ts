import { Comment } from '@prisma/client'
import { RequestScopeService } from '.'
import { getSession, prisma, resolvedConfig } from '../utils.server'
import { UserService } from './user.service'
import { markdown } from './comment.service'
import { TokenService } from './token.service'
import { EmailService } from './email.service'
import { makeNewCommentEmailTemplate } from '../templates/new_comment'

export class NotificationService extends RequestScopeService {
  userService = new UserService(this.req)
  tokenService = new TokenService()
  emailService = new EmailService()

  // notify when new comment added
  async addComment(comment: Comment, projectId: string) {
    // don't notify if comment is created by moderator
    if (comment.moderatorId) {
      return
    }

    // check if user enable notify
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        enableNotification: true,
        owner: {
          select: {
            id: true,
            email: true,
            enableNewCommentNotification: true,
            notificationEmail: true,
          },
        },
      },
    })

    // don't notify if disable in project settings
    if (!project.enableNotification) {
      return
    }

    const fullComment = await prisma.comment.findUnique({
      where: {
        id: comment.id,
      },
      select: {
        page: {
          select: {
            title: true,
            slug: true,
            project: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    const notificationEmail =
      project.owner.notificationEmail || project.owner.email

    if (project.owner.enableNewCommentNotification) {
      let unsubscribeToken = this.tokenService.genUnsubscribeNewCommentToken(
        project.owner.id,
      )

      const approveToken = await this.tokenService.genApproveToken(comment.id)

      const msg = {
        to: notificationEmail, // Change to your recipient
        from: resolvedConfig.smtp.senderAddress,
        subject: `New comment on "${fullComment.page.project.title}"`,
        html: makeNewCommentEmailTemplate({
          page_slug: fullComment.page.title || fullComment.page.slug,
          by_nickname: comment.by_nickname,
          approve_link: `${resolvedConfig.host}/open/approve?token=${approveToken}`,
          unsubscribe_link: `${resolvedConfig.host}/api/open/unsubscribe?token=${unsubscribeToken}`,
          content: markdown.render(comment.content),
          notification_preferences_link: `${resolvedConfig.host}/user`,
        }),
      }

      try {
        this.emailService.send(msg)
      } catch (e) {
        // TODO:
      }
    }
  }
}
