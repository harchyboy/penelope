'use server'

import { createClient } from '@/lib/supabase/server'
import type { ApiResponse } from '@/types'

/**
 * Unlock a persona using the user's free persona unlock.
 * - Validates the user is authenticated
 * - Validates the persona exists and is owned by the user
 * - Validates the user hasn't already used their free unlock
 * - Updates persona is_unlocked=true (for preview content, not psychological_depth)
 * - Updates user free_persona_used=true
 * - Returns success or error response
 */
export async function unlockFreePersona(
  personaId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) {
      return { success: false, error: 'You must be logged in to unlock a persona' }
    }

    // Get user record to check free_persona_used status
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('free_persona_used')
      .eq('id', authUser.id)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user:', userError)
      return { success: false, error: 'Failed to fetch user data' }
    }

    if (userData.free_persona_used) {
      return { success: false, error: 'You have already used your free persona unlock' }
    }

    // Get persona to verify ownership and current state
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select('id, user_id, is_unlocked')
      .eq('id', personaId)
      .single()

    if (personaError || !persona) {
      console.error('Error fetching persona:', personaError)
      return { success: false, error: 'Persona not found' }
    }

    if (persona.user_id !== authUser.id) {
      return { success: false, error: 'You do not own this persona' }
    }

    if (persona.is_unlocked) {
      return { success: false, error: 'This persona is already unlocked' }
    }

    // Update persona to unlocked status
    // Note: Free unlock only unlocks preview content, psychological_depth stays locked
    // This is handled by the frontend - is_unlocked=true shows preview sections but
    // psychological_depth section requires a paid upgrade
    const { error: updatePersonaError } = await supabase
      .from('personas')
      .update({ is_unlocked: true, updated_at: new Date().toISOString() })
      .eq('id', personaId)

    if (updatePersonaError) {
      console.error('Error unlocking persona:', updatePersonaError)
      return { success: false, error: 'Failed to unlock persona' }
    }

    // Update user's free_persona_used status
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ free_persona_used: true, updated_at: new Date().toISOString() })
      .eq('id', authUser.id)

    if (updateUserError) {
      console.error('Error updating user free persona status:', updateUserError)
      // Attempt to rollback persona unlock
      await supabase
        .from('personas')
        .update({ is_unlocked: false, updated_at: new Date().toISOString() })
        .eq('id', personaId)
      return { success: false, error: 'Failed to update your account. Please try again.' }
    }

    return { success: true, data: { success: true } }
  } catch (err) {
    console.error('Unexpected error in unlockFreePersona:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
