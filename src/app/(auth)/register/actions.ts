'use server'

import { createClient } from '@/lib/supabase/server'

interface RegisterInput {
  email: string
  password: string
  name?: string
}

interface RegisterResult {
  success?: boolean
  error?: string
}

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const { email, password, name } = input

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

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  try {
    const supabase = createClient()

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          name: name?.trim() || null,
        },
      },
    })

    if (authError) {
      // Handle specific Supabase auth errors
      if (authError.message.includes('already registered')) {
        return { error: 'An account with this email already exists. Please sign in instead.' }
      }
      if (authError.message.includes('invalid')) {
        return { error: 'Invalid email or password format' }
      }
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Registration failed. Please try again.' }
    }

    // Create user record in public.users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        name: name?.trim() || null,
        role: 'user',
        free_persona_used: false,
      })

    if (userError) {
      // If user record creation fails, the auth user still exists
      // Log the error but don't fail the registration since auth succeeded
      console.error('Failed to create user profile:', userError)
      // User can still use the app, profile will be created on first need
    }

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
