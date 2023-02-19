'use client'

import { Prisma, Project } from "@prisma/client"
import classnames from "classnames"
import Link from "next/link"
import { Button } from "../components/ui/Button"
import { useMutation } from '@tanstack/react-query'
import axios from "axios"
import { useRouter } from "next/navigation"

export const ProjectList = (props: {
  projects: Prisma.ProjectGetPayload<{
    select: {
      id, title, enableWebhook, enableNotification
    }
  }>[]
}) => {
  const router = useRouter()
  const createProjectMutation = useMutation(async () => {
    const result = await axios.post('/api/v2/projects')
    return result.data.data.projectId
  }, {
    onSuccess(projectId) {
      router.push(`/dashboard/projects/${projectId}`)
    }
  })

  return (
    <div className="flex flex-col gap-4">
      {/* <div className="pb-2">
        <div className="flex gap-2">
          <Button isLoading={createProjectMutation.isLoading} onClick={() => {
            createProjectMutation.mutate()
          }} className="text-sm" variant="primary">Create website</Button>
        </div>
      </div> */}
      <h2 className="font-medium">Websites</h2>
      <div className="">
        <div className="border border-slate-100 rounded-md">
          {props.projects.map(project => {
            return (
              <div key={project.id} className="even:bg-slate-50 px-3 py-3">
                <div className="font-medium text-sm">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    {project.title}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>


  )
}