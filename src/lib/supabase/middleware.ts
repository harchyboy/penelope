import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export interface UserWithRole {
  id: string
  email?: string
  role?: 'user' | 'admin'
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session - this is critical for session persistence
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // If auth fails or no user, treat as unauthenticated
  if (userError || !user) {
    return { supabaseResponse, user: null }
  }

  // Fetch user role from public.users if authenticated
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const userWithRole: UserWithRole = {
    id: user.id,
    email: user.email,
    role: userProfile?.role || 'user',
  }

  return { supabaseResponse, user: userWithRole }
}
