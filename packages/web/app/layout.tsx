import './style.css'
import { DM_Sans } from 'next/font/google'

export const metadata = {
  title: 'Cusdis - Open-source, lightweight, privacy-friendly comment system',
  description: `Cusdis is an open-source, lightweight, privacy-friendly comment system.`,
}

const dmsans = DM_Sans({
  weight: [
    '400',
    '500',
    '700'
  ],
  subsets: [
    'latin'
  ]
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={dmsans.className}>{children}</body>
    </html>
  )
}
