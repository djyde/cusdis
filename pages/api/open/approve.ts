import { NextApiRequest, NextApiResponse } from "next";
import { resolvedConfig } from "../../../utils.server";
import jwt from 'jsonwebtoken'
import { CommentService } from "../../../service/comment.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const commentService = new CommentService(req)

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
  }
}