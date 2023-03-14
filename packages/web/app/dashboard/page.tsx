import { redirect } from "next/navigation"
import { getSession } from "../utils/next-auth.server"
import { prisma } from "../utils/prisma"

export default async function Page() {

  const session = await getSession()
  if (!session) {
    redirect('/api/auth/signin')
  }

  const defaultProject = await prisma.project.findFirst({
    where: {
      ownerId: session.uid,
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true
    }
  })

  if (!defaultProject) {
    redirect('/new')
  }

  redirect(`/dashboard/projects/${defaultProject.id}`)
}