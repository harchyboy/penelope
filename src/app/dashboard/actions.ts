'use server'

import { createClient } from '@/lib/supabase/server'
import type { Persona, ApiResponse, CompanyProfile, ResearchProject } from '@/types'

export interface CompanyProfileListItem {
  id: string
  user_id: string
  company_data: CompanyProfile
  buyer_persona_count: number
  created_at: string
  updated_at: string
}

export interface PersonaListItem extends Persona {
  // For b2b_buyer personas, includes the linked company profile data
  linked_company_profile?: CompanyProfile | null
}

/**
 * Fetch user's personas for dashboard display.
 * - Queries personas table filtered by user_id
 * - Orders by created_at descending (newest first)
 * - For B2B buyer personas, includes linked company profile data
 * - Returns typed PersonaListItem[] array
 */
export async function getUserPersonas(): Promise<ApiResponse<PersonaListItem[]>> {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Query all personas for this user, ordered by creation date descending
    const { data: personas, error } = await supabase
      .from('personas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching personas:', error)
      return { success: false, error: 'Failed to fetch personas' }
    }

    if (!personas || personas.length === 0) {
      return { success: true, data: [] }
    }

    // For b2b_buyer personas, fetch linked company profile data
    // Collect company_ids from b2b_buyer personas
    const companyIds = personas
      .filter((p) => p.type === 'b2b_buyer' && p.company_id)
      .map((p) => p.company_id as string)

    let companyMap: Map<string, CompanyProfile | null> = new Map()

    if (companyIds.length > 0) {
      // Fetch the company personas to get their company_profile data
      const { data: companies, error: companyError } = await supabase
        .from('personas')
        .select('id, company_profile')
        .in('id', companyIds)

      if (companyError) {
        console.error('Error fetching company profiles:', companyError)
        // Don't fail entirely, just log and continue without linked profiles
      } else if (companies) {
        companies.forEach((c) => {
          companyMap.set(c.id, c.company_profile as CompanyProfile | null)
        })
      }
    }

    // Map personas to PersonaListItem, adding linked company profile for b2b_buyer
    const personaListItems: PersonaListItem[] = personas.map((persona) => ({
      ...persona,
      linked_company_profile:
        persona.type === 'b2b_buyer' && persona.company_id
          ? companyMap.get(persona.company_id) || null
          : undefined,
    })) as PersonaListItem[]

    return { success: true, data: personaListItems }
  } catch (err) {
    console.error('Unexpected error in getUserPersonas:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Fetch user's free persona status.
 * Returns whether the user has used their free persona unlock.
 */
export async function getUserFreePersonaStatus(): Promise<ApiResponse<{ free_persona_used: boolean }>> {
  try {
    const supabase = createClient()

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

/**
 * Fetch user's company profiles for dashboard display.
 * - Queries company_profiles table filtered by user_id
 * - Orders by created_at descending (newest first)
 * - Counts linked buyer personas for each company profile
 * - Returns typed CompanyProfileListItem[] array
 */
export async function getUserCompanyProfiles(): Promise<ApiResponse<CompanyProfileListItem[]>> {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Query all company profiles for this user
    const { data: companyProfiles, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching company profiles:', error)
      return { success: false, error: 'Failed to fetch company profiles' }
    }

    if (!companyProfiles || companyProfiles.length === 0) {
      return { success: true, data: [] }
    }

    // Count linked buyer personas for each company profile
    const companyProfileIds = companyProfiles.map((cp) => cp.id)

    const { data: buyerPersonaCounts, error: countError } = await supabase
      .from('buyer_personas')
      .select('company_profile_id')
      .in('company_profile_id', companyProfileIds)

    if (countError) {
      console.error('Error counting buyer personas:', countError)
      // Don't fail, just set counts to 0
    }

    // Build count map
    const countMap = new Map<string, number>()
    if (buyerPersonaCounts) {
      buyerPersonaCounts.forEach((bp) => {
        const currentCount = countMap.get(bp.company_profile_id) || 0
        countMap.set(bp.company_profile_id, currentCount + 1)
      })
    }

    // Map to CompanyProfileListItem with buyer persona counts
    const companyProfileListItems: CompanyProfileListItem[] = companyProfiles.map((cp) => ({
      id: cp.id,
      user_id: cp.user_id,
      company_data: cp.company_data as CompanyProfile,
      buyer_persona_count: countMap.get(cp.id) || 0,
      created_at: cp.created_at,
      updated_at: cp.updated_at,
    }))

    return { success: true, data: companyProfileListItems }
  } catch (err) {
    console.error('Unexpected error in getUserCompanyProfiles:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export interface ResearchProjectListItem extends ResearchProject {
  persona_count: number
}

/**
 * Fetch user's research projects for dashboard display.
 * - Queries research_projects table filtered by user_id
 * - Counts linked personas for each project
 * - Returns typed ResearchProjectListItem[] array
 */
export async function getUserResearchProjects(): Promise<ApiResponse<ResearchProjectListItem[]>> {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Query all research projects for this user
    const { data: projects, error } = await supabase
      .from('research_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching research projects:', error)
      return { success: false, error: 'Failed to fetch research projects' }
    }

    if (!projects || projects.length === 0) {
      return { success: true, data: [] }
    }

    // Count personas for each project
    const projectIds = projects.map((p) => p.id)
    const { data: personaCounts, error: countError } = await supabase
      .from('personas')
      .select('research_project_id')
      .in('research_project_id', projectIds)

    if (countError) {
      console.error('Error counting personas:', countError)
    }

    const countMap = new Map<string, number>()
    if (personaCounts) {
      personaCounts.forEach((p) => {
        const currentCount = countMap.get(p.research_project_id) || 0
        countMap.set(p.research_project_id, currentCount + 1)
      })
    }

    const projectListItems: ResearchProjectListItem[] = projects.map((p) => ({
      ...p,
      persona_count: countMap.get(p.id) || 0,
    })) as ResearchProjectListItem[]

    return { success: true, data: projectListItems }
  } catch (err) {
    console.error('Unexpected error in getUserResearchProjects:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Fetch user's orphaned personas (not linked to any research project).
 */
export async function getOrphanedPersonas(): Promise<ApiResponse<PersonaListItem[]>> {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: personas, error } = await supabase
      .from('personas')
      .select('*')
      .eq('user_id', user.id)
      .is('research_project_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orphaned personas:', error)
      return { success: false, error: 'Failed to fetch personas' }
    }

    return { success: true, data: (personas || []) as PersonaListItem[] }
  } catch (err) {
    console.error('Unexpected error in getOrphanedPersonas:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
