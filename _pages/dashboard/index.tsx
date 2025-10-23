import * as React from "react"
import { apiClient } from "../../utils.client"
import { Project } from "@prisma/client"
import { ProjectService } from "../../service/project.service"
import { getSession } from "../../utils.server"


export const getAllProjects = async () => {
  const res = await apiClient.get<{
    data: Project[]
  }>("/projects")
  return res.data.data
}

function Dashboard() {
  return (
    <div>

    </div>
  )
}

export async function getServerSideProps(ctx) {

  const session = await getSession(ctx.req)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      }
    }
  }

  const projectService = new ProjectService(ctx.req)

  const defaultProject = await projectService.getFirstProject(session.uid, {
    select: {
      id: true
    }
  })

  if (!defaultProject) {
    return {
      redirect: {
        destination: `/getting-start`,
        permanent: false
      }
    }
  } else {
    // redirect to project dashboard
    return {
      redirect: {
        destination: `/dashboard/project/${defaultProject.id}`,
        permanent: false
      }
    }
  }
}

export default Dashboard
