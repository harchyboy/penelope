'use server'

import { createClient } from '@/lib/supabase/server'
import type { ApiResponse } from '@/types'

export interface AdminStats {
  totalUsers: number
  totalPersonas: number
  personasThisWeek: number
  b2cCount: number
  b2bCount: number
}

/**
 * Fetch admin dashboard statistics.
 * - Total users count
 * - Total personas count
 * - Personas created this week
 * - B2B vs B2C breakdown
 *
 * Only admins can access this action.
 */
export async function getAdminStats(): Promise<ApiResponse<AdminStats>> {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) {
      console.error('Error fetching users count:', usersError)
      return { success: false, error: 'Failed to fetch users count' }
    }

    // Get total personas count
    const { count: totalPersonas, error: personasError } = await supabase
      .from('personas')
      .select('*', { count: 'exact', head: true })

    if (personasError) {
      console.error('Error fetching personas count:', personasError)
      return { success: false, error: 'Failed to fetch personas count' }
    }

    // Get personas created this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const { count: personasThisWeek, error: weeklyError } = await supabase
      .from('personas')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    if (weeklyError) {
      console.error('Error fetching weekly personas count:', weeklyError)
      return { success: false, error: 'Failed to fetch weekly personas count' }
    }

    // Get B2C count (b2c_individual type)
    const { count: b2cCount, error: b2cError } = await supabase
      .from('personas')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'b2c_individual')

    if (b2cError) {
      console.error('Error fetching B2C count:', b2cError)
      return { success: false, error: 'Failed to fetch B2C count' }
    }

    // Get B2B count (b2b_company + b2b_buyer types)
    const { count: b2bCount, error: b2bError } = await supabase
      .from('personas')
      .select('*', { count: 'exact', head: true })
      .in('type', ['b2b_company', 'b2b_buyer'])

    if (b2bError) {
      console.error('Error fetching B2B count:', b2bError)
      return { success: false, error: 'Failed to fetch B2B count' }
    }

    return {
      success: true,
      data: {
        totalUsers: totalUsers ?? 0,
        totalPersonas: totalPersonas ?? 0,
        personasThisWeek: personasThisWeek ?? 0,
        b2cCount: b2cCount ?? 0,
        b2bCount: b2bCount ?? 0,
      },
    }
  } catch (err) {
    console.error('Unexpected error in getAdminStats:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
