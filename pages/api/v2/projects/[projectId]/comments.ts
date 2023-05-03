import type { NextApiRequest, NextApiResponse } from 'next'
import { CommentService } from '../../../../../service/comment.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const commentService = new CommentService(req)

  if (req.method === 'GET') {
    // get comments
    const comments = await commentService.getLatestComments(req.query.projectId as string, Number(req.query.page as string), 10, req.query.filter as string)
    res.json({
      data: comments
    })
  }
}