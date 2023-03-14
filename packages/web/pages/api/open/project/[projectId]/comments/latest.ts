import { NextApiRequest, NextApiResponse } from "next";
import { ProjectService } from "../../../../../../service/project.service";
import { prisma } from "../../../../../../utils.server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectService = new ProjectService(req)
  if (req.method === 'GET') {
    const { projectId, token } = req.query as {
      projectId: string,
      token?: string
    }

    if (!token) {
      res.status(403)
      res.json({
        message: 'Invalid token'
      })
      return
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      select:{
        token: true,
        fetchLatestCommentsAt: true
      }
    })

    if (project.token !== token) {
      res.status(403)
      res.json({
        message: 'Invalid token',
      })
      return
    }

    const comments = await projectService.fetchLatestComment(projectId, {
      from: project.fetchLatestCommentsAt,
      markAsRead: true
    })

    res.json({
      comments: comments
    })
  }
}