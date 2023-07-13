import { prisma } from "../utils.server"

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

  async getStatus(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId
      },
    })

    let isActived = subscription?.status === 'active' || subscription?.status === 'cancelled'

    return {
      isActived,
      status: subscription?.status || '',
      endAt: subscription?.endsAt.toISOString() || '',
      updatePaymentMethodUrl: subscription?.updatePaymentMethodUrl || ''
    }
  }
}