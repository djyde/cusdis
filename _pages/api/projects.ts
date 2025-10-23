import { NextApiRequest, NextApiResponse } from "next";
import { ProjectService } from "../../service/project.service";
import { SubscriptionService } from "../../service/subscription.service";
import { getSession, prisma } from "../../utils.server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectService = new ProjectService(req)
  const subscriptionService = new SubscriptionService()
  const session = await getSession(req)

  if (req.method === 'POST') {
    if (!session) {
      res.status(401).json({
        error: 'Unauthorized'
      })
      return
    }

    // check subscription
    if (!await subscriptionService.createProjectValidate(session.uid)) {
    // if (true) {
      res.status(402).json({
        error: 'You have reached the maximum number of sites on free plan. Please upgrade to Pro plan to create more sites.'
      })
      return
    }

    const { title } = req.body as {
      title: string
    }

    const created = await projectService.create(title)

    res.json({
      data: {
        id: created.id
      }
    })
  } else if (req.method === 'GET') {
    const projects = await projectService.list()
    res.json({
      data: projects
    })
  }
}