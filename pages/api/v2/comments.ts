import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { CommentService } from '../../../service/comment.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  if (req.method === 'GET') {
    // get comments
    res.json({})
  }

  if (req.method === 'POST') {
    const session = await getSession({ req })
    const registeredComment: boolean = !!session

    // TODO: validate body

    const commentService = new CommentService(req)
    // create comment
    const body = req.body as {
      projectId: string
      pageId?: string
      comment: string
      username?: string
      pageUrl?: string
      pageTitle?: string
      email?: string
      parentId?: string
    }

    // TODO: check pageId, pageUrl
    const pageId = body.pageId || body.pageUrl

    if (Object.keys(body).length === 0) {
      res.status(400).json({ error: 'Invalid body' })
      return
    }

    const comment = commentService.addComment(
      body.projectId,
      pageId,
      {
        content: body.comment,
        email: body.email,
        nickname: body.username,
        pageUrl: body.pageUrl,
        pageTitle: body.pageTitle,
      },
      body.parentId,
      session?.uid
    )

    res.json({})
  }
}
