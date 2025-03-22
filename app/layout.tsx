import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'vibe check ✨ | powered by gemini',
  description: 'chat app for the coolest girlies and besties',
  icons: '/cc.jpg',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
