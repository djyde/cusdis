import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { UserSession } from '.'
import { prisma, resolvedConfig } from '../utils.server'

export enum UnSubscribeType {
  NEW_COMMENT = 'NEW_COMMENT',
}

export enum SecretKey {
  ApproveComment = 'approve_comment',
  Unsubscribe = 'unsubscribe',
  AcceptNotify = 'accept_notify'
}

export module TokenBody {
  export type AcceptNotifyToken = {
    commentId: string
  }

  export type ApproveComment = {
    commentId: string,
    owner: User
  }

  export type UnsubscribeNewComment = {
    userId: string,
    type: UnSubscribeType
  }
}

export class TokenService {
  validate(token: string, secretKey: string) {
    const result = jwt.verify(token, `${resolvedConfig.jwtSecret}-${secretKey}`)
    return result
  }

  sign(secretKey: SecretKey, body, expiresIn: string) {
    return jwt.sign(body, `${resolvedConfig.jwtSecret}-${secretKey}`, {
      expiresIn,
    }) as string
  }

  async genApproveToken(commentId: string) {

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId
      },
      select: {
        page: {
          select: {
            project: {
              select: {
                owner: true
              }
            }
          }
        }
      }
    })

    return this.sign(
      SecretKey.ApproveComment,
      {
        commentId,
        owner: comment.page.project.owner,
      } as TokenBody.ApproveComment,
      '3 days',
    )
  }

  genUnsubscribeNewCommentToken(userId: string) {
    return this.sign(
      SecretKey.Unsubscribe,
      {
        userId,
        type: UnSubscribeType.NEW_COMMENT,
      } as TokenBody.UnsubscribeNewComment,
      '1y',
    )
  }

  genAcceptNotifyToken(commentId: string) {
    return this.sign(
      SecretKey.AcceptNotify,
      {
        commentId
      } as TokenBody.AcceptNotifyToken,
      '1 day'
    )
  }

  validateAcceptNotifyToken(token: string) {
    return this.validate(token, SecretKey.AcceptNotify) as TokenBody.AcceptNotifyToken
  }
}
