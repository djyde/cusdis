import { prisma } from "../../../utils/prisma"

export async function getProjectInfo(projectId: string) {

  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      title: true,
      id: true,
      ownerId: true,
      webhook: true,
      enableNotification: true
    }
  })

  // we detected non-existed project on layout
  return project!
}

