import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../../../service/auth.service";
import { UserService } from "../../../service/user.service";

export async function PUT(request: NextRequest) {
  const userService = new UserService(null)
  const authService = new AuthService(null, null)

  const body = await request.json()
  const {
    notificationEmail,
    enableNewCommentNotification,
    displayName
  } = body as {
    notificationEmail?: string
    enableNewCommentNotification?: boolean,
    displayName?: string
  }

  const user = await authService.authGuard()

  if (!user) {
    return NextResponse.json({
      error: 'Unauthorized'
    }, { status: 401 })
  }

  await userService.update(user.uid, {
    enableNewCommentNotification,
    notificationEmail,
    displayName
  })

  return NextResponse.json({
    message: 'success'
  })
}

