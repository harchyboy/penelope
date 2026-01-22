import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = createClient()

  // Sign out from Supabase (this clears the session cookies)
  await supabase.auth.signOut()

  // Redirect to home page after sign out
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}

// Also support GET for simple link-based sign out
export async function GET() {
  const supabase = createClient()

  // Sign out from Supabase (this clears the session cookies)
  await supabase.auth.signOut()

  // Redirect to home page after sign out
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
