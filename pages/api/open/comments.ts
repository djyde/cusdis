import { NextApiRequest, NextApiResponse } from 'next'
import { CommentService } from '../../../service/comment.service'
import { initMiddleware } from '../../../utils.server'
import Cors from 'cors'

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await cors(req, res)

  const commentService = new CommentService(req)

  if (req.method === 'POST') {
    // add comment
    const body = req.body as {
      parentId?: string
      appId: string
      pageId: string
      content: string
      email: string
      nickname: string
      pageUrl?: string
      pageTitle?: string
    }

    const comment = await commentService.addComment(
      body.appId,
      body.pageId,
      {
        content: body.content,
        email: body.email,
        nickname: body.nickname,
      },
      body.parentId,
    )

    res.json({
      data: comment,
    })
  } else if (req.method === 'GET') {
    // get all comments
    const query = req.query as {
      appId: string
      pageId: string
    }

    const comments = await commentService.getComments(query.appId, {
      approved: true,
      parentId: null,
      pageSlug: query.pageId,
      select: {
        by_nickname: true,
      },
    })

    res.json({
      data: comments,
    })
  }
}
