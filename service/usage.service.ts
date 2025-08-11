import { RequestScopeService } from ".";
import { UsageLabel } from "../config.common";
import { prisma } from "../utils.server";

export class UsageService extends RequestScopeService {
  async incr(label: UsageLabel, ownerId = null) {
    const uid = ownerId || (await this.getSession()).uid

    await prisma.usage.upsert({
      where: {
        userId_label: {
          userId: uid,
          label,
        },
      },
      create: {
        userId: uid,
        label,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    })
  }
}