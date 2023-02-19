'use client'

import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/Button"
import { StateButton, StateButtonProps } from "../components/ui/StateButton"

export function AddWebsiteButton(props: StateButtonProps) {
  const router = useRouter()
  const createProjectMutation = useMutation(async () => {
    const result = await axios.post('/api/v2/projects')
    return result.data.data.projectId
  }, {
    onSuccess(projectId) {
      router.push(`/dashboard/projects/${projectId}`)
      router.refresh()
    }
  })

  return (
    <StateButton {...props} onClick={_ => {
      createProjectMutation.mutate()
    }} isLoading={createProjectMutation.isLoading} className='w-full' variant='subtle' size="sm">Add website</StateButton>
  )
}