import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '../../../../service/auth.service'
import { prisma } from '../../../../utils.server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectId = req.query.projectId as string
  const authService = new AuthService(req, res)

  if (req.method === 'PUT') {
    const body = req.body as {
      webhookUrl?: string
      title?: string,
      enableNotification?: boolean,
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      select: {
        ownerId: true
      }
    })

    if (!project) {
      res.status(404).json({
        message: 'Website not found'
      })
      return
    }

    if (!await authService.projectOwnerGuard(project)) {
      return
    }

    await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        // TODO: validate
        webhook: body.webhookUrl,
        title: body.title,
        enableNotification: body.enableNotification
      }
    })
    res.json({
      message: 'success'
    })
  }

  if (req.method === 'DELETE') {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    })

    if (!project) {
      res.status(404).json({
        message: 'Website not found'
      })
      return
    }

    if (!await authService.projectOwnerGuard(project)) {
      return
    } 


    await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        deletedAt: new Date()
      }
    })

    res.json({
      message: 'success'
    })
  }
}