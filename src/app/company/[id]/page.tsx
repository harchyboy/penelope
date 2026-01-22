'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { ArrowLeft, Building2, Users, Plus, ChevronRight, ChevronDown, ChevronUp, Briefcase, Target, Clock, Loader2, AlertTriangle, Cpu } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getCompanyProfile, type CompanyProfileWithBuyerPersonas, type BuyerPersonaListItem } from './actions'

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

// Buyer persona card - links to buyer persona detail page
function BuyerPersonaCard({ buyerPersona, companyId }: { buyerPersona: BuyerPersonaListItem; companyId: string }) {
  const personaData = buyerPersona.persona_data

  return (
    <Link href={`/company/${companyId}/buyer/${buyerPersona.id}`}>
      <Card hover className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-1">{personaData.name}</CardTitle>
            <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
          </div>
          <CardDescription className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              <Users className="h-3 w-3" />
              Buyer Persona
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-500">
            <p className="line-clamp-1">
              <span className="font-medium text-slate-700">Role:</span> {personaData.occupation}
            </p>
            <p className="line-clamp-1">
              <span className="font-medium text-slate-700">Age:</span> {personaData.age}
            </p>
            <p>
              <span className="font-medium text-slate-700">Created:</span> {formatDate(buyerPersona.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
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
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-orange-600" />
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

// Company overview with expandable sections
function CompanyOverview({
  companyProfile,
  expandedSections,
  toggleSection
}: {
  companyProfile: CompanyProfileWithBuyerPersonas
  expandedSections: Set<string>
  toggleSection: (section: string) => void
}) {
  const company = companyProfile.company_data

  return (
    <div className="space-y-4">
      {/* Company Header Card - Always visible */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{company.name}</CardTitle>
              <CardDescription>{company.industry} • {company.size}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-500">Location</p>
              <p className="font-medium text-slate-900">{company.location}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Founded</p>
              <p className="font-medium text-slate-900">{company.founded}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Size</p>
              <p className="font-medium text-slate-900">{company.size}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Industry</p>
              <p className="font-medium text-slate-900">{company.industry}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Model - Expandable */}
      <ExpandableSection
        id="business_model"
        title="Business Model"
        icon={Briefcase}
        expanded={expandedSections.has('business_model')}
        onToggle={() => toggleSection('business_model')}
      >
        <p className="text-slate-600">{company.business_model}</p>
      </ExpandableSection>

      {/* Company Culture - Expandable */}
      <ExpandableSection
        id="culture"
        title="Company Culture"
        icon={Users}
        expanded={expandedSections.has('culture')}
        onToggle={() => toggleSection('culture')}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Core Values</h4>
            <div className="flex flex-wrap gap-2">
              {company.company_culture.values.map((value, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Work Environment</h4>
            <p className="text-slate-600">{company.company_culture.work_environment}</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Decision Making Style</h4>
            <p className="text-slate-600">{company.company_culture.decision_making_style}</p>
          </div>
        </div>
      </ExpandableSection>

      {/* Challenges - Expandable */}
      <ExpandableSection
        id="challenges"
        title="Challenges"
        icon={AlertTriangle}
        expanded={expandedSections.has('challenges')}
        onToggle={() => toggleSection('challenges')}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Internal Challenges</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {company.challenges.internal.map((challenge, idx) => (
                <li key={idx}>{challenge}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">External Challenges</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {company.challenges.external.map((challenge, idx) => (
                <li key={idx}>{challenge}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Market Pressures</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {company.challenges.market_pressures.map((pressure, idx) => (
                <li key={idx}>{pressure}</li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableSection>

      {/* Goals - Expandable */}
      <ExpandableSection
        id="goals"
        title="Strategic Goals"
        icon={Target}
        expanded={expandedSections.has('goals')}
        onToggle={() => toggleSection('goals')}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Short-term Goals</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {company.goals.short_term.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Long-term Goals</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {company.goals.long_term.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Strategic Priorities</h4>
            <div className="flex flex-wrap gap-2">
              {company.goals.strategic_priorities.map((priority, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                >
                  {priority}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Buying Process - Expandable */}
      <ExpandableSection
        id="buying_process"
        title="Buying Process"
        icon={Clock}
        expanded={expandedSections.has('buying_process')}
        onToggle={() => toggleSection('buying_process')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Typical Cycle Length</p>
              <p className="font-medium text-slate-900">{company.buying_process.typical_cycle_length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Budget Authority</p>
              <p className="font-medium text-slate-900">{company.buying_process.budget_authority}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Stakeholders Involved</h4>
            <div className="flex flex-wrap gap-2">
              {company.buying_process.stakeholders_involved.map((stakeholder, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {stakeholder}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Procurement Process</h4>
            <p className="text-slate-600">{company.buying_process.procurement_process}</p>
          </div>
        </div>
      </ExpandableSection>

      {/* Technology Stack - Expandable */}
      <ExpandableSection
        id="technology"
        title="Technology Stack"
        icon={Cpu}
        expanded={expandedSections.has('technology')}
        onToggle={() => toggleSection('technology')}
      >
        <div className="flex flex-wrap gap-2">
          {company.technology_stack.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </ExpandableSection>
    </div>
  )
}

export default function CompanyProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const companyId = params.id as string

  const [companyProfile, setCompanyProfile] = useState<CompanyProfileWithBuyerPersonas | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['business_model']))

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
    async function loadCompanyProfile() {
      if (authLoading) return
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const result = await getCompanyProfile(companyId)
        if (!result.success) {
          setError(result.error || 'Failed to load company profile')
        } else {
          setCompanyProfile(result.data || null)
        }
      } catch (err) {
        console.error('Error loading company profile:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyProfile()
  }, [companyId, user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-4xl py-12 px-4">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (error || !companyProfile) {
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
            <p className="text-slate-600 mb-4">{error || 'Company profile not found'}</p>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
            <span className="text-slate-900">{companyProfile.company_data.name}</span>
          </div>

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {companyProfile.company_data.name}
              </h1>
              <p className="text-slate-600 mt-1">
                Company Profile • Created {formatDate(companyProfile.created_at)}
              </p>
            </div>
            <Link href={`/company/${companyId}/buyer/create`}>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Add Buyer Persona
              </Button>
            </Link>
          </div>

          {/* Company overview - expandable sections */}
          <CompanyOverview
            companyProfile={companyProfile}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />

          {/* Buyer Personas section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Buyer Personas
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({companyProfile.buyer_personas.length} {companyProfile.buyer_personas.length === 1 ? 'persona' : 'personas'})
                </span>
              </h2>
            </div>

            {companyProfile.buyer_personas.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">No buyer personas yet</h3>
                    <p className="text-slate-600 max-w-sm">
                      Create buyer personas to understand the key decision makers at this type of company.
                    </p>
                  </div>
                  <Link href={`/company/${companyId}/buyer/create`}>
                    <Button>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Buyer Persona
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {companyProfile.buyer_personas.map((buyerPersona) => (
                  <BuyerPersonaCard key={buyerPersona.id} buyerPersona={buyerPersona} companyId={companyId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
