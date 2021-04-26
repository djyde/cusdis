import jwt from 'jsonwebtoken'
import { resolvedConfig } from '../utils.server'


export enum UnSubscribeType {
  NEW_COMMENT = 'NEW_COMMENT',
}

export class TokenService {
  genApproveToken(commentId: string) {
    return jwt.sign(
      {
        commentId,
      },
      `${resolvedConfig.jwtSecret}-approve_comment`,
      {
        expiresIn: '31 days',
      },
    ) as string
  }

  genUnsubscribeNewCommentToken(userId: string) {
    return jwt.sign(
      {
        userId,
        type: UnSubscribeType.NEW_COMMENT,
      },
      `${resolvedConfig.jwtSecret}-unsubscribe`,
      {
        expiresIn: '1y',
      },
    ) as string
  }
}