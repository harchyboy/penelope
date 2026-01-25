import { AuthProvider } from '@/components/providers/auth-provider'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Landing page has its own header/footer, so we don't include the app Header
  return (
    <AuthProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </AuthProvider>
  )
}
