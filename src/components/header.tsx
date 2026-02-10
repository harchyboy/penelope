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
  const { user, isLoading, isAuthenticated } = useAuth()

  const handleSignOut = async () => {
    try {
      setMobileMenuOpen(false)
      // Call the server-side signout route handler
      window.location.href = '/signout'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Get display name - prefer name, fall back to email
  const displayName = user?.name || user?.email?.split('@')[0] || 'User'

  return (
    <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <img
            src="https://cdn.sanity.io/images/2fyt2dgc/production/bd7decfada54f3a71e0dda8ad16885db4086403d-1500x455.png"
            alt="Hartz AI"
            className="h-8 w-auto"
          />
          <span className="text-hartz-muted text-sm font-medium hidden sm:inline">|</span>
          <span className="font-semibold text-lg text-hartz-black hidden sm:inline">Penelope</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/pricing"
            className={cn(
              "text-sm transition-colors",
              pathname === '/pricing'
                ? "text-hartz-black font-medium"
                : "text-hartz-muted hover:text-hartz-black"
            )}
          >
            Pricing
          </Link>

          {isLoading ? (
            // Loading skeleton
            <div className="flex items-center gap-4">
              <div className="h-9 w-16 bg-gray-200 animate-pulse rounded-full" />
              <div className="h-9 w-28 bg-gray-200 animate-pulse rounded-full" />
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
              <div className="flex items-center gap-2 text-sm text-hartz-muted">
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
                <Button variant="ghost" size="sm">Register</Button>
              </Link>
              <Link href="/create">
                <button className="px-5 py-2 bg-hartz-blue text-white rounded-full font-medium text-sm hover:bg-hartz-blue/90 transition-all">
                  Create Persona
                  <ArrowRight className="inline ml-2 h-4 w-4" />
                </button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-hartz-muted hover:text-hartz-black hover:bg-gray-100 rounded-lg transition-colors"
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
        <div className="md:hidden border-t border-black/[0.06] bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="/pricing"
              className={cn(
                "px-4 py-2 text-sm rounded-lg transition-colors",
                pathname === '/pricing'
                  ? "bg-hartz-gray text-hartz-black font-medium"
                  : "text-hartz-muted hover:bg-hartz-gray hover:text-hartz-black"
              )}
              onClick={closeMobileMenu}
            >
              Pricing
            </Link>

            {isLoading ? (
              <div className="px-4 py-2">
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
            ) : isAuthenticated ? (
              <>
                {/* User info */}
                <div className="px-4 py-2 flex items-center gap-2 text-sm text-hartz-muted border-t border-black/[0.06] mt-2 pt-4">
                  <User className="h-4 w-4" />
                  <span className="truncate">{displayName}</span>
                </div>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm text-hartz-muted hover:bg-hartz-gray hover:text-hartz-black rounded-lg transition-colors flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <button
                  type="button"
                  className="px-4 py-2 text-sm text-hartz-muted hover:bg-hartz-gray hover:text-hartz-black rounded-lg transition-colors flex items-center gap-2 w-full text-left"
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
                  className="px-4 py-2 text-sm text-hartz-muted hover:bg-hartz-gray hover:text-hartz-black rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm text-hartz-muted hover:bg-hartz-gray hover:text-hartz-black rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
                <div className="pt-2 border-t border-black/[0.06] mt-2">
                  <Link href="/create" onClick={closeMobileMenu}>
                    <button className="w-full px-5 py-3 bg-hartz-blue text-white rounded-full font-semibold hover:bg-hartz-blue/90 transition-all">
                      Create Persona
                      <ArrowRight className="inline ml-2 h-4 w-4" />
                    </button>
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
