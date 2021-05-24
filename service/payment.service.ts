import crypto from 'crypto'
import * as Serialize from 'php-serialize'
import { HTTPException, prisma, resolvedConfig } from '../utils.server'
import dayjs from 'dayjs'

type PaddleWebhookData = {
  alert_id: number
  alert_name: string
  checkout_id: string
  email: string
  passthrough: string
  subscription_id: string
  subscription_plan_id: string
  user_id: string
}

type Passthrough = {
  userId: string
}

export class PaymentService {
  async parseBody(body) {
    if (!validateWebhook(body)) {
      throw HTTPException.forbidden('Invalid signature')
    }

    const parsedPassthrough = JSON.parse(body.passthrough) as Passthrough

    switch (body.alert_name) {
      case 'subscription_created':
        return await this.onSubscriptionCreated(body, parsedPassthrough)
      case 'subscription_cancelled':
        return await this.onSubscriptionCanceled(body, parsedPassthrough)
    }
  }

  private async onSubscriptionCreated(
    data: PaddleWebhookData & {
      cancel_url: string
      next_bill_date: string
    },
    passthrough: Passthrough,
  ) {
    await prisma.subscription.upsert({
      where: {
        userId: passthrough.userId,
      },
      create: {
        billingEmail: data.email,
        cancelUrl: data.cancel_url,
        checkoutId: data.checkout_id,
        customUserId: data.user_id,
        nextBillDate: dayjs(data.next_bill_date).toDate(),
        passthrough: JSON.stringify(passthrough),
        planId: data.subscription_plan_id,
        userId: passthrough.userId,
      },
      update: {
        billingEmail: data.email,
        cancelUrl: data.cancel_url,
        checkoutId: data.checkout_id,
        customUserId: data.user_id,
        nextBillDate: dayjs(data.next_bill_date).toDate(),
        passthrough: JSON.stringify(passthrough),
        planId: data.subscription_plan_id,
        userId: passthrough.userId,
        cancellationEffectiveDate: null,
      },
    })

    return { status: 'success', userId: passthrough.userId }
  }

  private async onSubscriptionCanceled(
    data: PaddleWebhookData & {
      cancellation_effective_date: string
    },
    passthrough: Passthrough,
  ) {
    await prisma.subscription.update({
      where: {
        checkoutId: data.checkout_id,
      },
      data: {
        cancellationEffectiveDate: dayjs(data.cancellation_effective_date).toDate(),
      },
    })

    return { status: 'success', userId: passthrough.userId }
  }

  async isPro(userId: string) {
    // self host user always return true
    if (!resolvedConfig.isHosted) {
      return true
    }

    // user signed up before launching paid tier

    // check subscription
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    })

    if (subscription) {
      if (subscription.cancellationEffectiveDate === null) {
        return true
      }

      if (dayjs(subscription.cancellationEffectiveDate).isAfter(dayjs())) {
        return true
      }

      return false
    }

    return false
  }
}

function ksort(obj) {
  const keys = Object.keys(obj).sort()
  let sortedObj = {}
  for (let i in keys) {
    sortedObj[keys[i]] = obj[keys[i]]
  }
  return sortedObj
}

function validateWebhook(jsonObj) {
  // Grab p_signature
  const mySig = Buffer.from(jsonObj.p_signature, 'base64')
  // Remove p_signature from object - not included in array of fields used in verification.
  delete jsonObj.p_signature
  // Need to sort array by key in ascending order
  jsonObj = ksort(jsonObj)
  for (let property in jsonObj) {
    if (
      jsonObj.hasOwnProperty(property) &&
      typeof jsonObj[property] !== 'string'
    ) {
      if (Array.isArray(jsonObj[property])) {
        // is it an array
        jsonObj[property] = jsonObj[property].toString()
      } else {
        //if its not an array and not a string, then it is a JSON obj
        jsonObj[property] = JSON.stringify(jsonObj[property])
      }
    }
  }
  // Serialise remaining fields of jsonObj
  const serialized = Serialize.serialize(jsonObj)
  // verify the serialized array against the signature using SHA1 with your public key.
  const verifier = crypto.createVerify('sha1')
  verifier.update(serialized)
  verifier.end()
  console.log(serialized)
  console.log(resolvedConfig.paddle.publicKey)
  const verification = verifier.verify(resolvedConfig.paddle.publicKey, mySig)
  // Used in response if statement
  return verification
}
