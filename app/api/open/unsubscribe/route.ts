import { NextRequest, NextResponse } from 'next/server'
import { resolvedConfig } from '../../../../utils.server'
import jwt from 'jsonwebtoken'
import { UserService } from '../../../../service/user.service'
import { UnSubscribeType } from '../../../../service/token.service'

export async function GET(request: NextRequest) {
  const userService = new UserService(null)

  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return new NextResponse('Invalid token', { status: 403 })
  }

  const secret = `${resolvedConfig.jwtSecret}-unsubscribe`

  try {
    const result = jwt.verify(token, secret) as {
      type: UnSubscribeType
      userId: string
    }

    switch (result.type) {
      case UnSubscribeType.NEW_COMMENT:
        {
          await userService.update(result.userId, {
            enableNewCommentNotification: false,
          })
        }
        break
    }

    return new NextResponse('Unsubscribe!')
  } catch (e) {
    return new NextResponse('Invalid token', { status: 403 })
  }
}

