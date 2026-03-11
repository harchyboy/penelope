'use server'

import { createClient } from '@/lib/supabase/server'
import type { ApiResponse, Subscription } from '@/types'

/**
 * Fetch user's active subscription.
 */
export async function getUserSubscription(): Promise<ApiResponse<Subscription | null>> {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is fine
      console.error('Error fetching subscription:', error)
      return { success: false, error: 'Failed to fetch subscription' }
    }

    return { success: true, data: data as Subscription | null }
  } catch (err) {
    console.error('Unexpected error in getUserSubscription:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Unlock a persona using a paid subscription credit.
 * Decrements personas_remaining for one_time plans.
 */
export async function unlockPaidPersona(
  personaId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get subscription
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subError || !sub) {
      return { success: false, error: 'No active subscription found' }
    }

    // Check if user has remaining credits (monthly = -1 = unlimited)
    if (sub.personas_remaining === 0) {
      return { success: false, error: 'No persona unlocks remaining. Purchase more credits.' }
    }

    // Verify persona ownership
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select('user_id, is_unlocked')
      .eq('id', personaId)
      .single()

    if (personaError || !persona) {
      return { success: false, error: 'Persona not found' }
    }

    if (persona.user_id !== user.id) {
      return { success: false, error: 'You do not own this persona' }
    }

    if (persona.is_unlocked) {
      return { success: false, error: 'This persona is already unlocked' }
    }

    // Unlock persona
    const { error: updateError } = await supabase
      .from('personas')
      .update({ is_unlocked: true, updated_at: new Date().toISOString() })
      .eq('id', personaId)

    if (updateError) {
      return { success: false, error: 'Failed to unlock persona' }
    }

    // Decrement credits for one_time plans (not for monthly/unlimited)
    if (sub.plan === 'one_time' && sub.personas_remaining > 0) {
      await supabase
        .from('subscriptions')
        .update({ personas_remaining: sub.personas_remaining - 1 })
        .eq('id', sub.id)
    }

    return { success: true, data: { success: true } }
  } catch (err) {
    console.error('Unexpected error in unlockPaidPersona:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
