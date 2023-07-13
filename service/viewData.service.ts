// A service for rendering page

import { RequestScopeService, UserSession } from ".";
import { prisma, resolvedConfig } from "../utils.server";
import { ProjectService } from "./project.service";
import { SubscriptionService } from './subscription.service'

export class ViewDataService extends RequestScopeService {
  private projectService = new ProjectService(this.req)
  private subscriptionService = new SubscriptionService()

  async fetchMainLayoutData() {
    const session = await this.getSession()

    const userInfo = await prisma.user.findUnique({
      where: {
        id: session.uid
      },
      select: {
        notificationEmail: true,
        enableNewCommentNotification: true,
        name: true,
        email: true,
        displayName: true
      }
    })

    return {
      session,
      projects: await this.projectService.list(),
      subscription: await this.subscriptionService.getStatus(session.uid),
      config: {
        isHosted: resolvedConfig.isHosted,
        checkout: resolvedConfig.checkout,
      },
      userInfo
    }
  }
}

export type MainLayoutData = Awaited<ReturnType<ViewDataService['fetchMainLayoutData']>>
