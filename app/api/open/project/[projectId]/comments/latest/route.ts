import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "../../../../../../../service/project.service";
import { prisma } from "../../../../../../../utils.server";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const projectService = new ProjectService(null)
  const { searchParams } = new URL(request.url)
  const { projectId } = params
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({
      message: 'Invalid token'
    }, { status: 403 })
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select:{
      token: true,
      fetchLatestCommentsAt: true
    }
  })

  if (project.token !== token) {
    return NextResponse.json({
      message: 'Invalid token',
    }, { status: 403 })
  }

  const comments = await projectService.fetchLatestComment(projectId, {
    from: project.fetchLatestCommentsAt,
    markAsRead: true
  })

  return NextResponse.json({
    comments: comments
  })
}

