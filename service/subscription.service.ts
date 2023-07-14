import { UsageLabel, usageLimitation } from "../config.common"
import { prisma, resolvedConfig } from "../utils.server"

export class SubscriptionService {
  async update(body) {
    const {
      order_id,
      product_id,
      variant_id,
      customer_id,
      status,
      ends_at,
      urls: {
        update_payment_method
      }
    } = body.data.attributes

    const lemonSubscriptionId = body.data.id

    const {
      user_id
    } = body.meta.custom_data

    await prisma.subscription.upsert({
      where: {
        userId: user_id
      },
      create: {
        userId: user_id,
        orderId: `${order_id}`,
        productId: `${product_id}`,
        variantId: `${variant_id}`,
        customerId: `${customer_id}`,
        endsAt: ends_at,
        lemonSubscriptionId,
        status,
        updatePaymentMethodUrl: update_payment_method
      },
      update: {
        userId: user_id,
        orderId: `${order_id}`,
        productId: `${product_id}`,
        variantId: `${variant_id}`,
        customerId: `${customer_id}`,
        lemonSubscriptionId,
        endsAt: ends_at,
        status,
        updatePaymentMethodUrl: update_payment_method
      }
    })
  }

  async isActivated(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId
      },
    })

    if (!subscription) {
      return false
    }

    let isActived = subscription?.status === 'active' || subscription?.status === 'cancelled'

    return isActived
  }

  async getStatus(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId
      },
    })

    return {
      isActived: await this.isActivated(userId),
      status: subscription?.status || '',
      endAt: subscription?.endsAt?.toISOString() || '',
      updatePaymentMethodUrl: subscription?.updatePaymentMethodUrl || ''
    }
  }

  async createProjectValidate(userId: string) {
    if (!resolvedConfig.checkout.enabled) {
      return true
    }

    const [projectCount] = await prisma.$transaction([
      prisma.project.count({
        where: {
          ownerId: userId,
          deletedAt: {
            equals: null
          }
        }
      }),
    ])

    if (projectCount < usageLimitation['create_site']) {
      return true
    }

    if (await this.isActivated(userId)) {
      return true
    }

    return false
  }

  async approveCommentValidate(userId: string) {
    if (!resolvedConfig.checkout.enabled) {
      return true
    }

    const [usage] = await prisma.$transaction([
      prisma.usage.findUnique({
        where: {
          userId_label: {
            userId,
            label: UsageLabel.ApproveComment
          }
        }
      }),
    ])

    if (await this.isActivated(userId)) {
      return true
    }

    if (!usage) {
      return true
    }

    if (usage.count <= usageLimitation[UsageLabel.ApproveComment]) {
      return true
    }
 
    return false
  }

  async quickApproveValidate(userId: string) {
    if (!resolvedConfig.checkout.enabled) {
      return true
    }

    const [usage] = await prisma.$transaction([
      prisma.usage.findUnique({
        where: {
          userId_label: {
            userId,
            label: UsageLabel.QuickApprove
          }
        }
      }),
    ])

    // if (await this.isActivated(userId)) {
    //   return true
    // }

    if (!usage) {
      return true
    }

    if (usage.count <= usageLimitation[UsageLabel.QuickApprove]) {
      return true
    }

    return false
  }
}