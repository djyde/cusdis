import { Project } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../../service/auth.service'
import { CommentService } from '../../../../service/comment.service'
import { ProjectService } from '../../../../service/project.service'
import { statService } from '../../../../service/stat.service'

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

    const timezoneOffsetInHour = req.headers['x-timezone-offset'] || 0

    // only owner can get comments
    const project = (await projectService.get(projectId, {
      select: {
        ownerId: true,
      },
    })) as Pick<Project, 'ownerId'>

    if (!(await authService.projectOwnerGuard(project))) {
      return
    }

    const queryCommentStat = statService.start('query_comments', 'Query Comments', {
      tags: {
        project_id: projectId,
        from: 'dashboard'
      }
    })

    const comments = await commentService.getComments(projectId, Number(timezoneOffsetInHour), {
      parentId: null,
      page: Number(page),
      onlyOwn: true,
      select: {
        by_nickname: true,
        by_email: true,
        approved: true,
      },
    })

    queryCommentStat.end()

    res.json({
      data: comments,
    })
  }
}
