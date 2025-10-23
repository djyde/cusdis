import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '../../../../../../service/data.service'
import { AuthService } from '../../../../../../service/auth.service'
import { ProjectService } from '../../../../../../service/project.service'
import { Project } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const authService = new AuthService(null, null)
  const projectService = new ProjectService(null)

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({
      error: 'No file provided'
    }, { status: 400 })
  }

  const dataService = new DataService()

  const { projectId } = params

  // only owner can import
  const project = (await projectService.get(projectId, {
    select: {
      ownerId: true,
    },
  })) as Pick<Project, 'ownerId'>

  if (!(await authService.projectOwnerGuard(project))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const fileContent = await file.text()
    
    const imported = await dataService.importFromDisqus(
      projectId,
      fileContent,
    )

    return NextResponse.json({
      data: {
        pageCount: imported.threads.length,
        commentCount: imported.posts.length,
      },
    })
  } catch (err) {
    return NextResponse.json({
      message: err.message,
    }, { status: 503 })
  }
}

