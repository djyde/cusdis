'use client'

import { Input } from "../../../components/ui/Input"
import { StateButton } from "../../../components/ui/StateButton"
import { getProjectInfo } from "./page"

export function ProjectSettings(props: {
  project: Awaited<ReturnType<typeof getProjectInfo>>
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label className="text-sm" htmlFor="title">Website title</label>
        <div className="flex gap-2">
          <Input id="title" _size="sm" value={props.project.title} />
          <StateButton size='sm'>Save</StateButton>
        </div>
      </div>
    </div>
  )
}