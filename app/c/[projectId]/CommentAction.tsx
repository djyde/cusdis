'use client'

import { Comment } from "@prisma/client"
import { getComments } from "./page"

export function CommentAction(props: {
  comment: Awaited<ReturnType<typeof getComments>>[0]
}) {
  return (
    <div className="flex gap-2 text-sm font-medium text-gray-500">
      <button type="button">Approve</button>
      <button type="button">Delete</button>
    </div>
  )
}