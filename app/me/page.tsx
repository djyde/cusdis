'use client'

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Container } from "../components/ui/Container";
import { Input } from "../components/ui/Input";
import { StateButton } from "../components/ui/StateButton";
import { Providers } from "../utils/providers";

export default function Page() {
  const [session, loading] = useSession()
  const [displayName, setDisplayName] = useState("")
  const [notificationEmail, setNotificationEmail] = useState("")

  const saveMutation = useMutation(async () => {
    await axios.put('/api/v2/profile', {
      displayName: displayName?.trim(),
      notificationEmail: notificationEmail?.trim(),
    })
  })

  useEffect(() => {
    if (session) {
      setDisplayName(session.user.displayName)
      setNotificationEmail(session.user.notificationEmail || "")
    }
  }, [session])

  if (!loading && !session) {
    // TODO: redirect to signin
  }

  if (session) {
    return (
      <div>
        <Container className="mt-48">
          <div className="flex gap-4 items-center mb-4">
            <h1 className="text-3xl font-bold">
              Cusdis
            </h1>
            <div className="text-gray-500 ml-1">
              Account
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 items-center border-b border-slate-50 py-4">
              <span className="font-medium">Avatar</span>
              <Avatar>
                <AvatarImage src={session.user.image} alt="avatar" />
                <AvatarFallback>{session.user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            {session.user?.email && (
              <div className="grid grid-cols-2 items-center border-b border-slate-50 py-4">
                <span className="font-medium">Email</span>
                <Input disabled value={session.user?.email} />
              </div>
            )}
            <div className="grid grid-cols-2 items-center border-b border-slate-50 py-4">
              <span className="font-medium">Notification Email</span>
              <Input value={notificationEmail} onChange={e => {
                setNotificationEmail(e.target.value)
              }} placeholder={session.user?.email} />
            </div>
            <div className="grid grid-cols-2 items-center border-b border-slate-50 py-4">
              <span className="font-medium">Display name</span>
              <Input value={displayName} onChange={e => {
                setDisplayName(e.target.value)
              }} placeholder={session.user?.name} />
            </div>
            {/* <div className="grid grid-cols-2 items-center border-b border-slate-50 py-4">
              <span className="font-medium">Display url</span>
              <Input />
            </div> */}
          </div>

          <div className="mt-8">
            <StateButton isLoading={saveMutation.isLoading} onClick={_ => {
              saveMutation.mutate()
            }}>Save</StateButton>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div>
      Loading...
    </div>
  )
}