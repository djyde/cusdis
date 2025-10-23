import { NextRequest, NextResponse } from 'next/server'
import { UsageLabel, usageLimitation } from '../../../../../config.common'
import { AuthService } from '../../../../../service/auth.service'
import { CommentService } from '../../../../../service/comment.service'
import { SubscriptionService } from '../../../../../service/subscription.service'
import { UsageService } from '../../../../../service/usage.service'
import { getSession } from '../../../../../utils.server'

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const commentService = new CommentService(null)
  const authService = new AuthService(null, null)
  const usageService = new UsageService(null)
  const session = await getSession(null)

  const subscriptionService = new SubscriptionService()

  const commentId = params.commentId

  // only project owner can approve
  const project = await commentService.getProject(commentId)
  if (!(await authService.projectOwnerGuard(project))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // check usage
  if (!await subscriptionService.approveCommentValidate(session.uid)) {
    return NextResponse.json({
      error:
        `You have reached the maximum number of approving comments on free plan (${usageLimitation['approve_comment']}/month). Please upgrade to Pro plan to approve more comments.`,
    }, { status: 402 })
  }

  await commentService.approve(commentId)
  await usageService.incr(UsageLabel.ApproveComment)

  return NextResponse.json({
    message: 'success',
  })
}

