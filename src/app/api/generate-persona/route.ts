import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PENELOPE_SYSTEM_PROMPT, PERSONA_GENERATION_PROMPT, COMPANY_PROFILE_PROMPT } from '@/lib/prompts'
import type { PersonaType, BusinessContext, GeneratePersonaRequest, Persona } from '@/types'
import { generateId } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// In-memory storage for unauthenticated preview mode only
// Authenticated users have their personas saved to Supabase
const previewStore = new Map<string, Persona>()

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePersonaRequest = await request.json()
    const { type, business_context, company_id } = body

    // Validate required fields
    if (!type || !business_context) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user is authenticated
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAuthenticated = !!user

    // Format the business context for the prompt
    const contextString = formatBusinessContext(business_context, type)

    // Choose the appropriate prompt based on type
    const userPrompt = type === 'b2b_company'
      ? COMPANY_PROFILE_PROMPT.replace('{business_context}', contextString)
      : PERSONA_GENERATION_PROMPT.replace('{business_context}', contextString)

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: PENELOPE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    // Extract the text response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Parse the JSON response
    let personaData
    try {
      // Clean up the response in case there's markdown formatting
      const cleanJson = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      personaData = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error('Failed to parse persona JSON:', parseError)
      console.error('Raw response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse persona data' },
        { status: 500 }
      )
    }

    // If authenticated, save to Supabase
    if (isAuthenticated) {
      const { data: savedPersona, error: insertError } = await supabase
        .from('personas')
        .insert({
          user_id: user.id,
          type,
          business_context,
          persona_data: type === 'b2b_company' ? null : personaData,
          company_profile: type === 'b2b_company' ? personaData : null,
          company_id: company_id || null,
          is_unlocked: false, // Default to locked, user can use free unlock
          is_complete: true,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Failed to save persona to database:', insertError)
        return NextResponse.json(
          { error: 'Failed to save persona' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        persona_id: savedPersona.id,
        persona_data: personaData,
        is_preview: false, // Authenticated users get their persona saved
      })
    }

    // Unauthenticated: store in memory for preview only
    const personaId = generateId()
    const persona: Persona = {
      id: personaId,
      user_id: null,
      type,
      company_id: company_id || null,
      business_context,
      persona_data: type === 'b2b_company' ? null : personaData,
      company_profile: type === 'b2b_company' ? personaData : null,
      is_unlocked: false,
      is_complete: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    previewStore.set(personaId, persona)

    return NextResponse.json({
      success: true,
      persona_id: personaId,
      persona_data: personaData,
      is_preview: true, // Unauthenticated users see preview only
    })
  } catch (error) {
    console.error('Error generating persona:', error)
    return NextResponse.json(
      { error: 'Failed to generate persona' },
      { status: 500 }
    )
  }
}

// Helper to format business context into a readable string
function formatBusinessContext(context: BusinessContext, type: PersonaType): string {
  let formatted = `
Business Name: ${context.business_name}
Business Sector/Product: ${context.business_sector}
Price Point (vs. Competitors): ${context.price_point}
Primary Target Location: ${context.target_location}
Problem the Business Solves: ${context.problem_solved}
Unique Selling Point: ${context.unique_selling_point}
`

  if (type === 'b2b_company' || type === 'b2b_buyer') {
    if (context.company_size) {
      formatted += `Target Company Size: ${context.company_size}\n`
    }
    if (context.industry) {
      formatted += `Target Industry: ${context.industry}\n`
    }
    if (context.decision_makers && context.decision_makers.length > 0) {
      formatted += `Key Decision Makers: ${context.decision_makers.join(', ')}\n`
    }
  }

  return formatted.trim()
}

// GET endpoint to retrieve a persona by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Missing persona ID' },
      { status: 400 }
    )
  }

  // First check the preview store for unauthenticated previews
  const previewPersona = previewStore.get(id)
  if (previewPersona) {
    return NextResponse.json({
      success: true,
      persona: previewPersona,
      is_preview: true,
    })
  }

  // Check if user is authenticated and try to fetch from database
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Query the persona from database
  const { data: persona, error } = await supabase
    .from('personas')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !persona) {
    return NextResponse.json(
      { error: 'Persona not found' },
      { status: 404 }
    )
  }

  // Check if user owns this persona or if it's accessible
  // For now, allow owner to see their own personas
  const isOwner = user && persona.user_id === user.id
  const isPreview = !isOwner

  return NextResponse.json({
    success: true,
    persona,
    is_preview: isPreview,
    is_owner: isOwner,
  })
}
