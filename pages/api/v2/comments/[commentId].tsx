import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "../../../../service/auth.service";
import { CommentService } from "../../../../service/comment.service";
import { prisma } from "../../../../utils.server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const commentId: string = req.query.commentId as string
  const commentService = new CommentService(req)

  if (req.method === 'DELETE') {
    const project = await commentService.getProject(commentId)
    const authService = new AuthService(req, res)
    if (await authService.projectOwnerGuard(project)) {
      await commentService.delete(req.query.commentId as string)
    } else {
      return
    }
    res.json({
      message: 'Success'
    })
  }

  if (req.method === 'PUT') {
    const project = await commentService.getProject(commentId)
    const authService = new AuthService(req, res)

    const body = req.body as {
      approved?: boolean
    }

    if (await authService.projectOwnerGuard(project)) {
      await prisma.comment.update({
        where: {
          id: commentId
        },
        data: {
          approved: body.approved
        }
      })
    } else {
      return
    }
    res.json({
      message: 'Success'
    })
  }
}