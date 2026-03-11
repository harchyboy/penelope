'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { useAuth } from '@/components/providers/auth-provider'
import Link from 'next/link'
import { Suspense } from 'react'

function PricingContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')
  const personaId = searchParams.get('persona_id')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (plan: 'one_time' | 'monthly') => {
    if (!isAuthenticated) return

    setLoadingPlan(plan)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, personaId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned:', data.error)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Cancelled banner */}
        {cancelled && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-center">
            Checkout was cancelled. You can try again whenever you&apos;re ready.
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 rounded-full text-brand-blue text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Unlock the full power of Penelope
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every user gets one free persona unlock. After that, choose the plan
            that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Tier */}
          <Card className="p-8 relative">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Free</h3>
              <p className="text-slate-600 mt-1">Try Penelope out</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">£0</span>
            </div>

            <ul className="space-y-3 mb-8">
              <PricingFeature>1 free persona unlock</PricingFeature>
              <PricingFeature>Basic persona insights</PricingFeature>
              <PricingFeature>B2C and B2B support</PricingFeature>
              <PricingFeature>Chat with Penelope</PricingFeature>
            </ul>

            <Link href="/create">
              <Button variant="outline" className="w-full">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* One-Time */}
          <Card className="p-8 relative">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Single Unlock</h3>
              <p className="text-slate-600 mt-1">Pay per persona</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">£9</span>
              <span className="text-slate-500 ml-1">/ persona</span>
            </div>

            <ul className="space-y-3 mb-8">
              <PricingFeature>Full persona insights</PricingFeature>
              <PricingFeature>Deep psychological analysis</PricingFeature>
              <PricingFeature>PDF export</PricingFeature>
              <PricingFeature>Chat with Penelope</PricingFeature>
            </ul>

            {isAuthenticated ? (
              <Button
                className="w-full"
                onClick={() => handleCheckout('one_time')}
                isLoading={loadingPlan === 'one_time'}
                disabled={!!loadingPlan}
              >
                Buy Single Unlock
              </Button>
            ) : (
              <Link href="/register?redirect=/pricing">
                <Button className="w-full">
                  Register to Buy
                </Button>
              </Link>
            )}
          </Card>

          {/* Monthly */}
          <Card className="p-8 relative ring-2 ring-brand-blue">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-brand-blue text-white text-sm font-medium rounded-full">
                Best Value
              </span>
            </div>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Penelope Pro</h3>
              <p className="text-slate-600 mt-1">Unlimited access</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">£29</span>
              <span className="text-slate-500 ml-1">/ month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <PricingFeature>Unlimited personas</PricingFeature>
              <PricingFeature>All insights unlocked</PricingFeature>
              <PricingFeature>Deep psychological analysis</PricingFeature>
              <PricingFeature>PDF export</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
              <PricingFeature>Chat with Penelope</PricingFeature>
            </ul>

            {isAuthenticated ? (
              <Button
                className="w-full"
                onClick={() => handleCheckout('monthly')}
                isLoading={loadingPlan === 'monthly'}
                disabled={!!loadingPlan}
              >
                Subscribe Now
              </Button>
            ) : (
              <Link href="/register?redirect=/pricing">
                <Button className="w-full">
                  Register to Subscribe
                </Button>
              </Link>
            )}
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <FaqItem
              question="What do I get with the free unlock?"
              answer="Every new user gets one free persona unlock. This gives you full access to one persona's insights — motivations, psychographic traits, buying journey, and more. Deep psychological analysis requires a paid plan."
            />
            <FaqItem
              question="What's the difference between Single Unlock and Pro?"
              answer="Single Unlock is a one-time payment that unlocks one specific persona. Pro gives you unlimited persona generation and unlocks for a monthly fee — ideal if you're building personas for multiple products or clients."
            />
            <FaqItem
              question="Can I cancel my Pro subscription?"
              answer="Yes, you can cancel anytime from your account dashboard. You'll keep access until the end of your billing period."
            />
            <FaqItem
              question="Do I lose my personas if I cancel?"
              answer="No. Your generated personas are always saved. You just won't be able to unlock new ones or generate more until you resubscribe."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm text-slate-600">
      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
      {children}
    </li>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-slate-200 pb-6">
      <h3 className="font-semibold text-slate-900 mb-2">{question}</h3>
      <p className="text-slate-600 text-sm">{answer}</p>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
