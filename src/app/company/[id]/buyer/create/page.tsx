'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Sparkles, Users, Building2, ChevronRight, Loader2 } from 'lucide-react'
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { useAuth } from '@/components/providers/auth-provider'
import { getCompanyContext, createBuyerPersona } from '../../actions'
import type { CompanyProfile, BusinessContext, PersonaData } from '@/types'

type WizardStep = 'context' | 'role' | 'generating' | 'complete'

// Role suggestions for B2B buyer personas
const ROLE_SUGGESTIONS = [
  { title: 'C-Suite Executive', description: 'CEO, CTO, CFO, or other C-level executives', role: 'Chief Technology Officer' },
  { title: 'VP / Director', description: 'VP or Director level decision makers', role: 'VP of Operations' },
  { title: 'Manager', description: 'Department or team managers', role: 'IT Manager' },
  { title: 'End User', description: 'Day-to-day users of the product/service', role: 'Software Engineer' },
  { title: 'Procurement', description: 'Purchasing or procurement specialists', role: 'Procurement Specialist' },
  { title: 'Custom Role', description: 'Define a specific role', role: '' },
]

export default function CreateBuyerPersonaPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const companyId = params.id as string

  const [step, setStep] = useState<WizardStep>('context')
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Company data
  const [companyData, setCompanyData] = useState<CompanyProfile | null>(null)
  const [prefilledContext, setPrefilledContext] = useState<Partial<BusinessContext>>({})

  // Form state for buyer persona
  const [buyerRole, setBuyerRole] = useState('')
  const [buyerDescription, setBuyerDescription] = useState('')
  const [buyerChallenges, setBuyerChallenges] = useState('')

  // Load company context on mount
  useEffect(() => {
    async function loadCompanyContext() {
      if (authLoading) return
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const result = await getCompanyContext(companyId)
        if (!result.success) {
          setError(result.error || 'Failed to load company context')
        } else if (result.data) {
          setCompanyData(result.data.company_data)
          setPrefilledContext(result.data.business_context)
        }
      } catch (err) {
        console.error('Error loading company context:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyContext()
  }, [companyId, user, authLoading, router])

  const handleRoleSelect = (role: string) => {
    setBuyerRole(role)
    if (role) {
      // Move to generating step
      setStep('role')
    }
  }

  const handleGenerate = async () => {
    if (!buyerRole.trim()) {
      setError('Please specify a buyer role')
      return
    }

    setStep('generating')
    setIsGenerating(true)
    setError(null)

    try {
      // Build business context for the buyer persona
      // This includes the company context plus buyer-specific information
      const businessContext: BusinessContext = {
        business_name: companyData?.name || prefilledContext.business_name || 'Unknown Company',
        business_sector: companyData?.industry || prefilledContext.business_sector || 'Unknown',
        price_point: 'similar', // Not as relevant for buyer personas
        target_location: companyData?.location || prefilledContext.target_location || 'Unknown',
        problem_solved: buyerChallenges || `Challenges faced by ${buyerRole} at ${companyData?.name || 'the company'}`,
        unique_selling_point: buyerDescription || `${buyerRole} involved in purchasing decisions`,
        company_size: companyData?.size || prefilledContext.company_size,
        industry: companyData?.industry || prefilledContext.industry,
        decision_makers: [buyerRole],
      }

      // Call the AI to generate the buyer persona
      const response = await fetch('/api/generate-buyer-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_profile_id: companyId,
          buyer_role: buyerRole,
          buyer_description: buyerDescription,
          buyer_challenges: buyerChallenges,
          business_context: businessContext,
          company_data: companyData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate buyer persona')
      }

      const data = await response.json()

      if (data.success && data.buyer_persona_id) {
        // Redirect to the company profile page to see the new buyer persona
        router.push(`/company/${companyId}`)
      } else {
        throw new Error(data.error || 'Failed to create buyer persona')
      }
    } catch (err) {
      console.error('Error generating buyer persona:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('role')
    } finally {
      setIsGenerating(false)
    }
  }

  // Step indicator
  const steps = [
    { id: 'context', label: 'Company Context' },
    { id: 'role', label: 'Buyer Role' },
    { id: 'generating', label: 'Generate' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading company context...</span>
        </div>
      </div>
    )
  }

  if (error && !companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Error</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/company/${companyId}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {companyData?.name || 'Company'}
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-slate-900">Penelope</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index <= currentStepIndex ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'}
                  `}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${index <= currentStepIndex ? 'text-slate-900' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${index < currentStepIndex ? 'bg-purple-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {error && step !== 'generating' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {/* Step 1: Company Context (Read-only) */}
        {step === 'context' && companyData && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Buyer Persona</h1>
              <p className="text-slate-600">
                Create a buyer persona for decision makers at{' '}
                <span className="font-medium">{companyData.name}</span>
              </p>
            </div>

            {/* Company context card */}
            <Card className="p-6 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">{companyData.name}</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>
                      <span className="font-medium">Industry:</span> {companyData.industry}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span> {companyData.size}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {companyData.location}
                    </p>
                    {companyData.buying_process?.stakeholders_involved && (
                      <p>
                        <span className="font-medium">Key Stakeholders:</span>{' '}
                        {companyData.buying_process.stakeholders_involved.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center text-sm text-slate-500">
              This buyer persona will be linked to this company profile.
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep('role')}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Buyer Role */}
        {step === 'role' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Define the Buyer</h1>
              <p className="text-slate-600">
                Who is the decision maker or influencer you want to understand?
              </p>
            </div>

            {/* Quick role suggestions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-700">Quick Select</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROLE_SUGGESTIONS.slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion.title}
                    onClick={() => handleRoleSelect(suggestion.role)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      buyerRole === suggestion.role
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <p className="font-medium text-slate-900 text-sm">{suggestion.title}</p>
                    <p className="text-xs text-slate-500">{suggestion.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom role input */}
            <Card className="p-6">
              <div className="space-y-6">
                <Input
                  label="Buyer Role / Job Title"
                  placeholder="e.g., Chief Technology Officer, VP of Sales, IT Director"
                  value={buyerRole}
                  onChange={(e) => setBuyerRole(e.target.value)}
                  required
                  helpText="The specific job title or role of this buyer persona"
                />

                <Textarea
                  label="Role Description (Optional)"
                  placeholder="Describe their responsibilities, what they care about, and their typical day..."
                  value={buyerDescription}
                  onChange={(e) => setBuyerDescription(e.target.value)}
                  helpText="Additional context helps create a more accurate persona"
                />

                <Textarea
                  label="Key Challenges (Optional)"
                  placeholder="What problems or challenges does this role face that your product/service might solve?"
                  value={buyerChallenges}
                  onChange={(e) => setBuyerChallenges(e.target.value)}
                  helpText="Understanding their pain points creates deeper insights"
                />
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('context')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={!buyerRole.trim()}>
                Generate Buyer Persona
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === 'generating' && (
          <div className="text-center space-y-8 py-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center animate-pulse-slow">
                <Users className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-400/30 animate-ping" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                🌐 Penelope is crafting your buyer persona...
              </h2>
              <p className="text-slate-600">
                Creating a detailed profile for <span className="font-medium">{buyerRole}</span> at{' '}
                <span className="font-medium">{companyData?.name}</span>
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-2">
              {[
                'Analyzing company context...',
                'Understanding buyer psychology...',
                'Mapping decision criteria...',
                'Generating behavioral insights...',
              ].map((text, index) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-slate-500 animate-fade-in"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
