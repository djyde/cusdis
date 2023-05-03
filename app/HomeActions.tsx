'use client'

import { useSession } from "next-auth/client"
import Link from "next/link"
import { Button } from "./components/ui/Button"

export const HomeActions = () => {
  const [session, isLoadingSession] = useSession()

  return (
    <div className="flex gap-4 mt-4">
      {!session && <Button>Sign in</Button>}
      {!isLoadingSession && session && <a target={"_blank"} href="/dashboard"><Button>Dashboard</Button></a>}
      <a href="/doc" target="_blank">
        <Button variant="outline">Documentation</Button>
        </a>
    </div>
  )
}