'use client'

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import classNames from "classnames"
import { ArrowUpRight } from "lucide-react"
import React from "react"
import type { CommentService } from "../../../../service/comment.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select"
import { StateButton } from "../../../components/ui/StateButton"

export function LatestCommentList(props: {
  projectId: string
}) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [filter, setFilter] = React.useState('all')

  const getLatestCommentQuery = useQuery<Awaited<ReturnType<CommentService['getLatestComments']>>>({
    queryKey: ['getLatestComment', props.projectId, currentPage, filter],
    queryFn: async ({ queryKey }) => {
      const result = await axios.get(`/api/v2/projects/${props.projectId}/comments`, {
        params: {
          page: currentPage,
          filter
        }
      })
      return result.data.data
    }
  })

  const paginator = React.useMemo(() => {
    if (getLatestCommentQuery.data?.pageCount && getLatestCommentQuery.data.pageCount < 2) {
      return null
    }
    const buttonsGroup = (new Array(getLatestCommentQuery.data?.pageCount || 0).fill(0)).map((_, index) => {
      return (
        <StateButton onClick={_ => {
          setCurrentPage(index + 1)
        }} size="sm" variant={currentPage === index + 1 ? 'subtle' : 'ghost'} key={index}>{index + 1}</StateButton>
      )
    })
    return (
      <div className="flex gap-2">
        {buttonsGroup}
      </div>
    )
  }, [getLatestCommentQuery.data?.pageCount, currentPage])

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex justify-between items-center">
        <div>
          <Select value={filter} onValueChange={value => {
            setFilter(value)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="unapproved">Unapproved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="border border-slate-100 rounded-md">
        {getLatestCommentQuery.data?.comments.length === 0 && (
          <div className="text-center text-sm text-slate-500 p-24">
            No result
          </div>
        )}
        {getLatestCommentQuery.data && (
          <div>
            {getLatestCommentQuery.data.comments.map((comment) => {
              return (
                <div key={comment.id} className="flex flex-col gap-2 border-b p-4 border-b-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <a target={"_blank"} href={`${comment.page.url}`} className={classNames("text-sm", {
                      "underline": comment.page.url
                    })}>
                      {comment.page.title || 'Untitled'}
                    </a>
                    {comment.page.url &&
                      <ArrowUpRight className="w-4 h-4" />
                    }
                  </div>
                  <div className="text-sm">
                    <div className="flex flex-col gap-2 font-medium text-sm">
                      {comment.moderator?.displayName || comment.moderator?.name || comment.by_nickname}
                    </div>
                    <div className="text-gray-700">
                      {comment.content || 'empty...'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div>
        {paginator}
      </div>

    </div>

  )
}