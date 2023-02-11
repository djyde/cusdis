import { getSession } from '../utils/next-auth'
import '../style.css'
import Navbar from './Navbar'
import { Inter } from '@next/font/google'

const inter = Inter({
  subsets: ["latin"],
})


export default async function Layout(props) {
  const session = await getSession()

  if (!session) {
    // redirect to login
  }

  return (
    <div className={inter.className}>
      <Navbar session={session} /> 
      {props.children}
    </div>
  )
}