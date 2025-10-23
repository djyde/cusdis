import { NextRequest, NextResponse } from 'next/server'
import {
  CommentService,
  CommentWrapper,
} from '../../../../service/comment.service'
import { ProjectService } from '../../../../service/project.service'
import { statService } from '../../../../service/stat.service'

export async function GET(request: NextRequest) {
  const commentService = new CommentService(null)
  const projectService = new ProjectService(null)

  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const appId = searchParams.get('appId') || ''
  const pageId = searchParams.get('pageId') || ''

  const timezoneOffset = request.headers.get('x-timezone-offset') || '0'

  const isDeleted = await projectService.isDeleted(appId)

  if (isDeleted) {
    return NextResponse.json({
      data: {
        commentCount: 0,
        data: [],
        pageCount: 0,
        pageSize: 10,
      } as CommentWrapper,
    }, { status: 404 })
  }

  statService.capture('get_comments', {
    identity: appId,
    properties: {
      from: 'open_api',
    },
  })

  const queryCommentStat = statService.start(
    'query_comments',
    'Query Comments',
    {
      tags: {
        project_id: appId,
        from: 'open_api',
      },
    },
  )

  const comments = await commentService.getComments(
    appId,
    Number(timezoneOffset),
    {
      approved: true,
      parentId: undefined,
      pageSlug: pageId || undefined,
      page: Number(page) || 1,
      select: {
        by_nickname: true,
        moderator: {
          select: {
            displayName: true
          }
        }
      },
    },
  )

  queryCommentStat.end()

  return NextResponse.json({
    data: comments,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }
  })
}

export async function POST(request: NextRequest) {
  const commentService = new CommentService(null)
  const projectService = new ProjectService(null)
  
  const body = await request.json()
  const {
    parentId,
    appId,
    pageId,
    content,
    acceptNotify,
    email,
    nickname,
    pageUrl,
    pageTitle
  } = body as {
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

  const isDeleted = await projectService.isDeleted(appId)

  if (isDeleted) {
    return NextResponse.json({
      message: 'Project not found',
    }, { status: 404 })
  }

  const comment = await commentService.addComment(
    appId,
    pageId,
    {
      content,
      email,
      nickname,
      pageTitle,
      pageUrl,
    },
    parentId,
  )

  // send confirm email
  if (acceptNotify === true && email) {
    try {
      commentService.sendConfirmReplyNotificationEmail(
        email,
        pageTitle || '',
        comment.id,
      )
    } catch (e) {
      // TODO: log error
    }
  }

  statService.capture('add_comment')

  return NextResponse.json({
    data: comment,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }
  })
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-timezone-offset',
    }
  })
}

