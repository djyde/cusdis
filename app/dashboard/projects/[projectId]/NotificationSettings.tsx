'use client'

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { StateButton } from "../../../components/ui/StateButton";
import { Switch } from "../../../components/ui/Switch";
import type { getProjectInfo } from "./utils";

export function NotificationSettings(props: {
  project: Awaited<ReturnType<typeof getProjectInfo>>
}) {
  const router = useRouter()
  const [webhook, setWebhook] = useState(props.project.webhook || "")

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

  const webhookMutation = useMutation(async () => {
    if (webhook) {
      await axios.put(`/api/v2/projects/${props.project.id}`, {
        webhookUrl: webhook
      })
    }
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
        <Input onChange={e => {
          setWebhook(e.target.value)
        }} value={webhook} id="webhook" _size="sm" />
        <StateButton isLoading={webhookMutation.isLoading} onClick={_ => {
          webhookMutation.mutate()
        }} size="sm">Save</StateButton>
      </div>

    </div>
  )
}