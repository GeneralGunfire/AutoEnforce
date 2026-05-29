import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title: 'AutoEnforce ZA — Redefining Policing',
  description: 'AI-powered traffic enforcement for South African municipalities. Real-time. Court-ready.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body style={{ background: '#080808', color: '#E8E0D0' }}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
