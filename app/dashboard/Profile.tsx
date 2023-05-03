'use client'

import { useSession } from "next-auth/client"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"

export function Profile() {
  const [session] = useSession()


  if (session) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div>
            <Avatar>
              <AvatarImage src={session.user.image} alt="avatar" />
              <AvatarFallback>{session.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="font-medium">
              <a href="/me">
                {session.user.name}
              </a>
            </div>
            <div className="">
              <span className="text-xs font-medium bg-gray-500 text-white px-2 py-1 rounded-lg">
                FREE
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium">
            <a href="/api/auth/signout">Log out</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
    </div>
  )
}