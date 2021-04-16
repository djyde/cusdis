import { NextApiRequest, NextApiResponse } from "next";
import { CommentService } from "../../../service/comment.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const commentService = new CommentService(req)

  if (req.method === 'POST') {
    // add comment
    const body = req.body as {
      parentId?: string
      projectId: string,
      pageId: string,
      content: string,
      email: string,
      nickname: string
    }

    const comment = await commentService.addComment(body.projectId, body.pageId, {
      content: body.content,
      email: body.email,
      nickname: body.nickname,
    }, body.parentId)

    res.json({
      data: comment
    })
  }
}