import { NextApiRequest, NextApiResponse } from 'next'
import { resolvedConfig } from '../../../utils.server'
import jwt from 'jsonwebtoken'
import { UserService } from '../../../service/user.service'
import { UnSubscribeType } from '../../../service/token.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userService = new UserService(req)

  if (req.method === 'GET') {
    const { token } = req.query as {
      token?: string
    }

    if (!token) {
      res.send('Invalid token')
      return
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

      res.send('Unsubscribe!')
      return
    } catch (e) {
      res.send('Invalid token')
      return
    }
  }
}
