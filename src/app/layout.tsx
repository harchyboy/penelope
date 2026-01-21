import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {children}
        </div>
      </body>
    </html>
  )
}
