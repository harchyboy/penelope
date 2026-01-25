'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import {
  ArrowLeft,
  User,
  Heart,
  Brain,
  ShoppingCart,
  MessageCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PersonaData } from '@/types'
import { getBuyerPersona, type BuyerPersonaDetail } from './actions'

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded" />
      <div className="h-48 bg-slate-200 rounded-xl" />
      <div className="h-32 bg-slate-200 rounded-xl" />
    </div>
  )
}

// Expandable section component
function ExpandableSection({
  id,
  title,
  icon: Icon,
  expanded,
  onToggle,
  children
}: {
  id: string
  title: string
  icon: React.ElementType
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-purple-600" />
          </div>
          <span className="font-semibold text-slate-900">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <CardContent className="pt-0 border-t border-slate-100">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

// Info item helper component
function InfoItem({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <span className="text-sm text-slate-500">{label}</span>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  )
}

// Buyer persona content component
function BuyerPersonaContent({
  data,
  expandedSections,
  toggleSection
}: {
  data: PersonaData
  expandedSections: Set<string>
  toggleSection: (section: string) => void
}) {
  return (
    <div className="space-y-4">
      {/* Basic Information - Always visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Age" value={data.age} />
            <InfoItem label="Gender" value={data.gender} />
            <InfoItem label="Location" value={data.location} />
            <InfoItem label="Occupation" value={data.occupation} />
            <InfoItem label="Income Level" value={data.income_level} />
            <InfoItem label="Education" value={data.education} />
            <InfoItem label="Marital Status" value={data.marital_status} />
          </div>
        </CardContent>
      </Card>

      {/* Motivations & Values - Expandable */}
      <ExpandableSection
        id="motivations"
        title="Motivations & Values"
        icon={Heart}
        expanded={expandedSections.has('motivations')}
        onToggle={() => toggleSection('motivations')}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Core Motivators</h4>
            <div className="flex flex-wrap gap-2">
              {data.motivations_and_values.core_motivators.map((m, i) => (
                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
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
      </ExpandableSection>

      {/* Psychographic Traits - Expandable */}
      <ExpandableSection
        id="psychographics"
        title="Psychographic Traits"
        icon={Brain}
        expanded={expandedSections.has('psychographics')}
        onToggle={() => toggleSection('psychographics')}
      >
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
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
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
      </ExpandableSection>

      {/* Pain Points - Expandable */}
      <ExpandableSection
        id="pain_points"
        title="Pain Points & Challenges"
        icon={Heart}
        expanded={expandedSections.has('pain_points')}
        onToggle={() => toggleSection('pain_points')}
      >
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
      </ExpandableSection>

      {/* Buying Journey - Expandable */}
      <ExpandableSection
        id="buying_journey"
        title="Buying Journey"
        icon={ShoppingCart}
        expanded={expandedSections.has('buying_journey')}
        onToggle={() => toggleSection('buying_journey')}
      >
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
      </ExpandableSection>

      {/* Personality Analysis - Expandable */}
      <ExpandableSection
        id="personality"
        title="Personality Analysis"
        icon={Brain}
        expanded={expandedSections.has('personality')}
        onToggle={() => toggleSection('personality')}
      >
        <div className="space-y-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-700 mb-2">{data.personality_typing.mbti}</h4>
            <p className="text-slate-600">{data.personality_typing.mbti_explanation}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">{data.personality_typing.enneagram}</h4>
            <p className="text-slate-600">{data.personality_typing.enneagram_explanation}</p>
          </div>
        </div>
      </ExpandableSection>

      {/* Internal Monologue - Expandable */}
      <ExpandableSection
        id="monologue"
        title="Internal Monologue"
        icon={MessageCircle}
        expanded={expandedSections.has('monologue')}
        onToggle={() => toggleSection('monologue')}
      >
        <div className="p-6 bg-slate-100 rounded-lg border-l-4 border-purple-500">
          <p className="text-lg italic text-slate-700">&quot;{data.internal_monologue}&quot;</p>
        </div>
      </ExpandableSection>

      {/* Deep Psychological Insights - Expandable (if available) */}
      {data.psychological_depth && (
        <ExpandableSection
          id="psychological_depth"
          title="Deep Psychological Insights"
          icon={Sparkles}
          expanded={expandedSections.has('psychological_depth')}
          onToggle={() => toggleSection('psychological_depth')}
        >
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
        </ExpandableSection>
      )}
    </div>
  )
}

export default function BuyerPersonaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const companyId = params.id as string
  const buyerId = params.buyerId as string

  const [buyerPersona, setBuyerPersona] = useState<BuyerPersonaDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['motivations']))

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

  useEffect(() => {
    async function loadBuyerPersona() {
      if (authLoading) return
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const result = await getBuyerPersona(buyerId)
        if (!result.success) {
          setError(result.error || 'Failed to load buyer persona')
        } else {
          setBuyerPersona(result.data || null)
        }
      } catch (err) {
        console.error('Error loading buyer persona:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadBuyerPersona()
  }, [buyerId, user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-4xl py-12 px-4">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (error || !buyerPersona) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-4xl py-12 px-4">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Error</h3>
            <p className="text-slate-600 mb-4">{error || 'Buyer persona not found'}</p>
            <Button onClick={() => router.push(`/company/${companyId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Company Profile
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-700 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/company/${companyId}`} className="hover:text-slate-700 transition-colors">
              {buyerPersona.company_name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{buyerPersona.persona_data.name}</span>
          </div>

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 mb-2">
                  <Users className="h-3 w-3" />
                  Buyer Persona
                </span>
                <h1 className="text-3xl font-bold text-slate-900">
                  {buyerPersona.persona_data.name}
                </h1>
                <p className="text-slate-600 mt-1">
                  {buyerPersona.persona_data.occupation} • Created {formatDate(buyerPersona.created_at)}
                </p>
              </div>
            </div>
            <Link href={`/company/${companyId}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Company
              </Button>
            </Link>
          </div>

          {/* Buyer persona content */}
          <BuyerPersonaContent
            data={buyerPersona.persona_data}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />

          {/* Back to company CTA */}
          <div className="text-center pt-8">
            <Link href={`/company/${companyId}`}>
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Company Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
