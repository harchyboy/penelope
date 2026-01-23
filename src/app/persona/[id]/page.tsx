'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  MessageCircle,
  Lock,
  Unlock,
  User,
  Heart,
  Brain,
  ShoppingCart,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Building2,
  X,
  Send
} from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { Persona, PersonaData, CompanyProfile } from '@/types'

export default function PersonaPage() {
  const params = useParams()
  const router = useRouter()
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))

  useEffect(() => {
    async function fetchPersona() {
      try {
        const response = await fetch(`/api/generate-persona?id=${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch persona')
        }

        setPersona(data.persona)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPersona()
    }
  }, [params.id])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-hartz-blue/10 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="h-8 w-8 text-hartz-blue" />
          </div>
          <p className="text-body text-hartz-muted">Loading persona...</p>
        </div>
      </div>
    )
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-body text-red-500">{error || 'Persona not found'}</p>
          <Link href="/create">
            <Button>Create a New Persona</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isB2B = persona.type === 'b2b_company'
  const data = isB2B ? persona.company_profile : persona.persona_data
  const isUnlocked = persona.is_unlocked

  const previewSections = ['basic', 'motivations_and_values']

  const isSectionLocked = (section: string) => {
    if (isUnlocked) return false
    return !previewSections.includes(section)
  }

  return (
    <div className="min-h-screen">
      {/* Glass Header */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-hartz-muted hover:text-hartz-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-body-sm">Back</span>
          </button>

          <span className="text-lg font-bold tracking-tight text-hartz-black">PENELOPE</span>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button size="sm" disabled={!isUnlocked}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Unlock Banner */}
          {!isUnlocked && (
            <div className="mb-8 bento-card bg-hartz-black text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-subheading font-semibold">Preview Mode</h3>
                    <p className="text-body-sm text-white/60">Register free to unlock full persona</p>
                  </div>
                </div>
                <Link href="/register">
                  <Button>
                    <Unlock className="mr-2 h-4 w-4" />
                    Unlock Full Persona
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Persona Header */}
          <div className="mb-8">
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isB2B ? 'bg-hartz-black/5' : 'bg-hartz-blue/10'
              }`}>
                {isB2B ? (
                  <Building2 className="h-10 w-10 text-hartz-black" />
                ) : (
                  <User className="h-10 w-10 text-hartz-blue" />
                )}
              </div>
              <div>
                <span className={`meta-label ${isB2B ? '' : 'text-hartz-blue'}`}>
                  {isB2B ? 'B2B COMPANY PROFILE' : 'B2C BUYER PERSONA'}
                </span>
                <h1 className="text-display text-hartz-black mt-2">
                  {(data as any)?.name || 'Unnamed Persona'}
                </h1>
                <p className="text-body text-hartz-muted mt-2">
                  Created for {persona.business_context.business_name}
                </p>
              </div>
            </div>
          </div>

          {/* Persona Content */}
          {!isB2B && persona.persona_data && (
            <PersonaContent
              data={persona.persona_data}
              isUnlocked={isUnlocked}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              isSectionLocked={isSectionLocked}
            />
          )}

          {isB2B && persona.company_profile && (
            <CompanyContent
              data={persona.company_profile}
              isUnlocked={isUnlocked}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              isSectionLocked={isSectionLocked}
            />
          )}

          {/* Create Another CTA */}
          <div className="mt-12 text-center">
            <Link href="/create">
              <Button variant="outline" size="lg">
                Create Another Persona
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed right-0 top-0 h-full w-96 bg-hartz-white border-l border-hartz-border shadow-glass z-50">
          <ChatSidebar onClose={() => setShowChat(false)} personaData={persona.persona_data} />
        </div>
      )}
    </div>
  )
}

// Persona Content Component for B2C
function PersonaContent({
  data,
  isUnlocked,
  expandedSections,
  toggleSection,
  isSectionLocked
}: {
  data: PersonaData
  isUnlocked: boolean
  expandedSections: Set<string>
  toggleSection: (section: string) => void
  isSectionLocked: (section: string) => boolean
}) {
  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: User,
      content: (
        <div className="grid grid-cols-2 gap-6">
          <InfoItem label="AGE" value={data.age} />
          <InfoItem label="GENDER" value={data.gender} />
          <InfoItem label="LOCATION" value={data.location} />
          <InfoItem label="OCCUPATION" value={data.occupation} />
          <InfoItem label="INCOME" value={data.income_level} />
          <InfoItem label="EDUCATION" value={data.education} />
          <InfoItem label="MARITAL STATUS" value={data.marital_status} className="col-span-2" />
        </div>
      ),
    },
    {
      id: 'motivations_and_values',
      title: 'Motivations & Values',
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div>
            <span className="meta-label">CORE MOTIVATORS</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.motivations_and_values.core_motivators.map((m, i) => (
                <span key={i} className="px-4 py-2 bg-hartz-blue/10 text-hartz-blue rounded-full text-body-sm font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="meta-label">KEY VALUES</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.motivations_and_values.key_values.map((v, i) => (
                <span key={i} className="px-4 py-2 bg-hartz-black/5 text-hartz-black rounded-full text-body-sm font-medium">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="meta-label">VISION OF SUCCESS</span>
            <p className="text-body text-hartz-muted mt-3">{data.motivations_and_values.vision_of_success}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'psychographic_traits',
      title: 'Psychographic Traits',
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div>
            <span className="meta-label">LIFESTYLE HABITS</span>
            <ul className="mt-3 space-y-2">
              {data.psychographic_traits.lifestyle_habits.map((h, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-hartz-blue mt-2 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">HOBBIES</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.psychographic_traits.hobbies.map((h, i) => (
                <span key={i} className="px-4 py-2 bg-hartz-black/5 text-hartz-muted rounded-full text-body-sm">
                  {h}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="meta-label">SPENDING BEHAVIOR</span>
            <p className="text-body text-hartz-muted mt-3">{data.psychographic_traits.spending_behavior}</p>
          </div>
          <div>
            <span className="meta-label">DECISION MAKING</span>
            <p className="text-body text-hartz-muted mt-3">{data.psychographic_traits.decision_making_process}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'pain_points',
      title: 'Pain Points & Challenges',
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div>
            <span className="meta-label">INTERNAL OBSTACLES</span>
            <ul className="mt-3 space-y-2">
              {data.pain_points.internal_obstacles.map((o, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">EXTERNAL OBSTACLES</span>
            <ul className="mt-3 space-y-2">
              {data.pain_points.external_obstacles.map((o, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">UNMET NEEDS</span>
            <ul className="mt-3 space-y-2">
              {data.pain_points.unmet_needs.map((n, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-hartz-blue mt-2 flex-shrink-0" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-hartz-black/5 border-l-4 border-hartz-black">
            <span className="meta-label">EMOTIONAL WEIGHT</span>
            <p className="text-body text-hartz-muted mt-2 italic">&quot;{data.pain_points.emotional_weight}&quot;</p>
          </div>
        </div>
      ),
    },
    {
      id: 'buying_journey',
      title: 'Buying Journey',
      icon: ShoppingCart,
      content: (
        <div className="space-y-6">
          <div>
            <span className="meta-label">APPROACH TO PURCHASES</span>
            <p className="text-body text-hartz-muted mt-3">{data.buying_journey.approach}</p>
          </div>
          <div>
            <span className="meta-label">KEY INFLUENCES</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.buying_journey.influences.map((i, idx) => (
                <span key={idx} className="px-4 py-2 bg-hartz-blue/10 text-hartz-blue rounded-full text-body-sm font-medium">
                  {i}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="meta-label">CONVERSION TRIGGERS</span>
            <ul className="mt-3 space-y-2">
              {data.buying_journey.conversion_triggers.map((t, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">ABANDONMENT REASONS</span>
            <ul className="mt-3 space-y-2">
              {data.buying_journey.abandonment_reasons.map((r, i) => (
                <li key={i} className="text-body-sm text-red-500 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'personality_typing',
      title: 'Personality Analysis',
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-hartz-blue/10">
            <span className="meta-label text-hartz-blue">{data.personality_typing.mbti}</span>
            <p className="text-body text-hartz-muted mt-3">{data.personality_typing.mbti_explanation}</p>
          </div>
          <div className="p-6 rounded-xl bg-hartz-black/5">
            <span className="meta-label">{data.personality_typing.enneagram}</span>
            <p className="text-body text-hartz-muted mt-3">{data.personality_typing.enneagram_explanation}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'internal_monologue',
      title: 'Internal Monologue',
      icon: MessageCircle,
      content: (
        <div className="p-6 rounded-xl bg-hartz-black/5 border-l-4 border-hartz-blue">
          <p className="text-subheading italic text-hartz-muted">&quot;{data.internal_monologue}&quot;</p>
        </div>
      ),
    },
    {
      id: 'psychological_depth',
      title: 'Deep Psychological Insights',
      icon: Sparkles,
      content: data.psychological_depth ? (
        <div className="space-y-6">
          <div>
            <span className="meta-label">CORE FEARS</span>
            <ul className="mt-3 space-y-2">
              {data.psychological_depth.core_fears.map((f, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">HIDDEN DESIRES</span>
            <ul className="mt-3 space-y-2">
              {data.psychological_depth.hidden_desires.map((d, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-hartz-blue mt-2 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">EMOTIONAL CONTRADICTIONS</span>
            <ul className="mt-3 space-y-2">
              {data.psychological_depth.emotional_contradictions.map((c, i) => (
                <li key={i} className="text-body-sm text-hartz-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">PUBLIC MASK VS PRIVATE SELF</span>
            <p className="text-body text-hartz-muted mt-3">{data.psychological_depth.public_mask_vs_private_self}</p>
          </div>
          <div>
            <span className="meta-label">WHAT MAKES THEM FEEL SEEN</span>
            <p className="text-body text-hartz-muted mt-3">{data.psychological_depth.feeling_seen}</p>
          </div>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="bento-card overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-hartz-black/[0.02] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-hartz-black/5 flex items-center justify-center">
                <section.icon className="h-5 w-5 text-hartz-muted" />
              </div>
              <span className="text-subheading text-hartz-black">{section.title}</span>
              {isSectionLocked(section.id) && (
                <Lock className="h-4 w-4 text-hartz-muted" />
              )}
            </div>
            {expandedSections.has(section.id) ? (
              <ChevronUp className="h-5 w-5 text-hartz-muted" />
            ) : (
              <ChevronDown className="h-5 w-5 text-hartz-muted" />
            )}
          </button>

          {expandedSections.has(section.id) && (
            <div className={`px-6 pb-6 ${isSectionLocked(section.id) ? 'blur-content' : ''}`}>
              <div className="hairline mb-6" />
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Company Content Component for B2B
function CompanyContent({
  data,
  isUnlocked,
  expandedSections,
  toggleSection,
  isSectionLocked
}: {
  data: CompanyProfile
  isUnlocked: boolean
  expandedSections: Set<string>
  toggleSection: (section: string) => void
  isSectionLocked: (section: string) => boolean
}) {
  return (
    <div className="space-y-4">
      <div className="bento-card">
        <div className="p-6">
          <span className="meta-label">COMPANY OVERVIEW</span>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <InfoItem label="INDUSTRY" value={data.industry} />
            <InfoItem label="SIZE" value={data.size} />
            <InfoItem label="LOCATION" value={data.location} />
            <InfoItem label="FOUNDED" value={data.founded} />
            <InfoItem label="BUSINESS MODEL" value={data.business_model} className="col-span-2" />
          </div>
        </div>
      </div>

      <div className={`bento-card ${isSectionLocked('culture') ? 'blur-content' : ''}`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="meta-label">COMPANY CULTURE</span>
            {isSectionLocked('culture') && <Lock className="h-4 w-4 text-hartz-muted" />}
          </div>
          <div className="space-y-6">
            <div>
              <span className="text-body-sm font-medium text-hartz-black">Values</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.company_culture.values.map((v, i) => (
                  <span key={i} className="px-4 py-2 bg-hartz-blue/10 text-hartz-blue rounded-full text-body-sm font-medium">
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-body-sm font-medium text-hartz-black">Work Environment</span>
              <p className="text-body text-hartz-muted mt-2">{data.company_culture.work_environment}</p>
            </div>
            <div>
              <span className="text-body-sm font-medium text-hartz-black">Decision Making Style</span>
              <p className="text-body text-hartz-muted mt-2">{data.company_culture.decision_making_style}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`bento-card ${isSectionLocked('buying') ? 'blur-content' : ''}`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="meta-label">BUYING PROCESS</span>
            {isSectionLocked('buying') && <Lock className="h-4 w-4 text-hartz-muted" />}
          </div>
          <div className="space-y-6">
            <InfoItem label="TYPICAL CYCLE LENGTH" value={data.buying_process.typical_cycle_length} />
            <div>
              <span className="text-body-sm font-medium text-hartz-black">Stakeholders Involved</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.buying_process.stakeholders_involved.map((s, i) => (
                  <span key={i} className="px-4 py-2 bg-hartz-black/5 text-hartz-black rounded-full text-body-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <InfoItem label="BUDGET AUTHORITY" value={data.buying_process.budget_authority} />
            <InfoItem label="PROCUREMENT PROCESS" value={data.buying_process.procurement_process} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Info Item Component
function InfoItem({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <span className="meta-label">{label}</span>
      <p className="text-body text-hartz-black mt-1">{value}</p>
    </div>
  )
}

// Chat Sidebar Component
function ChatSidebar({ onClose, personaData }: { onClose: () => void; personaData: PersonaData | null }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m Penelope. I\'ve created this persona based on your business context. Feel free to ask me anything about them - why they think a certain way, how to reach them, or to dive deeper into any aspect of their profile. What would you like to explore?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          persona_data: personaData,
          history: messages,
        }),
      })

      const data = await response.json()

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-hartz-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-hartz-blue/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-hartz-blue" />
          </div>
          <span className="text-subheading text-hartz-black">Chat with Penelope</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-hartz-black/5 flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4 text-hartz-muted" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-body-sm ${
                msg.role === 'user'
                  ? 'bg-hartz-blue text-white'
                  : 'bg-hartz-black/5 text-hartz-black'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-hartz-black/5 p-4 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-hartz-muted rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-hartz-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-hartz-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-hartz-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Penelope anything..."
            className="flex-1 px-4 py-3 rounded-xl border border-hartz-border bg-hartz-white text-body-sm text-hartz-black placeholder:text-hartz-muted/60 focus:outline-none focus:border-hartz-blue focus:ring-2 focus:ring-hartz-blue/10"
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
