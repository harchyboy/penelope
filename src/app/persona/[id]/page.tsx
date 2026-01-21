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
  Users,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Building2
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-600">Loading persona...</p>
        </div>
      </div>
    )
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error || 'Persona not found'}</p>
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

  // Sections that are visible in preview vs full
  const previewSections = ['basic', 'motivations_and_values']

  const isSectionLocked = (section: string) => {
    if (isUnlocked) return false
    return !previewSections.includes(section)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat with Penelope
            </Button>
            <Button size="sm" disabled={!isUnlocked}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Unlock Banner */}
        {!isUnlocked && (
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-blue to-brand-blue/80 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Preview Mode</h3>
                  <p className="text-white/80">Register for free to unlock your first full persona</p>
                </div>
              </div>
              <Link href="/register">
                <Button variant="accent">
                  <Unlock className="mr-2 h-4 w-4" />
                  Unlock Full Persona
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Persona Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isB2B ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              {isB2B ? (
                <Building2 className={`h-10 w-10 ${isB2B ? 'text-brand-orange' : 'text-brand-blue'}`} />
              ) : (
                <User className="h-10 w-10 text-brand-blue" />
              )}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                isB2B ? 'bg-orange-100 text-brand-orange' : 'bg-blue-100 text-brand-blue'
              }`}>
                {isB2B ? 'B2B Company Profile' : 'B2C Buyer Persona'}
              </span>
              <h1 className="text-3xl font-bold text-slate-900">
                {(data as any)?.name || 'Unnamed Persona'}
              </h1>
              <p className="text-slate-600">
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

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl z-50">
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
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Age" value={data.age} />
          <InfoItem label="Gender" value={data.gender} />
          <InfoItem label="Location" value={data.location} />
          <InfoItem label="Occupation" value={data.occupation} />
          <InfoItem label="Income Level" value={data.income_level} />
          <InfoItem label="Education" value={data.education} />
          <InfoItem label="Marital Status" value={data.marital_status} />
        </div>
      ),
    },
    {
      id: 'motivations_and_values',
      title: 'Motivations & Values',
      icon: Heart,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Core Motivators</h4>
            <div className="flex flex-wrap gap-2">
              {data.motivations_and_values.core_motivators.map((m, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-brand-blue rounded-full text-sm">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Key Values</h4>
            <div className="flex flex-wrap gap-2">
              {data.motivations_and_values.key_values.map((v, i) => (
                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Vision of Success</h4>
            <p className="text-slate-600">{data.motivations_and_values.vision_of_success}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'psychographic_traits',
      title: 'Psychographic Traits',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Lifestyle Habits</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.psychographic_traits.lifestyle_habits.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Hobbies</h4>
            <div className="flex flex-wrap gap-2">
              {data.psychographic_traits.hobbies.map((h, i) => (
                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  {h}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Spending Behavior</h4>
            <p className="text-slate-600">{data.psychographic_traits.spending_behavior}</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Decision Making Process</h4>
            <p className="text-slate-600">{data.psychographic_traits.decision_making_process}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'pain_points',
      title: 'Pain Points & Challenges',
      icon: Heart,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Internal Obstacles</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.pain_points.internal_obstacles.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">External Obstacles</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.pain_points.external_obstacles.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Unmet Needs</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.pain_points.unmet_needs.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Emotional Impact</h4>
            <p className="text-slate-600 italic">&quot;{data.pain_points.emotional_weight}&quot;</p>
          </div>
        </div>
      ),
    },
    {
      id: 'buying_journey',
      title: 'Buying Journey',
      icon: ShoppingCart,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Approach to Purchases</h4>
            <p className="text-slate-600">{data.buying_journey.approach}</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Key Influences</h4>
            <div className="flex flex-wrap gap-2">
              {data.buying_journey.influences.map((i, idx) => (
                <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                  {i}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Conversion Triggers</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.buying_journey.conversion_triggers.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Abandonment Reasons</h4>
            <ul className="list-disc list-inside text-red-600 space-y-1">
              {data.buying_journey.abandonment_reasons.map((r, i) => (
                <li key={i}>{r}</li>
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
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-brand-blue mb-2">{data.personality_typing.mbti}</h4>
            <p className="text-slate-600">{data.personality_typing.mbti_explanation}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-700 mb-2">{data.personality_typing.enneagram}</h4>
            <p className="text-slate-600">{data.personality_typing.enneagram_explanation}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'internal_monologue',
      title: 'Internal Monologue',
      icon: MessageCircle,
      content: (
        <div className="p-6 bg-slate-100 rounded-lg border-l-4 border-brand-blue">
          <p className="text-lg italic text-slate-700">&quot;{data.internal_monologue}&quot;</p>
        </div>
      ),
    },
    {
      id: 'psychological_depth',
      title: 'Deep Psychological Insights',
      icon: Sparkles,
      content: data.psychological_depth ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Core Fears</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.psychological_depth.core_fears.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Hidden Desires</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.psychological_depth.hidden_desires.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Emotional Contradictions</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {data.psychological_depth.emotional_contradictions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Public Mask vs Private Self</h4>
            <p className="text-slate-600">{data.psychological_depth.public_mask_vs_private_self}</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">What Makes Them Feel Seen</h4>
            <p className="text-slate-600">{data.psychological_depth.feeling_seen}</p>
          </div>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.id} className="overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <section.icon className="h-5 w-5 text-slate-600" />
              </div>
              <span className="font-semibold text-slate-900">{section.title}</span>
              {isSectionLocked(section.id) && (
                <Lock className="h-4 w-4 text-slate-400" />
              )}
            </div>
            {expandedSections.has(section.id) ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {expandedSections.has(section.id) && (
            <CardContent className={`pt-0 ${isSectionLocked(section.id) ? 'blur-content' : ''}`}>
              {section.content}
            </CardContent>
          )}
        </Card>
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
  // Simplified company sections
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Company Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Industry" value={data.industry} />
            <InfoItem label="Size" value={data.size} />
            <InfoItem label="Location" value={data.location} />
            <InfoItem label="Founded" value={data.founded} />
            <InfoItem label="Business Model" value={data.business_model} className="col-span-2" />
          </div>
        </CardContent>
      </Card>

      <Card className={isSectionLocked('culture') ? 'blur-content' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Company Culture
            {isSectionLocked('culture') && <Lock className="h-4 w-4 text-slate-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Values</h4>
              <div className="flex flex-wrap gap-2">
                {data.company_culture.values.map((v, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-brand-blue rounded-full text-sm">
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Work Environment</h4>
              <p className="text-slate-600">{data.company_culture.work_environment}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Decision Making Style</h4>
              <p className="text-slate-600">{data.company_culture.decision_making_style}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={isSectionLocked('buying') ? 'blur-content' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Buying Process
            {isSectionLocked('buying') && <Lock className="h-4 w-4 text-slate-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InfoItem label="Typical Cycle Length" value={data.buying_process.typical_cycle_length} />
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Stakeholders Involved</h4>
              <div className="flex flex-wrap gap-2">
                {data.buying_process.stakeholders_involved.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-orange-50 text-brand-orange rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <InfoItem label="Budget Authority" value={data.buying_process.budget_authority} />
            <InfoItem label="Procurement Process" value={data.buying_process.procurement_process} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper component for info items
function InfoItem({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <span className="text-sm text-slate-500">{label}</span>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  )
}

// Chat Sidebar Component
function ChatSidebar({ onClose, personaData }: { onClose: () => void; personaData: PersonaData | null }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: '🌐 Hello! I\'m Penelope. I\'ve created this persona based on your business context. Feel free to ask me anything about them - why they think a certain way, how to reach them, or to dive deeper into any aspect of their profile. What would you like to explore? 🌐',
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
        content: '🌐 I apologize, but I encountered an error. Please try again. 🌐' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold">Chat with Penelope</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-brand-blue text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Penelope anything..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
          />
          <Button onClick={handleSend} disabled={isLoading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
