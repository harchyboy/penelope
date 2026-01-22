'use server'

import { createClient } from '@/lib/supabase/server'
import type { ApiResponse, PersonaData, CompanyProfile } from '@/types'

export interface BuyerPersonaDetail {
  id: string
  company_profile_id: string
  company_name: string
  persona_data: PersonaData
  created_at: string
}

/**
 * Fetch a buyer persona by ID with its linked company profile name.
 */
export async function getBuyerPersona(
  buyerPersonaId: string
): Promise<ApiResponse<BuyerPersonaDetail>> {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Query buyer persona
    const { data: buyerPersona, error: personaError } = await supabase
      .from('buyer_personas')
      .select('*')
      .eq('id', buyerPersonaId)
      .single()

    if (personaError || !buyerPersona) {
      console.error('Error fetching buyer persona:', personaError)
      return { success: false, error: 'Buyer persona not found' }
    }

    // Query the linked company profile to verify ownership and get company name
    const { data: companyProfile, error: profileError } = await supabase
      .from('company_profiles')
      .select('id, user_id, company_data')
      .eq('id', buyerPersona.company_profile_id)
      .single()

    if (profileError || !companyProfile) {
      console.error('Error fetching company profile:', profileError)
      return { success: false, error: 'Associated company profile not found' }
    }

    // Verify ownership
    if (companyProfile.user_id !== user.id) {
      return { success: false, error: 'Not authorized to view this buyer persona' }
    }

    const companyData = companyProfile.company_data as CompanyProfile

    const result: BuyerPersonaDetail = {
      id: buyerPersona.id,
      company_profile_id: buyerPersona.company_profile_id,
      company_name: companyData.name,
      persona_data: buyerPersona.persona_data as PersonaData,
      created_at: buyerPersona.created_at,
    }

    return { success: true, data: result }
  } catch (err) {
    console.error('Unexpected error in getBuyerPersona:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
