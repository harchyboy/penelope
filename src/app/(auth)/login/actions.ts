'use server'

import { createClient } from '@/lib/supabase/server'

interface LoginInput {
  email: string
  password: string
}

interface LoginResult {
  success?: boolean
  error?: string
  redirectTo?: string
}

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  const { email, password } = input

  // Server-side validation
  if (!email || typeof email !== 'string') {
    return { error: 'Email is required' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address' }
  }

  if (!password || typeof password !== 'string') {
    return { error: 'Password is required' }
  }

  try {
    const supabase = createClient()

    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (authError) {
      // Handle specific Supabase auth errors
      if (authError.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password. Please try again.' }
      }
      if (authError.message.includes('Email not confirmed')) {
        return { error: 'Please verify your email address before signing in.' }
      }
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Login failed. Please try again.' }
    }

    // Update user's updated_at timestamp on successful login
    const { error: updateError } = await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', authData.user.id)

    if (updateError) {
      // Log but don't fail the login - the user is authenticated
      console.error('Failed to update user timestamp:', updateError)
    }

    return {
      success: true,
      redirectTo: '/dashboard'
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
