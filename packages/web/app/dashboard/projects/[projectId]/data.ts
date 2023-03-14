import 'server-only'
import { prisma } from '../../../utils/prisma'

export async function getUserProjects (uid: string) {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: uid
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true
    }
  })
  return projects
}

export async function getProjectInformation(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      id: true,
      title: true,
    }
  })
  return {
    project
  }
}