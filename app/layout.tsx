import './style.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}

export async function generateMetadata({ params, searchParams }) {
  return { title: 'Cusdis - Open source comment system' };
}