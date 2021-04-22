import { Project } from '.prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../../service/auth.service'
import { CommentService } from '../../../../service/comment.service'
import { ProjectService } from '../../../../service/project.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const projectService = new ProjectService(req)
  const commentService = new CommentService(req)
  const authService = new AuthService(req, res)
  if (req.method === 'GET') {
    const { projectId, page } = req.query as {
      projectId: string
      page: string
    }

    // only owner can get comments
    const project = await projectService.get(projectId, {
      select: {
        ownerId: true
      }
    }) as Pick<Project, "ownerId">

    if (!await authService.projectOwnerGuard(project)) {
      return
    }

    const comments = await commentService.getComments(projectId, {
      parentId: null,
      page: Number(page),
      onlyOwn: true,
      select: {
        by_nickname: true,
        by_email: true,
        approved: true,
      },
    })
    res.json({
      data: comments,
    })
  }
}
