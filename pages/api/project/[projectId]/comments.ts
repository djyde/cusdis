import { NextApiRequest, NextApiResponse } from "next";
import { CommentService } from "../../../../service/comment.service";
import { ProjectService } from "../../../../service/project.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectService = new ProjectService(req)
  const commentService = new CommentService(req)
  if (req.method === 'GET') {
    const { projectId, page } = req.query as {
      projectId: string
      page: string
    }
    const comments = await commentService.getComments(projectId, {
      parentId: null,
      page: Number(page),
      onlyOwn: true,
      select: {
        by_nickname: true,
        by_email: true
      }
    })
    res.json({
      data: comments
    })
  }
}