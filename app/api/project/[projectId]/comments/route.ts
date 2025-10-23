import { Project } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../../../../../service/auth.service'
import { CommentService } from '../../../../../service/comment.service'
import { ProjectService } from '../../../../../service/project.service'
import { statService } from '../../../../../service/stat.service'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const projectService = new ProjectService(null)
  const commentService = new CommentService(null)
  const authService = new AuthService(null, null)
  
  const { searchParams } = new URL(request.url)
  const { projectId } = params
  const page = searchParams.get('page') || '1'

  const timezoneOffset = request.headers.get('x-timezone-offset') || '0'

  // only owner can get comments
  const project = (await projectService.get(projectId, {
    select: {
      ownerId: true,
    },
  })) as Pick<Project, 'ownerId'>

  if (!(await authService.projectOwnerGuard(project))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const queryCommentStat = statService.start('query_comments', 'Query Comments', {
    tags: {
      project_id: projectId,
      from: 'dashboard'
    }
  })

  const comments = await commentService.getComments(projectId, Number(timezoneOffset), {
    page: Number(page),
    onlyOwn: true,
    select: {
      by_nickname: true,
      by_email: true,
      approved: true,
    },
  })

  queryCommentStat.end()

  return NextResponse.json({
    data: comments,
  })
}

