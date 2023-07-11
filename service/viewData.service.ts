// A service for rendering page

import { RequestScopeService, UserSession } from ".";
import { prisma, resolvedConfig } from "../utils.server";
import { ProjectService } from "./project.service";

export class ViewDataService extends RequestScopeService {
  private projectService = new ProjectService(this.req)

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
      config: {
        isHosted: resolvedConfig.isHosted,
      },
      userInfo
    }
  }
}

export type MainLayoutData = Awaited<ReturnType<ViewDataService['fetchMainLayoutData']>>
