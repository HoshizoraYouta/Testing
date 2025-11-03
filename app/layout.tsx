import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Game Server Manager',
  description: 'Manage your game servers with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
