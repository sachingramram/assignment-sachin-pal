import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Worker Finder',
  description: 'Modern, responsive Next.js app with TS + Tailwind',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
