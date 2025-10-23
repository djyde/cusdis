import { NextRequest, NextResponse } from "next/server";
import { CommentService } from "../../../../service/comment.service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const commentService = new CommentService(null)
  await commentService.delete(params.commentId)
  
  return NextResponse.json({
    message: 'Success'
  })
}

