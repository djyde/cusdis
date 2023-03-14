'use client'

import { useMutation } from "@tanstack/react-query"
import React from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { StateButton } from "../components/StateButton"
import { apiClient } from "../utils/apiClient"

export const createProject = async (body: { title: string }) => {
  const res = await apiClient.post("/projects", {
    title: body.title,
  })
  return res.data
}

export function NewSiteForm() {
  const [title, setTitle] = React.useState("")
  const createProjectMutation = useMutation(createProject)

  return (
    <div>
      <form className="w-full flex flex-col gap-4" onSubmit={e => {
        e.preventDefault()
        if (title) {
          createProjectMutation.mutate({
            title: title.trim()
          })
        }
      }}>
        <div className="text-left">
          <label className="text-sm inline-block mb-1" htmlFor="website_title">Website title</label>
          <Input required value={title} onChange={e => {
            setTitle(e.target.value)
          }} id="website_title" />
        </div>
        <div>
          <StateButton type="submit" className="w-full" isLoading={createProjectMutation.isLoading}>Create</StateButton>
        </div>
      </form>
    </div>
  )
}