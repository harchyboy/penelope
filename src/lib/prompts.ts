// Re-export the v2 system prompt from the dedicated file
export { PENELOPE_SYSTEM_PROMPT } from '@/lib/prompts/penelope-system-prompt'

export const PERSONA_GENERATION_PROMPT = `Based on the business context provided, create a detailed customer persona.

## BUSINESS CONTEXT
{business_context}

## YOUR TASK

Create a highly detailed customer persona that is:
- Rich and multidimensional
- Practical for use in design, marketing, and product development
- Specific to this business, not generic
- Psychologically deep and behaviorally accurate

## OUTPUT FORMAT

You MUST respond with valid JSON matching this exact structure:

{
  "name": "Full name that feels authentic to the demographic",
  "age": "Specific age or range (e.g., '34' or '30-35')",
  "gender": "Gender identity",
  "location": "Specific location relevant to target market",
  "occupation": "Job title and brief description",
  "income_level": "Specific range in local currency",
  "education": "Highest education level and field if relevant",
  "marital_status": "Relationship and family status",
  
  "motivations_and_values": {
    "core_motivators": ["List 3-5 primary motivators in life and work"],
    "key_values": ["List 3-5 values that guide decisions"],
    "vision_of_success": "What does success and fulfillment look like to them?"
  },
  
  "psychographic_traits": {
    "lifestyle_habits": ["List 4-6 daily habits and routines"],
    "hobbies": ["List 3-5 hobbies and interests"],
    "spending_behavior": "How they approach spending money",
    "content_consumption": ["List 3-5 types of content they consume"],
    "decision_making_process": "How they typically research and make decisions"
  },
  
  "emotional_cultural_drivers": {
    "emotional_triggers": ["List 3-5 deep emotional triggers (fear, aspiration, nostalgia, etc.)"],
    "cultural_background": "How their culture shapes their perspectives and values",
    "identity_markers": ["List 3-4 things they identify with"],
    "social_affiliations": ["List 2-4 communities or subcultures they belong to"]
  },
  
  "brand_expectations": {
    "tone_of_voice": "What communication tone resonates with them",
    "ux_style": "What kind of user experience they prefer",
    "visual_cues": ["List 3-4 visual design elements that appeal to them"],
    "personalization_level": "How much personalization do they expect",
    "ethical_standards": ["List 2-4 ethical or accessibility standards that matter to them"]
  },
  
  "pain_points": {
    "internal_obstacles": ["List 2-4 internal challenges they face"],
    "external_obstacles": ["List 2-4 external challenges they face"],
    "unmet_needs": ["List 2-4 gaps in current solutions"],
    "emotional_weight": "The emotional impact of these pain points"
  },
  
  "preferred_channels": {
    "social_platforms": ["List 3-5 platforms they use most"],
    "content_formats": ["List 3-4 content formats they prefer"],
    "influencers": ["List 2-3 types of people they follow or trust"],
    "timing_frequency": "When and how often they engage with content"
  },
  
  "buying_journey": {
    "approach": "How they approach major purchases",
    "influences": ["List 3-4 factors that influence their decisions"],
    "conversion_triggers": ["List 2-3 things that make them buy"],
    "abandonment_reasons": ["List 2-3 reasons they might abandon a purchase"]
  },
  
  "loyalty_triggers": {
    "trust_builders": ["List 3-4 things that earn their long-term trust"],
    "dealbreakers": ["List 2-3 things that would make them leave"],
    "emotional_connection": "What creates emotional brand connection for them"
  },
  
  "personality_typing": {
    "mbti": "Most likely MBTI type (e.g., 'INFJ - The Advocate')",
    "mbti_explanation": "How this type influences their buying behavior and brand loyalty",
    "enneagram": "Most likely Enneagram type (e.g., 'Type 4 - The Individualist')",
    "enneagram_explanation": "How this type influences their communication preferences"
  },
  
  "brand_alignment": {
    "aligned_brands": ["List 3-5 brands this persona naturally aligns with"],
    "tone_overlap": "What tone/purpose overlap exists between those brands and this persona",
    "aesthetic_overlap": "What aesthetic preferences emerge"
  },
  
  "internal_monologue": "A 2-3 sentence quote capturing their current mindset, worry, or inner goal",
  
  "psychological_depth": {
    "core_fears": ["List 2-4 deep-seated fears"],
    "hidden_desires": ["List 2-4 desires they may not openly admit"],
    "emotional_contradictions": ["List 2-3 internal contradictions"],
    "unvocalized_thoughts": ["List 2-3 thoughts they have but don't say aloud"],
    "meaningful_symbols": ["List 2-3 symbols, language, or archetypes that speak to them"],
    "public_mask_vs_private_self": "How they present publicly vs who they really are",
    "feeling_seen": "What makes them feel deeply seen, understood, or part of something meaningful"
  }
}

IMPORTANT: 
- Respond ONLY with the JSON object, no additional text before or after
- Ensure all arrays have the specified number of items
- Make everything specific to the business context provided
- Every field must be filled - no null or empty values`

export const COMPANY_PROFILE_PROMPT = `Based on the business context provided, create a detailed B2B company profile.

## BUSINESS CONTEXT
{business_context}

## YOUR TASK

Create a detailed company profile that represents the ideal target company for this business. This profile should:
- Feel like a real company with specific characteristics
- Be useful for targeting and messaging decisions
- Include insights about their buying process and stakeholders

## OUTPUT FORMAT

You MUST respond with valid JSON matching this exact structure:

{
  "name": "A realistic company name that fits the profile",
  "industry": "Specific industry and sub-sector",
  "size": "Employee count range and company stage",
  "location": "Headquarters location",
  "founded": "Approximate founding year or range",
  "business_model": "How they make money and serve customers",
  
  "company_culture": {
    "values": ["List 3-5 company values"],
    "work_environment": "Description of work culture and environment",
    "decision_making_style": "How decisions typically get made"
  },
  
  "challenges": {
    "internal": ["List 2-4 internal challenges"],
    "external": ["List 2-4 external/market challenges"],
    "market_pressures": ["List 2-3 competitive or market pressures"]
  },
  
  "goals": {
    "short_term": ["List 2-3 goals for next 6-12 months"],
    "long_term": ["List 2-3 goals for next 2-5 years"],
    "strategic_priorities": ["List 2-3 key strategic priorities"]
  },
  
  "buying_process": {
    "typical_cycle_length": "How long their buying cycle typically is",
    "stakeholders_involved": ["List 3-5 roles typically involved in buying decisions"],
    "budget_authority": "Who holds budget authority and how budgets work",
    "procurement_process": "Description of their procurement process"
  },
  
  "technology_stack": ["List 4-6 types of tools/technologies they likely use"],
  "competitors": ["List 2-4 types of companies they compete with"]
}

IMPORTANT:
- Respond ONLY with the JSON object, no additional text
- Make everything specific to the business context
- Every field must be filled`

export const CHAT_SYSTEM_PROMPT = `You are Penelope, continuing a conversation about a customer persona you've created.

## THE PERSONA
{persona_data}

## YOUR ROLE IN THIS CONVERSATION

You're here to:
1. Answer questions about the persona you created
2. Explain your reasoning and methodology
3. Dive deeper into specific aspects when asked
4. Provide actionable recommendations based on the persona
5. Help the user understand how to use this persona effectively

## GUIDELINES

- Always reference specific details from the persona when answering
- Explain the "why" behind persona characteristics when asked
- Connect insights back to the original business context
- Be willing to explore hypotheticals ("What if we targeted a different age group?")
- Suggest marketing angles, messaging strategies, and channel recommendations
- Acknowledge when something is an educated inference vs. a certainty

Remember to wrap your responses with 🌐 emojis - you're Penelope, the marketing and branding customer persona whiz!`

export const DEEP_DIVE_PROMPT = `Based on the persona already created, provide a deeper psychological analysis.

## THE PERSONA
{persona_data}

## YOUR TASK

Go deeper into the psyche of this persona. Break down their:
- Core fears and desires (including Enneagram-style conflict)
- Hidden emotional contradictions
- Thought patterns they don't vocalize, especially late at night
- Symbols, language, or archetypes that speak to them emotionally
- The emotional masks they wear in public vs who they really are
- What makes them feel deeply seen, understood, or part of something meaningful

Write this as if you were decoding their internal emotional operating system.

Be specific, psychological, and insightful. This is for someone who wants to truly understand their audience at a deep level.`
