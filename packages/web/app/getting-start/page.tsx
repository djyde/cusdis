import classNames from "classnames"
import { Container } from "../components/Container"
import { NewSiteForm } from "./NewSiteForm"
import { styles } from '../components/styles'
import { getSession } from "../utils/next-auth.server"
import { redirect } from "next/navigation"
export const metadata = {
  title: 'Getting start - Cusdis',
  description: `Cusdis is an open-source, lightweight, privacy-friendly comment system.`,
}

export default async function Page() {
  const session = await getSession() 

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent('/getting-start')}`)
  }

  return (
    <div>
      <div className={classNames(styles.container({
        size: 'sm'
      }))}>
        <div className="flex flex-col gap-8 text-center">
          <div className="mb-16">
            <a href="/">
              <h1 className="bg-gray-900 inline-block text-gray-100 px-12 py-3 font-bold text-4xl hover:bg-gray-700 transition-colors">
                Cusdis
              </h1>
            </a>
          </div>
          <div>
            <h2 className="font-bold text-3xl mb-2">Getting start</h2>
            <div className="text-sm">
              Create your first website to use Cusdis
            </div>
          </div>
          <div>
            <NewSiteForm />
          </div>
        </div>
      </div>
    </div>
  )
}