import { NextApiRequest, NextApiResponse } from "next";
import { CommentService } from "../../../../service/comment.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const commentService = new CommentService(req)
  if (req.method === 'POST') {
    const body = req.body as {
      content: string
    }
    const created = await commentService.addCommentAsModerator(req.query.commentId as string, body.content)
    res.json({
      data: created
    })
  }
}