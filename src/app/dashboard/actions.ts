'use server'

import { createClient } from '@/lib/supabase/server'
import type { Persona, ApiResponse } from '@/types'

export interface PersonaListItem extends Persona {
  // Additional fields for list display can be added here
}

// Fetch user's personas - to be fully implemented in US-011
export async function getUserPersonas(): Promise<ApiResponse<PersonaListItem[]>> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Query personas for this user
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching personas:', error)
      return { success: false, error: 'Failed to fetch personas' }
    }

    return { success: true, data: data as PersonaListItem[] }
  } catch (err) {
    console.error('Unexpected error in getUserPersonas:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get free persona status
export async function getUserFreePersonaStatus(): Promise<ApiResponse<{ free_persona_used: boolean }>> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user record
    const { data, error } = await supabase
      .from('users')
      .select('free_persona_used')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user status:', error)
      return { success: false, error: 'Failed to fetch user status' }
    }

    return { success: true, data: { free_persona_used: data?.free_persona_used ?? false } }
  } catch (err) {
    console.error('Unexpected error in getUserFreePersonaStatus:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
