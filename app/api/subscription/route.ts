import axios from 'axios';
import * as crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '../../../service/subscription.service';
import { getSession, prisma, resolvedConfig } from '../../../utils.server';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const secret = resolvedConfig.checkout.lemonSecret;
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(request.headers.get('x-signature') as string, 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const data = JSON.parse(rawBody);
  const subscriptionService = new SubscriptionService()
  const eventName = request.headers.get('x-event-name') as string

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated': {
      await subscriptionService.update(data)
      break
    }
  }

  return NextResponse.json({})
}

export async function DELETE(request: NextRequest) {
  const session = await getSession(null)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      userId: session.uid
    },
  })

  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
  }

  try {
    await axios.delete(`https://api.lemonsqueezy.com/v1/subscriptions/${subscription.lemonSubscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${resolvedConfig.checkout.lemonApiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': "application/vnd.api+json"
      }
    })
  } catch (e) {
    console.log(e.response?.data, e.request)
  }

  return NextResponse.json({
    message: 'success'
  })
}

