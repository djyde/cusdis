import './style.css'

export default function Layout({ children }) {
  return (
    <div className='antialiased'>
      {children}
    </div>
  )
}