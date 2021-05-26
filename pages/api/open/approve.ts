import { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler, resolvedConfig } from '../../../utils.server'
import jwt from 'jsonwebtoken'
import { CommentService } from '../../../service/comment.service'
import {
  SecretKey,
  TokenBody,
  TokenService,
} from '../../../service/token.service'

export default apiHandler()
  .get(async (req, res) => {
    const commentService = new CommentService(req)

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
  })
  .post(async (req, res) => {
    const commentService = new CommentService(req)
    const tokenService = new TokenService()

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
      tokenBody = tokenService.validate(
        token,
        SecretKey.ApproveComment,
      ) as TokenBody.ApproveComment
    } catch (e) {
      res.status(403)
      res.send('Invalid token')
      return
    }

    // firstly, approve comment
    await commentService.approve(tokenBody.commentId)

    // then append reply
    if (replyContent) {
      await commentService.addCommentAsModerator(
        tokenBody.commentId,
        replyContent,
        {
          owner: tokenBody.owner,
        },
      )
    }

    res.json({
      message: 'success',
    })
  })
