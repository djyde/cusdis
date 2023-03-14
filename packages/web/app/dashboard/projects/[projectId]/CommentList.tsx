'use client'

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { CommentWrapper } from "../../../../service/comment.service"
import { apiClient } from "../../../utils/apiClient"

const getComments = async ({ queryKey }) => {
  const [_key, { projectId, page }] = queryKey
  const res = await apiClient.get<{
    data: CommentWrapper,
  }>(`/project/${projectId}/comments`, {
    params: {
      page
    }
  })
  return res.data.data
}

const approveComment = async ({ commentId }) => {
  const res = await apiClient.post(`/comment/${commentId}/approve`)
  return res.data
}

const deleteComment = async ({ commentId }) => {
  const res = await apiClient.delete(`/comment/${commentId}`)
  return res.data
}

const replyAsModerator = async ({ parentId, content }) => {
  const res = await apiClient.post(`/comment/${parentId}/replyAsModerator`, {
    content
  })
  return res.data.data
}

const deleteProject = async ({ projectId }) => {
  const res = await apiClient.delete<{
    data: string
  }>(`/project/${projectId}`)
  return res.data.data
}

const updateProjectSettings = async ({ projectId, body }) => {
  const res = await apiClient.put(`/project/${projectId}`, body)
  return res.data
}

export function CommentList(props: {
  projectId: string
}) {
  const [page, setPage] = useState(1)

  const getCommentQuery = useQuery({
    queryKey: ['getComments', props.projectId, {
      page
    }],
    async queryFn(context) {
      const res = await apiClient.get<{
        data: CommentWrapper,
      }>(`/project/${props.projectId}/comments`, {
        params: {
          page
        }
      })
      return res.data.data
    }
  })

  return (
    <div>
      {getCommentQuery.data && getCommentQuery.data.data.map(comment => {
        return (
          <div id={comment.id}>
            {comment.content}
          </div>
        )
      })}
    </div>
  )
}