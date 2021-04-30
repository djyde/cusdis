import jwt from 'jsonwebtoken'
import { resolvedConfig } from '../utils.server'


export enum UnSubscribeType {
  NEW_COMMENT = 'NEW_COMMENT',
}

export enum SecretKey {
  ApproveComment = 'approve_comment',
  Unsubscribe = 'unsubscribe'
}

export class TokenService {

  validate(token: string, secretKey: string) {
    const result = jwt.verify(token, `${resolvedConfig.jwtSecret}-${secretKey}`)
    return result
  }

  genApproveToken(commentId: string) {
    return jwt.sign(
      {
        commentId,
      },
      `${resolvedConfig.jwtSecret}-${SecretKey.ApproveComment}`,
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
      `${resolvedConfig.jwtSecret}-${SecretKey.Unsubscribe}`,
      {
        expiresIn: '1y',
      },
    ) as string
  }
}