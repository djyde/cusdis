import { NextRequest, NextResponse } from 'next/server'
import { CommentService } from '../../../../service/comment.service'
import { SecretKey, TokenBody, TokenService } from '../../../../service/token.service'
import { UsageService } from '../../../../service/usage.service'
import { SubscriptionService } from '../../../../service/subscription.service'
import { UsageLabel, usageLimitation } from '../../../../config.common'

export async function GET(request: NextRequest) {
  const commentService = new CommentService(null)
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return new NextResponse('Invalid token', { status: 403 })
  }

  const tokenService = new TokenService()

  try {
    const result = tokenService.validate(token, SecretKey.ApproveComment) as TokenBody.ApproveComment
    await commentService.approve(result.commentId)
    return new NextResponse('Approved!')
  } catch (e) {
    return new NextResponse('Invalid token', { status: 403 })
  }
}

export async function POST(request: NextRequest) {
  const commentService = new CommentService(null)
  const usageService = new UsageService(null)
  const subscriptionService = new SubscriptionService()
  const tokenService = new TokenService()

  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  const body = await request.json()
  const { replyContent } = body as {
    replyContent?: string
  }

  if (!token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  let tokenBody: TokenBody.ApproveComment

  try {
    tokenBody = tokenService.validate(token, SecretKey.ApproveComment) as TokenBody.ApproveComment
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  // check usage
  if (!await subscriptionService.quickApproveValidate(tokenBody.owner.id)) {
    return NextResponse.json({
      error: `You have reached the maximum number of Quick Approve on free plan (${usageLimitation.quick_approve}/month). Please upgrade to Pro plan to use Quick Approve more.`
    }, { status: 402 })
  }

  // firstly, approve comment
  await commentService.approve(tokenBody.commentId)

  // then append reply
  if (replyContent) {
    await commentService.addCommentAsModerator(tokenBody.commentId, replyContent, {
      owner: tokenBody.owner
    })
  }

  await usageService.incr(UsageLabel.QuickApprove)

  return NextResponse.json({
    message: 'success'
  })
}

