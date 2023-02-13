import { getSession } from '../utils/next-auth'
import '../style.css'
import Navbar from './Navbar'
import { Inter } from '@next/font/google'
import classNames from 'classnames'
import { Providers } from '../utils/providers'
import { redirect } from 'next/navigation'

const inter = Inter({
  subsets: ["latin"],
})


export default async function Layout(props) {
  const session = await getSession()

  if (!session) {
    redirect('/api/auth/signin')
    // redirect to login
  }

  return (
    <div className={classNames(inter.className, 'antialiased')}>
      <Navbar session={session} />
      <Providers>
        {props.children}
      </Providers>
    </div>
  )
}