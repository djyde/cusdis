'use client'

import { useSession } from "next-auth/client"

export const ProfileButton = function () {
  const [session, isLoading] = useSession()
  if (isLoading) {
    return null
  }

  return (
    <>
      <span>{session.user.name}</span>
    </>
  )
}