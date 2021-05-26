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
  update_url: string
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
        subscriptionId: data.subscription_id,
        billingEmail: data.email,
        cancelUrl: data.cancel_url,
        nextBillDate: dayjs(data.next_bill_date).toDate(),
        passthrough: JSON.stringify(passthrough),
        planId: data.subscription_plan_id,
        userId: passthrough.userId,
        updateUrl: data.update_url,
      },
      update: {
        billingEmail: data.email,
        cancelUrl: data.cancel_url,
        nextBillDate: dayjs(data.next_bill_date).toDate(),
        passthrough: JSON.stringify(passthrough),
        planId: data.subscription_plan_id,
        userId: passthrough.userId,
        cancellationEffectiveDate: null,
        updateUrl: data.update_url,
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
        subscriptionId: data.subscription_id,
      },
      data: {
        cancellationEffectiveDate: dayjs(
          data.cancellation_effective_date,
        ).toDate(),
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
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        createdAt: true,
      },
    })

    if (dayjs(user.createdAt).isBefore('2021-05-30')) {
      return true
    }

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

  async getFreeProjects() {
    const res = await prisma.project.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 2,
      select: {
        id: true,
      },
    })
    return res
  }

  async isProjectAvailable(projectId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        ownerId: true,
      },
    })

    if (await this.isPro(project.ownerId)) {
      return true
    }
    const projects = await this.getFreeProjects()
    return !!projects.find((_) => _.id === projectId)
  }

  async approvalGuard(commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        page: {
          select: {
            projectId: true,
          },
        },
      },
    })

    const availabe = await this.isProjectAvailable(comment.page.projectId)

    if (!availabe) {
      throw HTTPException.paymentRequired(
        'Please upgrade to Cusdis Pro to have unlimited projects.',
      )
    }
  }

  async checkProjectsLimit(userId: string) {
    if (!(await this.isPro(userId))) {
      const freeProjects = await this.getFreeProjects()
      if (freeProjects.length >= 2) {
        throw HTTPException.paymentRequired(
          'Please upgrade to Cusdis Pro to create unlimited projects.',
        )
      }
    }
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
  const verification = verifier.verify(resolvedConfig.paddle.publicKey, mySig)
  // Used in response if statement
  return verification
}
