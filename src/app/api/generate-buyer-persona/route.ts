import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PENELOPE_SYSTEM_PROMPT, PERSONA_GENERATION_PROMPT } from '@/lib/prompts'
import { createClient } from '@/lib/supabase/server'
import type { BusinessContext, CompanyProfile, PersonaData } from '@/types'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

interface GenerateBuyerPersonaRequest {
  company_profile_id: string
  buyer_role: string
  buyer_description?: string
  buyer_challenges?: string
  business_context: BusinessContext
  company_data: CompanyProfile
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateBuyerPersonaRequest = await request.json()
    const {
      company_profile_id,
      buyer_role,
      buyer_description,
      buyer_challenges,
      business_context,
      company_data,
    } = body

    // Validate required fields
    if (!company_profile_id || !buyer_role || !business_context) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user is authenticated
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify user owns the company profile
    const { data: companyProfile, error: profileError } = await supabase
      .from('company_profiles')
      .select('id, user_id')
      .eq('id', company_profile_id)
      .single()

    if (profileError || !companyProfile) {
      return NextResponse.json({ error: 'Company profile not found' }, { status: 404 })
    }

    if (companyProfile.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Build enhanced prompt for buyer persona generation
    const contextString = formatBuyerPersonaContext(
      business_context,
      company_data,
      buyer_role,
      buyer_description,
      buyer_challenges
    )

    const userPrompt = PERSONA_GENERATION_PROMPT.replace('{business_context}', contextString)

    // Call Claude API with prompt caching and extended thinking
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8096,
      thinking: {
        type: 'enabled',
        budget_tokens: 16000,
      },
      system: [
        {
          type: 'text',
          text: PENELOPE_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    // Extract only text blocks, filtering out thinking blocks
    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    // Parse the JSON response
    let personaData: PersonaData
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
      return NextResponse.json({ error: 'Failed to parse persona data' }, { status: 500 })
    }

    // Save buyer persona to database
    const { data: newBuyerPersona, error: insertError } = await supabase
      .from('buyer_personas')
      .insert({
        company_profile_id,
        persona_data: personaData,
      })
      .select('id')
      .single()

    if (insertError || !newBuyerPersona) {
      console.error('Failed to save buyer persona to database:', insertError)
      return NextResponse.json({ error: 'Failed to save buyer persona' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      buyer_persona_id: newBuyerPersona.id,
      persona_data: personaData,
    })
  } catch (error) {
    console.error('Error generating buyer persona:', error)
    return NextResponse.json({ error: 'Failed to generate buyer persona' }, { status: 500 })
  }
}

/**
 * Format business context specifically for B2B buyer persona generation.
 * This provides rich context about the company and the buyer role.
 */
function formatBuyerPersonaContext(
  context: BusinessContext,
  companyData: CompanyProfile,
  buyerRole: string,
  buyerDescription?: string,
  buyerChallenges?: string
): string {
  let formatted = `
## TARGET COMPANY CONTEXT
Company Name: ${companyData.name}
Industry: ${companyData.industry}
Company Size: ${companyData.size}
Location: ${companyData.location}
Business Model: ${companyData.business_model}

## COMPANY BUYING PROCESS
Typical Buying Cycle: ${companyData.buying_process?.typical_cycle_length || 'Not specified'}
Key Stakeholders: ${companyData.buying_process?.stakeholders_involved?.join(', ') || 'Not specified'}
Budget Authority: ${companyData.buying_process?.budget_authority || 'Not specified'}
Procurement Process: ${companyData.buying_process?.procurement_process || 'Not specified'}

## COMPANY CHALLENGES
Internal Challenges: ${companyData.challenges?.internal?.join(', ') || 'Not specified'}
External Challenges: ${companyData.challenges?.external?.join(', ') || 'Not specified'}
Market Pressures: ${companyData.challenges?.market_pressures?.join(', ') || 'Not specified'}

## COMPANY GOALS
Short-term Goals: ${companyData.goals?.short_term?.join(', ') || 'Not specified'}
Long-term Goals: ${companyData.goals?.long_term?.join(', ') || 'Not specified'}
Strategic Priorities: ${companyData.goals?.strategic_priorities?.join(', ') || 'Not specified'}

## BUYER PERSONA REQUEST
Role/Title: ${buyerRole}
${buyerDescription ? `Role Description: ${buyerDescription}` : ''}
${buyerChallenges ? `Key Challenges: ${buyerChallenges}` : ''}

## BUSINESS CONTEXT
Business Name (Seller): ${context.business_name}
Business Sector: ${context.business_sector}
Problem Solved: ${context.problem_solved}
Unique Selling Point: ${context.unique_selling_point}

## SPECIAL INSTRUCTIONS
Create a buyer persona for someone in the "${buyerRole}" role at ${companyData.name}.
This is a B2B buyer persona - focus on:
- Professional motivations and career goals
- Decision-making authority and influence in the buying process
- How they evaluate vendors and solutions
- What matters to them professionally
- Their relationship to other stakeholders in buying decisions
- Their day-to-day challenges that relate to the seller's solution

Make this persona feel like a real individual working at this type of company.
The persona should be useful for sales and marketing teams targeting this buyer type.
`

  return formatted.trim()
}
