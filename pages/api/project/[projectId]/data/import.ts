import { NextApiRequest, NextApiResponse } from 'next'

import formidable from 'formidable'
import { DataService } from '../../../../../service/data.service'
import * as fs from 'fs'
import { AuthService } from '../../../../../service/auth.service'
import { ProjectService } from '../../../../../service/project.service'
import { Project } from '@prisma/client'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authService = new AuthService(req, res)
  const projectService = new ProjectService(req)

  if (req.method === 'POST') {
    const form = new formidable.IncomingForm()

    const dataService = new DataService()

    const { projectId } = req.query as {
      projectId: string
    }

    // only owner can import
    const project = (await projectService.get(projectId, {
      select: {
        ownerId: true,
      },
    })) as Pick<Project, 'ownerId'>

    if (!(await authService.projectOwnerGuard(project))) {
      return
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(503)
        res.json({
          message: err.message,
        })
        return
      }

      const imported = await dataService.importFromDisqus(
        projectId,
        fs.readFileSync(files.file.path, { encoding: 'utf-8' }),
      )

      res.json({
        data: {
          pageCount: imported.threads.length,
          commentCount: imported.posts.length,
        },
      })
    })
  }
}
