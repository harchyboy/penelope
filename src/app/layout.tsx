import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Penelope | AI Customer Persona Expert by Hartz AI',
  description: 'Create detailed, actionable customer personas with Penelope, your AI-powered persona expert. Understand your audience deeply and sharpen your marketing strategies.',
  keywords: ['customer persona', 'buyer persona', 'ICP', 'ideal customer profile', 'marketing', 'AI', 'Hartz AI', 'B2B personas', 'B2C personas'],
  authors: [{ name: 'Hartz AI', url: 'https://hartzai.com' }],
  metadataBase: new URL('https://penelope.hartzai.com'),
  openGraph: {
    title: 'Penelope | AI Customer Persona Expert',
    description: 'Create detailed, actionable customer personas with AI. Understand your audience deeply.',
    url: 'https://penelope.hartzai.com',
    siteName: 'Penelope by Hartz AI',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Penelope | AI Customer Persona Expert',
    description: 'Create detailed, actionable customer personas with AI. Understand your audience deeply.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} noise-overlay`}>
        {/* Bioluminescent atmosphere orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="glow-orb-lg -top-40 -right-40 animate-glow" />
          <div className="glow-orb-md top-1/3 -left-20 animate-glow delay-200" />
          <div className="glow-orb-lg bottom-0 right-1/4 animate-glow delay-500" />
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
