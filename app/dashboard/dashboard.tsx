'use client'

import { getSession, useSession } from 'next-auth/client'
export async function getProjects() {
  console.log(getSession)
}

export default function Dashboard() {
  return (
    <div>
      dasbhoard
    </div>
  )
}