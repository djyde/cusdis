import axios from 'axios';
import * as crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { SubscriptionService } from '../../service/subscription.service';
import { getSession, prisma, resolvedConfig } from '../../utils.server';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Get raw body as string
async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const rawBody = await getRawBody(req);
    const secret = resolvedConfig.checkout.lemonSecret;
    console.log(req.headers)
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.headers['x-signature'] as string, 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      res.status(401).send('Invalid signature');
      return
    }

    const data = JSON.parse(Buffer.from(rawBody).toString('utf8'));
    const subscriptionService = new SubscriptionService()
    const eventName = req.headers['x-event-name'] as string

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        await subscriptionService.update(data)
        break
      }
    }

    res.json({

    })
  } else if (req.method === 'DELETE') {
    const session = await getSession(req)

    if (!session) {
      res.status(401).send('Unauthorized')
      return
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: session.uid
      },
    })

    if (!subscription) {
      res.status(404).send('Subscription not found')
      return
    }

    try {
      const response = await axios.delete(`https://api.lemonsqueezy.com/v1/subscriptions/${subscription.lemonSubscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${resolvedConfig.checkout.lemonApiKey}`,
          'Content-Type': 'application/vnd.api+json',
          'Accept': "application/vnd.api+json"
        }
      })
    } catch (e) {
      console.log(e.response.data, e.request)
    }

    res.json({
      message: 'success'
    })
  }
}