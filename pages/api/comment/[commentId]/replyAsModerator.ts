import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../../service/auth.service'
import { CommentService } from '../../../../service/comment.service'
import { apiHandler } from '../../../../utils.server'

export default apiHandler().post(async (req, res) => {
  const commentService = new CommentService(req)
  const authService = new AuthService(req, res)
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
})
