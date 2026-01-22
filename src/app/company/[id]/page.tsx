'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { ArrowLeft, Building2, Users, Plus, ChevronRight, Briefcase, Target, Clock, Loader2 } from 'lucide-react'
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

// Buyer persona card
function BuyerPersonaCard({ buyerPersona }: { buyerPersona: BuyerPersonaListItem }) {
  const personaData = buyerPersona.persona_data

  return (
    <Link href={`/company/${buyerPersona.company_profile_id}/buyer/${buyerPersona.id}`}>
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

// Company overview section
function CompanyOverview({ companyProfile }: { companyProfile: CompanyProfileWithBuyerPersonas }) {
  const company = companyProfile.company_data

  return (
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
      <CardContent className="space-y-6">
        {/* Basic Info */}
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

        {/* Business Model */}
        <div>
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-400" />
            Business Model
          </h4>
          <p className="text-slate-600">{company.business_model}</p>
        </div>

        {/* Buying Process */}
        <div>
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            Buying Process
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-500">Cycle Length:</span> {company.buying_process.typical_cycle_length}</p>
            <p><span className="text-slate-500">Stakeholders:</span> {company.buying_process.stakeholders_involved.join(', ')}</p>
          </div>
        </div>

        {/* Goals */}
        <div>
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-400" />
            Strategic Priorities
          </h4>
          <div className="flex flex-wrap gap-2">
            {company.goals.strategic_priorities.map((priority, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {priority}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
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

          {/* Company overview */}
          <CompanyOverview companyProfile={companyProfile} />

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
                  <BuyerPersonaCard key={buyerPersona.id} buyerPersona={buyerPersona} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
