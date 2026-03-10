'use server'

import { createClient } from '@/lib/supabase/server'

interface ResetPasswordResult {
  success?: boolean
  error?: string
}

export async function updatePassword(password: string): Promise<ResetPasswordResult> {
  if (!password || typeof password !== 'string') {
    return { error: 'Password is required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      console.error('Password update error:', error)
      if (error.message.includes('same_password')) {
        return { error: 'New password must be different from your current password.' }
      }
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Password update error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
