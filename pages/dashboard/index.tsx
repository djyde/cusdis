import * as React from "react"
import { apiClient } from "../../utils.client"
import { Project } from "@prisma/client"
import { ProjectService } from "../../service/project.service"


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

  console.log('hhhhhhh')

  const projectService = new ProjectService(ctx.req)

  const defaultProject = await projectService.getFirstProject({
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
