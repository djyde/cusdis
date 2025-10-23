'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { Providers } from './providers'
import '../style.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MantineProvider
            theme={{
              primaryColor: 'gray',
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <ModalsProvider>
              <Notifications position="top-center" />
              {children}
            </ModalsProvider>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  )
}

