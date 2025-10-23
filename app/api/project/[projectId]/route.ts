import { Project } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../../../../service/auth.service";
import { ProjectService } from "../../../../service/project.service";
import { prisma } from "../../../../utils.server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const authService = new AuthService(null, null)
  const projectService = new ProjectService(null)

  const { projectId } = params
  const body = await request.json()
  const {
    enableNotification,
    webhookUrl,
    enableWebhook
  } = body as {
    enableNotification?: boolean,
    webhookUrl?: string,
    enableWebhook?: boolean
  }

  const project = (await projectService.get(projectId, {
    select: {
      ownerId: true,
    },
  })) as Pick<Project, 'ownerId'>

  if (!(await authService.projectOwnerGuard(project))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      enableNotification,
      enableWebhook,
      webhook: webhookUrl
    },
  })

  return NextResponse.json({
    message: 'success'
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const authService = new AuthService(null, null)
  const projectService = new ProjectService(null)

  const { projectId } = params

  const project = (await projectService.get(projectId, {
    select: {
      ownerId: true,
    },
  })) as Pick<Project, 'ownerId'>

  if (!(await authService.projectOwnerGuard(project))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await projectService.delete(projectId)

  return NextResponse.json({
    message: 'success'
  })
}

