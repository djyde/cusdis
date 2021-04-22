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
    const commentId = req.query.commentId as string

    // only project owner can approve
    const project = await commentService.getProject(commentId)
    if (!(await authService.projectOwnerGuard(project))) {
      return
    }

    await commentService.approve(commentId)
    res.json({
      message: 'success',
    })
  }
}
