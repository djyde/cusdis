'use client'

import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Edit, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

export function WebsiteTitleEditIcon(props: {
  projectId: string
}) {
  const router = useRouter()
  const editTitleMutation = useMutation(async (title: string) => {
    await axios.put(`/api/v2/projects/${props.projectId}`, {
      title
    })
  },{
    onSuccess() {
      // TODO: toast
      router.refresh() 
    }
  })
  return (
    <Edit className="w-4 h-4 text-slate-500 cursor-pointer" onClick={_ => {
      const title = window.prompt("New title")
      if (title) {
        editTitleMutation.mutate(title)
      }
    }} />
  )
}