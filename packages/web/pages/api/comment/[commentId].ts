import { NextApiRequest, NextApiResponse } from "next";
import { CommentService } from "../../../service/comment.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const commentService = new CommentService(req)
  if (req.method === 'DELETE') {
    await commentService.delete(req.query.commentId as string)
    res.json({
      message: 'Success'
    })
  }
}