import { NextApiRequest, NextApiResponse } from 'next'
import { ProjectService } from '../../service/project.service'
import { apiHandler } from '../../utils.server'

export default apiHandler()
  .get(async (req, res) => {
    const projectService = new ProjectService(req)
    const projects = await projectService.list()
    res.json({
      data: projects,
    })
  })
  .post(async (req, res) => {
    const projectService = new ProjectService(req)

    const { title } = req.body as {
      title: string
    }
    const created = await projectService.create(title)

    res.json({
      data: {
        id: created.id,
      },
    })
  })
