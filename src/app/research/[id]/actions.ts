'use server'

import { createClient } from '@/lib/supabase/server'
import type { ApiResponse, ResearchProject, Persona } from '@/types'

export interface ResearchProjectWithPersonas extends ResearchProject {
  personas: Persona[]
}

/**
 * Fetch a research project with all its personas.
 */
export async function getResearchProject(
  id: string
): Promise<ApiResponse<ResearchProjectWithPersonas>> {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Fetch the research project
    const { data: project, error: projectError } = await supabase
      .from('research_projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError || !project) {
      return { success: false, error: 'Research project not found' }
    }

    // Verify ownership
    if (project.user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Fetch personas linked to this project
    const { data: personas, error: personasError } = await supabase
      .from('personas')
      .select('*')
      .eq('research_project_id', id)
      .order('created_at', { ascending: false })

    if (personasError) {
      console.error('Error fetching personas for research project:', personasError)
      return { success: false, error: 'Failed to fetch personas' }
    }

    return {
      success: true,
      data: {
        ...project,
        personas: personas || [],
      } as ResearchProjectWithPersonas,
    }
  } catch (err) {
    console.error('Unexpected error in getResearchProject:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Update a research project's title.
 */
export async function updateResearchProjectTitle(
  id: string,
  title: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error: updateError } = await supabase
      .from('research_projects')
      .update({ title })
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating research project title:', updateError)
      return { success: false, error: 'Failed to update title' }
    }

    return { success: true, data: { success: true } }
  } catch (err) {
    console.error('Unexpected error in updateResearchProjectTitle:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete a research project and unlink its personas.
 * Personas are not deleted -- their research_project_id is set to NULL via ON DELETE SET NULL.
 */
export async function deleteResearchProject(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error: deleteError } = await supabase
      .from('research_projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting research project:', deleteError)
      return { success: false, error: 'Failed to delete research project' }
    }

    return { success: true, data: { success: true } }
  } catch (err) {
    console.error('Unexpected error in deleteResearchProject:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
