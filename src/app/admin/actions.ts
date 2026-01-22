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

// ============================================
// ADMIN USERS LIST
// ============================================

export interface AdminUserListItem {
  id: string
  email: string
  name: string | null
  role: 'user' | 'admin'
  free_persona_used: boolean
  created_at: string
  persona_count: number
}

export interface AdminUsersResponse {
  users: AdminUserListItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Fetch paginated list of all users for admin panel.
 * Includes search by email and persona count per user.
 *
 * @param page - Current page (1-indexed)
 * @param pageSize - Number of items per page (default 20)
 * @param searchEmail - Optional email search filter
 */
export async function getAdminUsers(
  page: number = 1,
  pageSize: number = 20,
  searchEmail?: string
): Promise<ApiResponse<AdminUsersResponse>> {
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

    // Calculate pagination offset
    const offset = (page - 1) * pageSize

    // Build users query
    let usersQuery = supabase
      .from('users')
      .select('id, email, name, role, free_persona_used, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    // Add email search filter if provided
    if (searchEmail && searchEmail.trim()) {
      usersQuery = usersQuery.ilike('email', `%${searchEmail.trim()}%`)
    }

    const { data: users, error: usersError, count: totalCount } = await usersQuery

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return { success: false, error: 'Failed to fetch users' }
    }

    if (!users) {
      return {
        success: true,
        data: {
          users: [],
          totalCount: 0,
          page,
          pageSize,
          totalPages: 0,
        },
      }
    }

    // Get persona counts for each user
    const userIds = users.map(u => u.id)
    const { data: personaCounts, error: countError } = await supabase
      .from('personas')
      .select('user_id')
      .in('user_id', userIds)

    if (countError) {
      console.error('Error fetching persona counts:', countError)
    }

    // Build persona count map
    const countMap = new Map<string, number>()
    if (personaCounts) {
      for (const p of personaCounts) {
        if (p.user_id) {
          countMap.set(p.user_id, (countMap.get(p.user_id) ?? 0) + 1)
        }
      }
    }

    // Build response with persona counts
    const usersWithCounts: AdminUserListItem[] = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role as 'user' | 'admin',
      free_persona_used: u.free_persona_used,
      created_at: u.created_at,
      persona_count: countMap.get(u.id) ?? 0,
    }))

    const total = totalCount ?? 0
    const totalPages = Math.ceil(total / pageSize)

    return {
      success: true,
      data: {
        users: usersWithCounts,
        totalCount: total,
        page,
        pageSize,
        totalPages,
      },
    }
  } catch (err) {
    console.error('Unexpected error in getAdminUsers:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
