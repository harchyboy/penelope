'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Building2, Users, Sparkles } from 'lucide-react'
import { Button, Input, Textarea, Select, Card } from '@/components/ui'
import type { PersonaType, BusinessContext } from '@/types'

type WizardStep = 'type' | 'business' | 'details' | 'generating'

const PRICE_OPTIONS = [
  { value: 'higher', label: 'Higher than competitors' },
  { value: 'similar', label: 'Similar to competitors' },
  { value: 'lower', label: 'Lower than competitors' },
]

export default function CreatePersonaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialType = searchParams.get('type') as 'b2c' | 'b2b' | null

  const [step, setStep] = useState<WizardStep>(initialType ? 'business' : 'type')
  const [personaType, setPersonaType] = useState<PersonaType | null>(
    initialType === 'b2c' ? 'b2c_individual' :
    initialType === 'b2b' ? 'b2b_company' : null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [businessContext, setBusinessContext] = useState<BusinessContext>({
    business_name: '',
    business_sector: '',
    price_point: 'similar',
    target_location: '',
    problem_solved: '',
    unique_selling_point: '',
  })

  // B2B specific fields
  const [companySize, setCompanySize] = useState('')
  const [industry, setIndustry] = useState('')
  const [decisionMakers, setDecisionMakers] = useState('')

  const updateBusinessContext = (field: keyof BusinessContext, value: string) => {
    setBusinessContext(prev => ({ ...prev, [field]: value }))
  }

  const handleTypeSelect = (type: PersonaType) => {
    setPersonaType(type)
    setStep('business')
  }

  const handleBack = () => {
    if (step === 'business') {
      setStep('type')
    } else if (step === 'details') {
      setStep('business')
    }
  }

  const handleBusinessNext = () => {
    if (!businessContext.business_name || !businessContext.business_sector ||
        !businessContext.target_location || !businessContext.problem_solved ||
        !businessContext.unique_selling_point) {
      setError('Please fill in all required fields')
      return
    }
    setError(null)

    if (personaType === 'b2b_company') {
      setStep('details')
    } else {
      handleGenerate()
    }
  }

  const handleGenerate = async () => {
    setStep('generating')
    setIsLoading(true)
    setError(null)

    try {
      const context: BusinessContext = {
        ...businessContext,
        ...(personaType === 'b2b_company' && {
          company_size: companySize,
          industry: industry,
          decision_makers: decisionMakers.split(',').map(s => s.trim()).filter(Boolean),
        }),
      }

      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: personaType,
          business_context: context,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate persona')
      }

      const data = await response.json()
      router.push(`/persona/${data.persona_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('business')
    } finally {
      setIsLoading(false)
    }
  }

  // Step indicator
  const steps = [
    { id: 'type', label: 'Type' },
    { id: 'business', label: 'Business' },
    ...(personaType === 'b2b_company' ? [{ id: 'details', label: 'Details' }] : []),
    { id: 'generating', label: 'Generate' },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === step)

  return (
    <div className="min-h-screen">
      {/* Glass Header */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-hartz-muted hover:text-hartz-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-body-sm">Back</span>
          </Link>
          <span className="text-lg font-bold tracking-tight text-hartz-black">PENELOPE</span>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-hartz-white border-b border-hartz-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-body-sm font-semibold transition-all
                  ${index <= currentStepIndex
                    ? 'bg-hartz-blue text-white'
                    : 'bg-hartz-black/5 text-hartz-muted'}
                `}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-body-sm hidden sm:inline ${
                  index <= currentStepIndex ? 'text-hartz-black' : 'text-hartz-muted'
                }`}>
                  {s.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-12 h-0.5 mx-3 transition-all ${
                    index < currentStepIndex ? 'bg-hartz-blue' : 'bg-hartz-black/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-body-sm">
              {error}
            </div>
          )}

          {/* Step 1: Select Type */}
          {step === 'type' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <span className="meta-label">STEP 1</span>
                <h1 className="text-display mt-4 text-hartz-black">
                  Choose Persona Type
                </h1>
                <p className="text-body text-hartz-muted mt-4">
                  Select based on whether you&apos;re targeting consumers or businesses
                </p>
              </div>

              <div className="grid gap-6">
                {/* B2C Option */}
                <button
                  onClick={() => handleTypeSelect('b2c_individual')}
                  className={`bento-card text-left transition-all ${
                    personaType === 'b2c_individual' ? 'border-hartz-blue shadow-bento-hover' : ''
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-hartz-blue/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-7 w-7 text-hartz-blue" />
                    </div>
                    <div>
                      <span className="meta-label text-hartz-blue">B2C</span>
                      <h3 className="text-heading text-hartz-black mt-1">Individual Persona</h3>
                      <p className="text-body-sm text-hartz-muted mt-2">
                        Create a detailed profile of your ideal customer. Perfect for consumer products,
                        services, and direct-to-consumer brands.
                      </p>
                    </div>
                  </div>
                </button>

                {/* B2B Option */}
                <button
                  onClick={() => handleTypeSelect('b2b_company')}
                  className={`bento-card text-left transition-all ${
                    personaType === 'b2b_company' ? 'border-hartz-blue shadow-bento-hover' : ''
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-hartz-black/5 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-7 w-7 text-hartz-black" />
                    </div>
                    <div>
                      <span className="meta-label">B2B</span>
                      <h3 className="text-heading text-hartz-black mt-1">Company Profile</h3>
                      <p className="text-body-sm text-hartz-muted mt-2">
                        Build an ideal company profile with linked buyer personas. Perfect for SaaS,
                        enterprise solutions, and B2B services.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Business Context */}
          {step === 'business' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <span className="meta-label">STEP 2</span>
                <h1 className="text-display mt-4 text-hartz-black">
                  Your Business
                </h1>
                <p className="text-body text-hartz-muted mt-4">
                  Help Penelope understand your context
                </p>
              </div>

              <Card className="p-8">
                <div className="space-y-6">
                  <Input
                    label="Business Name"
                    placeholder="e.g., Acme Software"
                    value={businessContext.business_name}
                    onChange={(e) => updateBusinessContext('business_name', e.target.value)}
                    required
                  />

                  <Textarea
                    label="What does your business do?"
                    placeholder="Describe your product or service in 1-2 sentences..."
                    value={businessContext.business_sector}
                    onChange={(e) => updateBusinessContext('business_sector', e.target.value)}
                    required
                    helpText="Be specific about what you sell and who it's for"
                  />

                  <Select
                    label="Price Point (vs. Competitors)"
                    options={PRICE_OPTIONS}
                    value={businessContext.price_point}
                    onChange={(value) => updateBusinessContext('price_point', value as 'higher' | 'lower' | 'similar')}
                    required
                  />

                  <Input
                    label="Primary Target Location"
                    placeholder="e.g., London, UK or United States"
                    value={businessContext.target_location}
                    onChange={(e) => updateBusinessContext('target_location', e.target.value)}
                    required
                  />

                  <Textarea
                    label="What problem does your business solve?"
                    placeholder="What pain point or need does your product/service address?"
                    value={businessContext.problem_solved}
                    onChange={(e) => updateBusinessContext('problem_solved', e.target.value)}
                    required
                  />

                  <Textarea
                    label="What makes you unique?"
                    placeholder="Your unique selling point - what sets you apart?"
                    value={businessContext.unique_selling_point}
                    onChange={(e) => updateBusinessContext('unique_selling_point', e.target.value)}
                    required
                  />
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleBusinessNext}>
                  {personaType === 'b2b_company' ? 'Continue' : 'Generate Persona'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: B2B Details */}
          {step === 'details' && personaType === 'b2b_company' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <span className="meta-label">STEP 3</span>
                <h1 className="text-display mt-4 text-hartz-black">
                  Target Company
                </h1>
                <p className="text-body text-hartz-muted mt-4">
                  Describe your ideal customer company
                </p>
              </div>

              <Card className="p-8">
                <div className="space-y-6">
                  <Input
                    label="Target Company Size"
                    placeholder="e.g., 50-200 employees, or Enterprise (1000+)"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    helpText="The typical size of companies you want to sell to"
                  />

                  <Input
                    label="Target Industry"
                    placeholder="e.g., Financial Services, Healthcare, SaaS"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    helpText="The industries you typically sell into"
                  />

                  <Textarea
                    label="Key Decision Makers"
                    placeholder="e.g., CTO, Head of Engineering, VP of Operations"
                    value={decisionMakers}
                    onChange={(e) => setDecisionMakers(e.target.value)}
                    helpText="Comma-separated list of roles involved in buying decisions"
                  />
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleGenerate}>
                  Generate Profile
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Generating */}
          {step === 'generating' && (
            <div className="text-center space-y-8 py-12 animate-fade-in">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-hartz-blue/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-12 w-12 text-hartz-blue" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-hartz-blue/30 animate-ping" />
              </div>

              <div>
                <h2 className="text-heading text-hartz-black mb-3">
                  Penelope is working...
                </h2>
                <p className="text-body text-hartz-muted">
                  Applying consumer psychology and behavioral analysis
                </p>
              </div>

              <div className="max-w-sm mx-auto space-y-3">
                {[
                  'Analyzing business context',
                  'Identifying psychographic patterns',
                  'Mapping emotional drivers',
                  'Generating insights',
                ].map((text, index) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-body-sm text-hartz-muted animate-fade-in"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-hartz-blue animate-pulse" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
