import { NextApiRequest, NextApiResponse } from 'next'
import { resolvedConfig } from '../../../utils.server'
import jwt from 'jsonwebtoken'
import { CommentService } from '../../../service/comment.service'
import { SecretKey, TokenBody, TokenService } from '../../../service/token.service'
import { UsageService } from '../../../service/usage.service'
import { SubscriptionService } from '../../../service/subscription.service'
import { UsageLabel, usageLimitation } from '../../../config.common'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const commentService = new CommentService(req)
  const usageService = new UsageService(req)
  const subscriptionService = new SubscriptionService()

  const tokenService = new TokenService()

  if (req.method === 'GET') {
    const { token } = req.query as {
      token?: string
    }

    if (!token) {
      res.send('Invalid token')
      return
    }

    const secret = `${resolvedConfig.jwtSecret}-approve_comment`

    try {
      const result = jwt.verify(token, secret) as {
        commentId: string
      }
      await commentService.approve(result.commentId)
      res.send('Approved!')
      return
    } catch (e) {
      res.send('Invalid token')
      return
    }
  } else if (req.method === 'POST') {
    const { token } = req.query as {
      token?: string
    }

    const { replyContent } = req.body as {
      replyContent?: string
    }

    if (!token) {
      res.status(403)
      res.send('Invalid token')
      return
    }

    let tokenBody: TokenBody.ApproveComment

    try {
      tokenBody = tokenService.validate(token, SecretKey.ApproveComment) as TokenBody.ApproveComment
    } catch (e) {
      res.status(403)
      res.send('Invalid token')
      return
    }

    // check usage
    if (!await subscriptionService.quickApproveValidate(tokenBody.owner.id)) {
      res.status(402).json({
        error: `You have reached the maximum number of Quick Approve on free plan (${usageLimitation.quick_approve}/month). Please upgrade to Pro plan to use Quick Approve more.`
      })
      return
    }

    // firstly, approve comment
    await commentService.approve(tokenBody.commentId)

    // then append reply
    if (replyContent) {
      await commentService.addCommentAsModerator(tokenBody.commentId, replyContent, {
        owner: tokenBody.owner
      })
    }

    await usageService.incr(UsageLabel.QuickApprove)

    res.json({
      message: 'success'
    })
  }
}
