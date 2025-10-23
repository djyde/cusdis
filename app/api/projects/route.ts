import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "../../../service/project.service";
import { SubscriptionService } from "../../../service/subscription.service";
import { getSession } from "../../../utils.server";

export async function POST(request: NextRequest) {
  const projectService = new ProjectService(null)
  const subscriptionService = new SubscriptionService()
  const session = await getSession(null)

  if (!session) {
    return NextResponse.json({
      error: 'Unauthorized'
    }, { status: 401 })
  }

  // check subscription
  if (!await subscriptionService.createProjectValidate(session.uid)) {
    return NextResponse.json({
      error: 'You have reached the maximum number of sites on free plan. Please upgrade to Pro plan to create more sites.'
    }, { status: 402 })
  }

  const body = await request.json()
  const { title } = body as {
    title: string
  }

  const created = await projectService.create(title)

  return NextResponse.json({
    data: {
      id: created.id
    }
  })
}

export async function GET(request: NextRequest) {
  const projectService = new ProjectService(null)
  const projects = await projectService.list()
  
  return NextResponse.json({
    data: projects
  })
}

