import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Dancing_Script } from 'next/font/google'
import { LanguageProvider } from '@/components/language-provider'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const dancing = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Gabriela & Andrei · 26 Septembrie 2026',
  description:
    'Gabriela și Andrei vă invită să sărbătoriți nunta lor pe 26 septembrie 2026 · You are invited to celebrate the wedding of Gabriela & Andrei.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/andrei-gabriela.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/images/andrei-gabriela.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7e3d8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ro"
      className={`${cormorant.variable} ${dancing.variable} bg-background`}
    >
      <body className="font-serif antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
