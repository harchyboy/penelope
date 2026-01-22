// User Types
export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  free_persona_used: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string | null
  plan: 'one_time' | 'monthly'
  status: 'active' | 'cancelled' | 'past_due' | 'incomplete'
  personas_remaining: number
  period_start: string
  period_end: string
  created_at: string
}

// Persona Types
export type PersonaType = 'b2c_individual' | 'b2b_company' | 'b2b_buyer'

export interface BusinessContext {
  business_name: string
  business_sector: string
  price_point: 'higher' | 'lower' | 'similar'
  target_location: string
  problem_solved: string
  unique_selling_point: string
  // B2B specific
  company_size?: string
  industry?: string
  decision_makers?: string[]
}

export interface PersonaData {
  // Basic Info
  name: string
  age: string
  gender: string
  location: string
  occupation: string
  income_level: string
  education: string
  marital_status: string

  // Deep Insights
  motivations_and_values: {
    core_motivators: string[]
    key_values: string[]
    vision_of_success: string
  }

  psychographic_traits: {
    lifestyle_habits: string[]
    hobbies: string[]
    spending_behavior: string
    content_consumption: string[]
    decision_making_process: string
  }

  emotional_cultural_drivers: {
    emotional_triggers: string[]
    cultural_background: string
    identity_markers: string[]
    social_affiliations: string[]
  }

  brand_expectations: {
    tone_of_voice: string
    ux_style: string
    visual_cues: string[]
    personalization_level: string
    ethical_standards: string[]
  }

  pain_points: {
    internal_obstacles: string[]
    external_obstacles: string[]
    unmet_needs: string[]
    emotional_weight: string
  }

  preferred_channels: {
    social_platforms: string[]
    content_formats: string[]
    influencers: string[]
    timing_frequency: string
  }

  buying_journey: {
    approach: string
    influences: string[]
    conversion_triggers: string[]
    abandonment_reasons: string[]
  }

  loyalty_triggers: {
    trust_builders: string[]
    dealbreakers: string[]
    emotional_connection: string
  }

  personality_typing: {
    mbti: string
    mbti_explanation: string
    enneagram: string
    enneagram_explanation: string
  }

  brand_alignment: {
    aligned_brands: string[]
    tone_overlap: string
    aesthetic_overlap: string
  }

  internal_monologue: string

  // Deep psychological insights (unlocked content)
  psychological_depth?: {
    core_fears: string[]
    hidden_desires: string[]
    emotional_contradictions: string[]
    unvocalized_thoughts: string[]
    meaningful_symbols: string[]
    public_mask_vs_private_self: string
    feeling_seen: string
  }
}

export interface CompanyProfile {
  name: string
  industry: string
  size: string
  location: string
  founded: string
  business_model: string
  
  company_culture: {
    values: string[]
    work_environment: string
    decision_making_style: string
  }

  challenges: {
    internal: string[]
    external: string[]
    market_pressures: string[]
  }

  goals: {
    short_term: string[]
    long_term: string[]
    strategic_priorities: string[]
  }

  buying_process: {
    typical_cycle_length: string
    stakeholders_involved: string[]
    budget_authority: string
    procurement_process: string
  }

  technology_stack: string[]
  competitors: string[]
}

export interface Persona {
  id: string
  user_id: string | null
  type: PersonaType
  company_id: string | null  // For b2b_buyer, links to parent company
  business_context: BusinessContext
  persona_data: PersonaData | null
  company_profile: CompanyProfile | null  // For b2b_company type
  is_unlocked: boolean
  is_complete: boolean
  created_at: string
  updated_at: string
}

// Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  persona_id: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

// Wizard Types
export interface WizardStep {
  id: string
  title: string
  description: string
  fields: WizardField[]
}

export interface WizardField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox'
  placeholder?: string
  options?: { value: string; label: string }[]
  required: boolean
  helpText?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface GeneratePersonaRequest {
  type: PersonaType
  business_context: BusinessContext
  company_id?: string  // For b2b_buyer
}

export interface GeneratePersonaResponse {
  persona_id: string
  persona_data: PersonaData
  is_preview: boolean  // True if blurred/limited
}
