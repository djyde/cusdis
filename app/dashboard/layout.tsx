import { getSession } from '../utils/next-auth'
import Navbar from './Navbar'

export default async function Layout(props) {
  const session = await getSession()

  if (!session) {
    // redirect to login
  }

  return (
    <div>
      <Navbar session={session} /> 
      {props.children}
    </div>
  )
}