import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../service/auth.service'
import { ProjectService } from '../../../service/project.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const authService = new AuthService(req, res)
    const projectService = new ProjectService(req)
    if (!(await authService.authGuard())) {
      return
    }

    let { title } = req.body as {
      title?: string
    }

    if (!title) {
      title = 'Untitled'
    }

    const project = await projectService.create(title)

    res.json({
      data: {
        projectId: project.id,
      },
    })
  }
}
