import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'
import { antiSpamServive } from '../../../service/antispam.service'
import {
  CommentService,
  CommentWrapper
} from '../../../service/comment.service'
import { ProjectService } from '../../../service/project.service'
import { statService } from '../../../service/stat.service'
import { initMiddleware } from '../../../utils.server'

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
  const projectService = new ProjectService(req)

  if (req.method === 'POST') {
    // add comment
    const body = req.body as {
      parentId?: string
      appId: string
      pageId: string
      content: string
      acceptNotify?: boolean
      email: string
      nickname: string
      pageUrl?: string
      pageTitle?: string
    }

    const isDeleted = await projectService.isDeleted(body.appId)

    if (isDeleted) {
      res.status(404)
      res.json({
        message: 'Project not found',
      })
      return
    }

    const opts = {
      content: body.content,
      email: body.email,
      nickname: body.nickname,
      pageTitle: body.pageTitle,
      pageUrl: body.pageUrl,
    }

    const clientIp = requestIp.getClientIp(req)
    const useragent = req.headers['user-agent']
    const status = await antiSpamServive.checkSpam({
      ...opts,
      ip: clientIp,
      useragent,
    })

    const comment = await commentService.addComment(
      body.appId,
      body.pageId,
      opts,
      body.parentId,
      status,
    )
    // send confirm email
    if (body.acceptNotify === true && body.email) {
      try {
        commentService.sendConfirmReplyNotificationEmail(
          body.email,
          body.pageTitle,
          comment.id,
        )
      } catch (e) {
        // TODO: log error
      }
    }

    statService.capture('add_comment')

    res.json({
      data: 'ok',
    })
  } else if (req.method === 'GET') {
    // get all comments
    const query = req.query as {
      page?: string
      appId: string
      pageId: string
    }

    const isDeleted = await projectService.isDeleted(query.appId)

    if (isDeleted) {
      res.status(404)
      res.json({
        data: {
          commentCount: 0,
          data: [],
          pageCount: 0,
          pageSize: 10,
        } as CommentWrapper,
      })
      return
    }

    statService.capture('get_comments', {
      properties: {
        project_id: query.appId,
        from: 'open_api',
      },
    })

    const queryCommentStat = statService.start(
      'query_comments',
      'Query Comments',
      {
        tags: {
          project_id: query.appId,
          from: 'open_api',
        },
      },
    )

    const comments = await commentService.getComments(query.appId, {
      approved: true,
      parentId: null,
      pageSlug: query.pageId,
      page: Number(query.page) || 1,
      select: {
        by_nickname: true,
      },
    })

    queryCommentStat.end()

    res.json({
      data: comments,
    })
  }
}
