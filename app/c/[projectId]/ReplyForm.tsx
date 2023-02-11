'use client'

import axios from "axios"
import React, { useState } from "react"

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
}) {
  const usernameField = useFormField("")
  const emailField = useFormField("")
  const commentField = useFormField("")

  async function onClickReply() {
    await axios.post('/api/v2/comments', {})
    console.log(usernameField.value, commentField.value)
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="">Name</label>
        <input value={usernameField.value} onChange={usernameField.onChange} type="text" className="border-2 rounded p-1" />
      </div>
      <textarea value={commentField.value} onChange={commentField.onChange} placeholder={props.locale.reply_placeholder} className="w-full border-gray-200 border-2 rounded p-1"></textarea>
      <button onClick={onClickReply}>{props.locale.reply_btn}</button>
    </div>
  )
}