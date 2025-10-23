import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../../../../../service/auth.service'
import { CommentService } from '../../../../../service/comment.service'

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const commentService = new CommentService(null)
  const authService = new AuthService(null, null)

  const body = await request.json()
  const { content } = body as {
    content: string
  }
  const commentId = params.commentId

  const project = await commentService.getProject(commentId)
  if (!(await authService.projectOwnerGuard(project))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const created = await commentService.addCommentAsModerator(
    commentId,
    content,
  )
  
  return NextResponse.json({
    data: created,
  })
}

