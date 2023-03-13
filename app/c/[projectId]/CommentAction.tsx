'use client'

import { Comment } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import type { getComments } from "./data"

export function CommentAction(props: {
  comment: Awaited<ReturnType<typeof getComments>>[0]
}) {

  const router = useRouter()

  const deleteMutation = useMutation(async () => {
    await axios.delete(`/api/v2/comments/${props.comment.id}`)
  }, {
    onSuccess() {
      router.refresh()
    }
  })

  const approveMutation = useMutation(async () => {
    await axios.put(`/api/v2/comments/${props.comment.id}`, {
      approved: true
    })
  }, {
    onSuccess() {
      router.refresh()
    }
  })

  return (
    <div className="flex gap-2 text-xs font-medium text-gray-500 dark:text-gray-300">
      {!props.comment.approved && (
        <button disabled={approveMutation.isLoading} type="button" onClick={_ => {
          approveMutation.mutate()
        }}>{approveMutation.isLoading ? 'Approving...' : 'Approve'}</button>
      )}
      <button disabled={deleteMutation.isLoading} type="button" onClick={_ => {
        deleteMutation.mutate()
      }}>{deleteMutation.isLoading ? 'Deleting...' : 'Delete'}</button>
    </div>
  )
}