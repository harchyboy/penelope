import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin']

// Routes that require admin role
const adminRoutes = ['/admin']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register']

// Patterns for protected dynamic routes
const protectedPatterns = [/^\/persona\/[^/]+\/unlock$/]

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Check if route requires authentication
  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    protectedPatterns.some((pattern) => pattern.test(pathname))

  // Check if route requires admin role
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Check if route is an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect non-admin users away from admin routes
  if (isAdminRoute && user && user.role !== 'admin') {
    const dashboardUrl = new URL('/dashboard', request.url)
    dashboardUrl.searchParams.set('error', 'admin_required')
    return NextResponse.redirect(dashboardUrl)
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
