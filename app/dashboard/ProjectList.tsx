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
    <div className="md:flex md:flex-col gap-8 md:pt-12 md:max-w-[960px] lg:mx-auto">
      <div>
        <div className="flex gap-2">
          <Button isLoading={createProjectMutation.isLoading} onClick={() => {
            createProjectMutation.mutate()
          }} className="text-sm" variant="primary">Create website</Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {props.projects.map(project => {
          return (
            <Link href={`/dashboard/projects/${project.id}`}>
              <div className="flex flex-col text-sm border rounded shadow-sm p-4" key={project.id}>
                <div className="font-medium mb-4">
                  {project.title}
                </div>
                <div className="text-gray-500 flex gap-2 items-center">
                  <div className={classnames('inline-block w-1 h-1 rounded-full', {
                    'bg-green-500': project.enableWebhook,
                    'bg-orange-500': !project.enableWebhook
                  })}></div>
                  <div>
                    Webhook
                  </div>
                </div>
                <div className="text-gray-500 flex gap-2 items-center">
                  <div className={classnames('inline-block w-1 h-1 rounded-full', {
                    'bg-green-500': project.enableWebhook,
                    'bg-orange-500': !project.enableWebhook
                  })}></div>
                  <div>
                    Email notification
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>


  )
}