import type { Metadata } from 'next'
import { Bebas_Neue, DM_Mono, Inter } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas-neue',
  subsets: ['latin'],
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MovOS',
  description: 'Fleet Operations Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${dmMono.variable} ${inter.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter), -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
