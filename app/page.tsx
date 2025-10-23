import { redirect } from 'next/navigation'
import { getSession, resolvedConfig } from '../utils.server'
import IndexPageContent from './index-page-content'

export default async function IndexPage() {
  const session = await getSession(null)

  if (!resolvedConfig.isHosted && !session) {
    redirect('/dashboard')
  }

  return <IndexPageContent session={session} />
}
