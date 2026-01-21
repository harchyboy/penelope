import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PENELOPE_SYSTEM_PROMPT, PERSONA_GENERATION_PROMPT, COMPANY_PROFILE_PROMPT } from '@/lib/prompts'
import type { PersonaType, BusinessContext, GeneratePersonaRequest } from '@/types'
import { generateId } from '@/lib/utils'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// In-memory storage for demo (replace with Supabase in production)
const personaStore = new Map<string, any>()

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

    // Generate a unique ID for this persona
    const personaId = generateId()

    // Determine if this is a preview (no user, or user hasn't registered)
    // For now, all personas are previews until we implement auth
    const isPreview = true // Will be based on user auth status

    // Store the persona (in production, this goes to Supabase)
    const persona = {
      id: personaId,
      user_id: null, // Will be set when user registers
      type,
      company_id: company_id || null,
      name: personaData.name,
      business_context,
      persona_data: type === 'b2b_company' ? null : personaData,
      company_profile: type === 'b2b_company' ? personaData : null,
      is_unlocked: !isPreview,
      is_complete: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    personaStore.set(personaId, persona)

    return NextResponse.json({
      success: true,
      persona_id: personaId,
      persona_data: personaData,
      is_preview: isPreview,
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

  const persona = personaStore.get(id)

  if (!persona) {
    return NextResponse.json(
      { error: 'Persona not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    persona,
  })
}
