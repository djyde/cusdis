'use client'

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/Input";
import { StateButton } from "../../../components/ui/StateButton";
import { Switch } from "../../../components/ui/Switch";
import type { getProjectInfo } from "./page";

export function NotificationSettings(props: {
  project: Awaited<ReturnType<typeof getProjectInfo>>
}) {
  const router = useRouter()

  const toggleEmailMutation = useMutation(async (enabled: boolean) => {
    await axios.put(`/api/v2/projects/${props.project.id}`, {
      enableNotification: enabled
    })
  }, {
    onSuccess() {
      router.refresh()
      // TODO: tooltip
      alert('saved')
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Notification</h2>
      <div className="flex gap-4 items-center">
        <label className="text-sm" htmlFor="email">Email</label>
        <Switch onCheckedChange={checked => {
          toggleEmailMutation.mutate(checked)
        }} id="email" defaultChecked={props.project.enableNotification || false} />
      </div>
      <div className="flex gap-4 items-center">
        <label className="text-sm" htmlFor="webhook">Webhook</label>
        <Input defaultValue={props.project.webhook || ""} id="webhook" _size="sm" />
        <StateButton size="sm">Save</StateButton>
      </div>

    </div>
  )
}