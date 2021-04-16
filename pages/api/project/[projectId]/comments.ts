import { NextApiRequest, NextApiResponse } from "next";
import { ProjectService } from "../../../../service/project.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectService = new ProjectService(req)
  if (req.method === 'GET') {
    const { projectId } = req.query as {
      projectId: string
    }
    const comments = await projectService.listComments(projectId)
    res.json({
      data: comments
    })
  }
}