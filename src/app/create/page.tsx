'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Building2, Users, Sparkles } from 'lucide-react'
import { Button, Input, Textarea, Select, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import type { PersonaType, BusinessContext } from '@/types'

type WizardStep = 'type' | 'business' | 'details' | 'generating' | 'complete'

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
    // Validate required fields
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
      
      // Redirect to the persona page
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
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
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStepIndex ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-500'}
                `}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${index <= currentStepIndex ? 'text-slate-900' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${index < currentStepIndex ? 'bg-brand-blue' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Select Type */}
        {step === 'type' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                What type of persona do you want to create?
              </h1>
              <p className="text-slate-600">
                Choose based on whether you&apos;re targeting consumers or businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                hover 
                className={`cursor-pointer p-2 ${personaType === 'b2c_individual' ? 'ring-2 ring-brand-blue' : ''}`}
                onClick={() => handleTypeSelect('b2c_individual')}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-brand-blue" />
                  </div>
                  <CardTitle>B2C Individual Persona</CardTitle>
                  <CardDescription>
                    Create a detailed profile of your ideal customer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Perfect for consumer products, services, apps, and direct-to-consumer brands.
                  </p>
                </CardContent>
              </Card>

              <Card 
                hover 
                className={`cursor-pointer p-2 ${personaType === 'b2b_company' ? 'ring-2 ring-brand-orange' : ''}`}
                onClick={() => handleTypeSelect('b2b_company')}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-brand-orange" />
                  </div>
                  <CardTitle>B2B Company Profile</CardTitle>
                  <CardDescription>
                    Create an ideal company profile with buyer personas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Perfect for SaaS, enterprise solutions, agencies, and B2B services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Business Context */}
        {step === 'business' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Tell us about your business
              </h1>
              <p className="text-slate-600">
                This helps Penelope create a persona that&apos;s specific to your situation
              </p>
            </div>

            <Card className="p-6">
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
                  placeholder="Your unique selling point - what sets you apart from competitors?"
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

        {/* Step 3: B2B Details (only for B2B) */}
        {step === 'details' && personaType === 'b2b_company' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Tell us about your ideal company
              </h1>
              <p className="text-slate-600">
                This helps Penelope create a detailed company profile
              </p>
            </div>

            <Card className="p-6">
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
                  helpText="Comma-separated list of roles typically involved in buying decisions"
                />
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleGenerate}>
                Generate Company Profile
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Generating */}
        {step === 'generating' && (
          <div className="text-center space-y-8 py-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center animate-pulse-slow">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-brand-blue/30 animate-ping" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                🌐 Penelope is crafting your persona...
              </h2>
              <p className="text-slate-600">
                Applying consumer psychology, neuromarketing insights, and behavioral analysis
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-2">
              {[
                'Analyzing business context...',
                'Identifying psychographic patterns...',
                'Mapping emotional drivers...',
                'Generating deep insights...',
              ].map((text, index) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-slate-500 animate-fade-in"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
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
