import { redirect } from "next/navigation"
import { getSession } from "../utils/next-auth"
import { prisma } from "../utils/prisma"
import Navbar from "./Navbar"
import { ProjectActions } from "./ProjectActions"
import { ProjectList } from "./ProjectList"

export default async function Page() {
  const session = await getSession()
  if (!session) {
    redirect('/api/auth/signin')
    // redirect to login
  }

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      enableNotification: true,
      enableWebhook: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      ownerId: session.uid
    }
  })

  return (
    <>
      <div className="p-12">
        <ProjectList projects={projects} />
      </div>
    </>
  )
}