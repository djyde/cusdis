'use client'

import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import classNames from "classnames"
import { useRouter, useSearchParams } from "next/navigation"

import React, { useLayoutEffect, useRef, useState } from "react"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"

function useFormField<T>(initialValue: T) {
  const [value, setValue] = React.useState<T>(initialValue)

  function onChangeHandler() {
    return (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setValue(e.target.value as any)
    }
  }

  function reset(value: T) {
    setValue(value)
  }

  return {
    value,
    onChange: onChangeHandler(),
    reset
  }
}

export function ReplyForm(props: {
  isSelfHost: boolean,
  locale: any,
  projectId: string
  isEditing?: boolean,
  cancelable?: boolean
  parentId?: string
  session?: any
  variant?: 'default' | 'expanded'
  isModerate?: boolean
}) {
  const usernameField = useFormField("")
  const emailField = useFormField("")
  const commentField = useFormField("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(!!props.isEditing)
  const $commentBox = useRef<HTMLTextAreaElement>(null)
  const cancelable = props.cancelable !== undefined ? props.cancelable : true
  const replyMutation = useMutation(async () => {
    await axios.post('/api/v2/comments', {
      projectId: props.projectId,
      // TODO: check both are empty
      pageId: searchParams.get('p_id') || searchParams.get('p_u'),
      comment: commentField.value,
      username: usernameField.value,
      pageTitle: searchParams.get('p_t'),
      pageUrl: searchParams.get('p_u'),
      parentId: props.parentId,
      email: emailField.value,
    })
  }, {
    onSuccess() {
      router.refresh()
      setIsEditing(false)
      commentField.reset("")
    }
  })

  async function onClickReply() {
    if (!usernameField.value && !props.session) {
      alert(props.locale['nickname_is_required'])
      return
    }
    if (!commentField.value && !props.session) {
      alert(props.locale['content_is_required'])
      return
    }
    replyMutation.mutate()
  }

  useLayoutEffect(() => {
    if ($commentBox.current) {
      $commentBox.current.focus()
    }
  }, [isEditing])

  return (
    <div className="">
      {!isEditing &&
        <div onClick={_ => {
          setIsEditing(true)
        }} className={classNames("border border-gray-100 dark:border-gray-500 bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-300 transition-colors rounded px-3 py-2 text-gray-400 cursor-text text-sm", {
          'h-[96px]': props.variant === 'expanded'
        })}>
          {props.locale.reply_placeholder}
        </div>
      }
      {isEditing && (
        <div className="flex flex-col gap-4">
          {props.session && <>
            <div>
              <a href="/me" target={"_blank"}>
                {props.session.user.displayName || props.session.user.name}
              </a>
            </div>
          </>}
          {!props.session && (
            <div className="flex gap-2 items-center">
              <div className="flex flex-col md:flex-row gap-2">
                <Input value={emailField.value} onChange={emailField.onChange} className="border rounded px-2 py-1" type="email" placeholder={props.locale['email']} />
                <Input value={usernameField.value} onChange={usernameField.onChange} className="border rounded px-2 py-1" type="text" placeholder={props.locale['nickname']} />
              </div>
              {!props.isSelfHost && (
                <div>
                  or <a target={"_blank"} href="/api/auth/signin" className="text-blue-500">sign in</a>
                </div>
              )}
            </div>
          )}
          <textarea value={commentField.value} onChange={commentField.onChange} ref={$commentBox} className="border rounded w-full p-4 dark:bg-gray-900"></textarea>
          <div className="flex gap-2">
            <button disabled={replyMutation.isLoading} onClick={onClickReply} type="button" className="border text-sm px-3 py-1 rounded">{replyMutation.isLoading ? 'Sending...' : 'Send'}</button>
            {cancelable && <button onClick={_ => {
              setIsEditing(false)
            }} type="button" className="border text-sm px-3 py-1 rounded">Cancel</button>}
          </div>
        </div>
      )}
    </div>
  )
}