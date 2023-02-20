'use client'

import React, { ReactNode, useRef } from 'react'
import { Input } from '../../../components/ui/Input'
import { StateButton } from '../../../components/ui/StateButton'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

export function ActionPannel(props: {
  title: ReactNode
  description?: ReactNode
  projectId?: string
}) {
  // let title: typeof Title | null = null
  // let actions: typeof Actions | null = null
  // React.Children.forEach(props.children, c => {
  //   switch (c.type) {
  //     case Title:
  //       title = c
  //       break;
  //     case Actions:
  //       actions = c
  //       break;
  //   }
  // })

  const { toast } = useToast()
  const $webhookUrl = useRef<HTMLInputElement>(null)

  const saveWebhookMutation = useMutation(
    async () => {
      const projectId = props.projectId
      const webhookUrl = $webhookUrl.current?.value
      const result = await axios.put(`/api/v2/projects/${projectId}/webhook`, {
        projectId: projectId,
        webhookUrl: webhookUrl,
      })
      return result.data.data.projectId
    },
    {
      onSuccess() {
        toast({
          description: 'Your webhook settings has been saved.',
        })
      },
    },
  )

  return (
    <>
      <div className="p-6 border-t border-l border-r rounded-t flex flex-col gap-4">
        <h3 className="text-lg font-bold">{props.title}</h3>
        <div className="text-sm">{props.description}</div>
        <div>
          <Input type="text" className="w-full" ref={$webhookUrl} />
        </div>
      </div>
      <div className="border p-6 py-4 rounded-b bg-gray-50">
        <StateButton
          onClick={(_) => {
            saveWebhookMutation.mutate()
          }}
          isLoading={saveWebhookMutation.isLoading}
          size="sm"
          className="px-4"
        >
          Save
        </StateButton>
      </div>
    </>
  )
}
