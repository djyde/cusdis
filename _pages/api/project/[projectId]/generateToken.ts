/**
 * Deprecated
 */

import { NextApiRequest, NextApiResponse } from "next";
import { ProjectService } from "../../../../service/project.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const projectService = new ProjectService(req)

  if (req.method === 'POST') {
    const projectId = req.query.projectId as string
    const token = await projectService.regenerateToken(projectId)
    res.json({
      data: token
    })
  }
}