import { redirect } from 'next/navigation'
import { getSession } from '../../utils.server'
import GettingStartClient from './page-client'

export default async function GettingStart() {
  const session = await getSession(null)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return <GettingStartClient />
}

