'use client'

import axios from "axios"
import React, { useLayoutEffect, useRef, useState } from "react"
import { Button } from "../../components/ui/Button"

function useFormField<T>(initialValue: T) {
  const [value, setValue] = React.useState<T>(initialValue)

  function onChangeHandler() {
    return (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setValue(e.target.value as any)
    }
  }

  return {
    value,
    onChange: onChangeHandler()
  }
}

export function ReplyForm(props: {
  locale: any,
  projectId: string
  pageSlug: string
  isEditing?: boolean
}) {
  const usernameField = useFormField("")
  const emailField = useFormField("")
  const commentField = useFormField("")
  const [isEditing, setIsEditing] = useState(!!props.isEditing)
  const $commentBox = useRef<HTMLTextAreaElement>(null)

  async function onClickReply() {
    await axios.post('/api/v2/comments', {
      projectId: props.projectId,
      pageId: props.pageSlug,
      comment: commentField.value,
      username: usernameField.value,
      email: emailField.value,
    })
    // const res = await axios.post('/api/open/comments', {
    //   appId: props.projectId,
    //   pageId,
    //   content,
    //   nickname,
    //   email,
    //   parentId,
    //   pageUrl,
    //   pageTitle,
    // })
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
        }} className="border border-gray-100 bg-gray-50 hover:bg-white hover:text-gray-300 transition-colors rounded px-3 py-2 text-gray-400 cursor-text text-sm">
          {props.locale.reply_placeholder}
        </div>
      }
      {isEditing && (
        <div className="flex flex-col gap-4">
          <textarea ref={$commentBox} className="border rounded w-full p-4"></textarea>
          <div>
            <button type="button" className="border text-sm px-3 py-1 rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  )
}