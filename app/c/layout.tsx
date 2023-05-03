import { Providers } from '../utils/providers'
import './style.css'

export default function Layout({ children }) {
  return (
    <div className='antialiased'>
      <Providers>
        {children}
      </Providers>
    </div>
  )
}