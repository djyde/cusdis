import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "../../service/auth.service";
import { UserService } from "../../service/user.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const userService = new UserService(req)
  const authService = new AuthService(req, res)

  if (req.method === 'PUT') {
    const {
      notificationEmail,
      enableNewCommentNotification,
      displayName
    } = req.body as {
      notificationEmail?: string
      enableNewCommentNotification?: boolean,
      displayName?: string
    }

    const user = await authService.authGuard()

    if (!user) {
      return
    }

    await userService.update(user.uid, {
      enableNewCommentNotification,
      notificationEmail,
      displayName
    })

    res.json({
      message: 'success'
    })
  }
}