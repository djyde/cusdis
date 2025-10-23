/**
 * Deprecated
 */

import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "../../../../../service/project.service";

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const projectService = new ProjectService(null)

  const projectId = params.projectId
  const token = await projectService.regenerateToken(projectId)
  
  return NextResponse.json({
    data: token
  })
}

