import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "../../../../service/auth.service";
import { CommentService } from "../../../../service/comment.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const commentId: string = req.query.commentId as string
    const commentService = new CommentService(req)
    const project = await commentService.getProject(commentId)
    const authService = new AuthService(req, res)
    if (!(await authService.projectOwnerGuard(project)))
      await commentService.delete(req.query.commentId as string)
    res.json({
      message: 'Success'
    })
  }
}