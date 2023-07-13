import { RequestScopeService } from ".";
import { UsageLabel } from "../config.common";
import { prisma } from "../utils.server";

export class UsageService extends RequestScopeService {
  async incr(label: UsageLabel) {
    const session = await this.getSession()

    await prisma.usage.upsert({
      where: {
        userId_label: {
          userId: session.uid,
          label,
        }
      },
      create: {
        userId: session.uid,
        label,
        count: 1
      },
      update: {
        count: {
          increment: 1
        }
      }
    })
  }
}