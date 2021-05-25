import { NextApiRequest, NextApiResponse } from 'next'
import {
  CommentService,
  CommentWrapper,
} from '../../../service/comment.service'
import { apiHandler } from '../../../utils.server'
import Cors from 'cors'
import { ProjectService } from '../../../service/project.service'
import { statService } from '../../../service/stat.service'

export default apiHandler()
  .use(
    Cors({
      // Only allow requests with GET, POST and OPTIONS
      methods: ['GET', 'POST', 'OPTIONS'],
    }),
  )
  .get(async (req, res) => {
    const commentService = new CommentService(req)
    const projectService = new ProjectService(req)

    // get all comments
    const query = req.query as {
      page?: string
      appId: string
      pageId: string
    }

    const timezoneOffsetInHour = req.headers['x-timezone-offset']

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
      identity: query.appId,
      properties: {
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

    const comments = await commentService.getComments(
      query.appId,
      Number(timezoneOffsetInHour),
      {
        approved: true,
        parentId: null,
        pageSlug: query.pageId,
        page: Number(query.page) || 1,
        select: {
          by_nickname: true,
        },
      },
    )

    queryCommentStat.end()

    res.json({
      data: comments,
    })
  })
  .post(async (req, res) => {
    const commentService = new CommentService(req)
    const projectService = new ProjectService(req)
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

    const comment = await commentService.addComment(
      body.appId,
      body.pageId,
      {
        content: body.content,
        email: body.email,
        nickname: body.nickname,
        pageTitle: body.pageTitle,
        pageUrl: body.pageUrl,
      },
      body.parentId,
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
      data: comment,
    })
  })
