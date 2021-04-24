import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../../service/auth.service'
import { CommentService } from '../../../../service/comment.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const commentService = new CommentService(req)
  const authService = new AuthService(req, res)

  if (req.method === 'POST') {
    const body = req.body as {
      content: string
      ancestorId: string
    }
    const commentId = req.query.commentId as string

    const project = await commentService.getProject(commentId)
    if (!(await authService.projectOwnerGuard(project))) {
      return
    }
    const created = await commentService.addCommentAsModeratorV2(
      commentId,
      body.content,
      body.ancestorId,
    )
    res.json({
      data: created,
    })
  }
}
