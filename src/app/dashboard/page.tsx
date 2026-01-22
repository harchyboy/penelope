'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Plus, Users, Building2, Lock, Unlock, Sparkles, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Persona, PersonaType } from '@/types'
import { useEffect, useState } from 'react'
import { getUserPersonas, getUserFreePersonaStatus } from './actions'

// Type badge component
function TypeBadge({ type }: { type: PersonaType }) {
  const config = {
    b2c_individual: {
      label: 'B2C',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Users,
    },
    b2b_company: {
      label: 'B2B Company',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: Building2,
    },
    b2b_buyer: {
      label: 'B2B Buyer',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: Users,
    },
  }

  const { label, bgColor, textColor, icon: Icon } = config[type]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

// Persona card component
function PersonaCard({ persona }: { persona: Persona }) {
  const personaName = persona.persona_data?.name || persona.company_profile?.name || 'Unnamed Persona'

  return (
    <Link href={`/persona/${persona.id}`}>
      <Card hover className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-1">{personaName}</CardTitle>
            {persona.is_unlocked ? (
              <Unlock className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
            )}
          </div>
          <CardDescription className="flex items-center gap-2">
            <TypeBadge type={persona.type} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-500">
            {persona.business_context?.business_name && (
              <p className="line-clamp-1">
                <span className="font-medium text-slate-700">Business:</span> {persona.business_context.business_name}
              </p>
            )}
            <p>
              <span className="font-medium text-slate-700">Created:</span> {formatDate(persona.created_at)}
            </p>
            <p className="flex items-center gap-1">
              <span className="font-medium text-slate-700">Status:</span>
              {persona.is_unlocked ? (
                <span className="text-green-600">Unlocked</span>
              ) : (
                <span className="text-slate-500">Locked</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Empty state component
function EmptyState() {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-brand-blue" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">No personas yet</h3>
          <p className="text-slate-600 max-w-sm">
            Create your first AI-powered customer persona to deeply understand your target audience.
          </p>
        </div>
        <Link href="/create">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Persona
          </Button>
        </Link>
      </div>
    </Card>
  )
}

// Free persona status banner
function FreePersonaStatus({ used }: { used: boolean }) {
  if (used) {
    return (
      <div className="bg-slate-100 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <Lock className="h-5 w-5 text-slate-500" />
        </div>
        <div>
          <p className="font-medium text-slate-900">Free persona used</p>
          <p className="text-sm text-slate-600">
            You&apos;ve used your free persona. Subscribe to create and unlock more.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-5 w-5 text-green-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-green-900">Free persona available!</p>
        <p className="text-sm text-green-700">
          You have one free persona unlock. Create a persona and unlock it for free.
        </p>
      </div>
      <Link href="/create">
        <Button variant="outline" size="sm" className="flex-shrink-0 border-green-600 text-green-700 hover:bg-green-100">
          Create Now
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  )
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded" />
      <div className="h-24 bg-slate-200 rounded-lg" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [personas, setPersonas] = useState<Persona[]>([])
  const [freePersonaUsed, setFreePersonaUsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      if (authLoading) return
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const [personasResult, statusResult] = await Promise.all([
          getUserPersonas(),
          getUserFreePersonaStatus(),
        ])

        if (!personasResult.success) {
          setError(personasResult.error || 'Failed to load personas')
        } else {
          setPersonas(personasResult.data || [])
        }

        if (statusResult.success) {
          setFreePersonaUsed(statusResult.data?.free_persona_used ?? false)
        }
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [user, authLoading])

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Error loading dashboard</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </div>
      </div>
    )
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {displayName}!
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your personas and explore insights
              </p>
            </div>
            <Link href="/create">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                New Persona
              </Button>
            </Link>
          </div>

          {/* Free persona status */}
          <FreePersonaStatus used={freePersonaUsed} />

          {/* Personas section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Your Personas
              {personas.length > 0 && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({personas.length} {personas.length === 1 ? 'persona' : 'personas'})
                </span>
              )}
            </h2>

            {personas.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personas.map((persona) => (
                  <PersonaCard key={persona.id} persona={persona} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
