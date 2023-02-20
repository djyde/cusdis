import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../../../service/auth.service'
import { WebhookService } from '../../../../../service/webhook.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const authService = new AuthService(req, res)
    const webhookService = new WebhookService(req)

    if (!(await authService.authGuard())) {
      return
    }

    const { projectId, webhookUrl } = req.body as {
      projectId: string
      webhookUrl?: string
    }

    const updatedProject = await webhookService.save(projectId, webhookUrl)

    res.json({
      data: {
        project: updatedProject,
      },
    })
  }
}