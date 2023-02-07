'use client'

import { useSession } from "next-auth/client"
import { Button } from "./components/ui/Button"

export const HomeActions = () => {
  const [session, isLoadingSession] = useSession()

  return (
    <div className="flex gap-4 mt-4">
      {!session && <Button variant="primary" href="/api/auth/signin">Sign in</Button>}
      {!isLoadingSession && session && <Button href="/dashboard">Dashboard</Button>}
      <Button variant="primary" href="/doc">Documentation</Button>
    </div>
  )
}