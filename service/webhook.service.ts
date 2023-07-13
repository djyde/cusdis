import { Comment } from '@prisma/client'
import axios from 'axios'
import { RequestScopeService } from '.'
import { prisma, resolvedConfig, sentry } from '../utils.server'
import { statService } from './stat.service'
import { TokenService } from './token.service'

export enum HookType {
  NewComment = 'new_comment',
}

export type HookBody<T> = {
  type: HookType
  data: T
}

export type NewCommentHookData = {
  by_nickname: string
  by_email: string
  project_title: string
  page_id: string
  page_title: string
  content: string
}

export class WebhookService extends RequestScopeService {
  tokenService = new TokenService()

  async addComment(comment: Comment, projectId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    })

    if (project.enableWebhook && !comment.moderatorId && project.webhook) {

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
                  title: true
                }
              }
            },
          },
        },
      })

      const approveToken = await this.tokenService.genApproveToken(comment.id)
      const approveLink = `${resolvedConfig.host}/open/approve?token=${approveToken}`

      statService.capture('webhook_trigger', {
        properties: {
          from: 'add_comment',
        },
      })

      try {
        axios.post(project.webhook, {
          type: HookType.NewComment,
          data: {
            by_nickname: comment.by_nickname,
            by_email: comment.by_email,
            content: comment.content,
            page_id: fullComment.page.slug,
            page_title: fullComment.page.title,
            project_title: fullComment.page.project.title,
            approve_link: approveLink,
          },
        } as HookBody<NewCommentHookData>)
      } catch (e) {
        
      }
    }
  }
}
