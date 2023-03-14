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
    }
    const commentId = req.query.commentId as string

    const project = await commentService.getProject(commentId)
    if (!(await authService.projectOwnerGuard(project))) {
      return
    }
    const created = await commentService.addCommentAsModerator(
      commentId,
      body.content,
    )
    res.json({
      data: created,
    })
  }
}
