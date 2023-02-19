'use client'

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { CommentService } from "../../../../service/comment.service"

export function LatestCommentList(props: {
  projectId: string
}) {
  const page = 1

  const getLatestCommentQuery = useQuery<Awaited<ReturnType<CommentService['getLatestComments']>>>({
    queryKey: ['getLatestComment', props.projectId, page],
    queryFn: async ({ queryKey }) => {
      const result = await axios.get(`/api/v2/projects/${props.projectId}/comments`, {
        params: {
          page
        }
      })
      return result.data.data
    }
  })

  return (
    <div className="border border-slate-100 rounded-md">
      {getLatestCommentQuery.data && (
        <div>
          {getLatestCommentQuery.data.map((comment) => {
            return (
              <div key={comment.id} className="flex flex-col gap-4 border-b p-4 border-b-slate-100">
                <div>
                  <div className="font-medium">
                    {comment.moderator?.displayName || comment.moderator?.name || comment.by_nickname}
                  </div>
                </div>
                <div className="text-sm">
                  {comment.content || 'empty...'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}