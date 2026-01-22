'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoading, isAuthenticated, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Get display name - prefer name, fall back to email
  const displayName = user?.name || user?.email?.split('@')[0] || 'User'

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-semibold text-xl text-slate-900">Penelope</span>
          <span className="text-xs text-slate-500 ml-1 hidden sm:inline">by Hartz AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/pricing"
            className={cn(
              "text-sm transition-colors",
              pathname === '/pricing'
                ? "text-slate-900 font-medium"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Pricing
          </Link>

          {isLoading ? (
            // Loading skeleton
            <div className="flex items-center gap-4">
              <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg" />
              <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-lg" />
            </div>
          ) : isAuthenticated ? (
            // Authenticated state
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="h-4 w-4" />
                <span className="max-w-32 truncate">{displayName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            // Unauthenticated state
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="sm">Register</Button>
              </Link>
              <Link href="/create">
                <Button size="sm">
                  Create Persona
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="/pricing"
              className={cn(
                "px-4 py-2 text-sm rounded-lg transition-colors",
                pathname === '/pricing'
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
              onClick={closeMobileMenu}
            >
              Pricing
            </Link>

            {isLoading ? (
              <div className="px-4 py-2">
                <div className="h-5 w-24 bg-slate-200 animate-pulse rounded" />
              </div>
            ) : isAuthenticated ? (
              <>
                {/* User info */}
                <div className="px-4 py-2 flex items-center gap-2 text-sm text-slate-600 border-t border-slate-100 mt-2 pt-4">
                  <User className="h-4 w-4" />
                  <span className="truncate">{displayName}</span>
                </div>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <button
                  type="button"
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors flex items-center gap-2 w-full text-left"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <Link href="/create" onClick={closeMobileMenu}>
                    <Button className="w-full">
                      Create Persona
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
