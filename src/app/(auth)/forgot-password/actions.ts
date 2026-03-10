'use server'

import { createClient } from '@/lib/supabase/server'

interface ForgotPasswordResult {
  success?: boolean
  error?: string
}

export async function requestPasswordReset(email: string): Promise<ForgotPasswordResult> {
  if (!email || typeof email !== 'string') {
    return { error: 'Email is required' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address' }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
      }
    )

    if (error) {
      console.error('Password reset error:', error)
      // Don't reveal whether the email exists
      return { success: true }
    }

    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
