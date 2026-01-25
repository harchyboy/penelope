import type { Metadata } from 'next'
import { DM_Sans, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Header } from '@/components/header'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Penelope | AI Customer Persona Expert',
  description: 'Create detailed, actionable customer personas with Penelope, your AI-powered persona expert. Understand your audience deeply and sharpen your marketing strategies.',
  keywords: ['customer persona', 'buyer persona', 'ICP', 'ideal customer profile', 'marketing', 'AI', 'Hartz AI'],
  authors: [{ name: 'Hartz AI' }],
  openGraph: {
    title: 'Penelope | AI Customer Persona Expert',
    description: 'Create detailed, actionable customer personas with AI',
    url: 'https://personas.hartzai.com',
    siteName: 'Penelope by Hartz AI',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Penelope | AI Customer Persona Expert',
    description: 'Create detailed, actionable customer personas with AI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sourceSerif.variable}`}>
      <body className={dmSans.className}>
        <AuthProvider>
          <div className="min-h-screen bg-light-bg">
            <Header />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
