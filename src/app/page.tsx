'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Users, Building2, MessageCircle, FileText, Sparkles, CheckCircle2, Star, TrendingUp, Clock, Brain, Heart } from 'lucide-react'

interface PersonaVisualizationProps {
  isAnimated: boolean
}

function PersonaVisualization({ isAnimated }: PersonaVisualizationProps) {
  const traits = [
    { label: 'Values authenticity', icon: Star, color: 'bg-hartz-blue/10 text-hartz-blue' },
    { label: 'Research-driven', icon: TrendingUp, color: 'bg-hartz-blue/10 text-hartz-blue' },
    { label: 'Time-conscious', icon: Clock, color: 'bg-hartz-blue/15 text-hartz-blue' },
    { label: 'Collaborative mindset', icon: Users, color: 'bg-hartz-blue/10 text-hartz-blue' },
  ]

  return (
    <div
      className="absolute inset-0 bg-white backdrop-blur-sm shadow-bento-lg border border-black/[0.08] p-8 overflow-hidden"
      style={{ borderRadius: '32px' }}
    >
      {/* Background silhouette */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-72 opacity-[0.03]"
        viewBox="0 0 200 300"
      >
        <defs>
          <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="100%" stopColor="#4A90E2" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="60" rx="35" ry="40" fill="url(#avatarGradient)"/>
        <path d="M 65 100 Q 65 95 70 95 L 130 95 Q 135 95 135 100 L 145 180 Q 145 200 140 220 L 130 280 Q 130 290 120 290 L 80 290 Q 70 290 70 280 L 60 220 Q 55 200 55 180 Z" fill="url(#avatarGradient)"/>
      </svg>

      <div className="relative z-10">
        {/* Header with avatar */}
        <div
          className={`flex items-center gap-4 mb-6 transition-all duration-500 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-hartz-blue/20 bg-gradient-to-br from-hartz-blue to-hartz-blue/80 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">SC</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-xl text-hartz-black mb-1">Sarah Chen</div>
            <div className="text-sm text-hartz-muted">34 &bull; Brand Manager at Tech Startup</div>
          </div>
        </div>

        {/* Quote */}
        <div
          className={`mb-6 p-4 bg-hartz-blue/[0.04] rounded-xl border border-hartz-blue/10 transition-all duration-500 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <span className="text-hartz-blue/30 text-2xl leading-none">&ldquo;</span>
          <p className="text-sm text-hartz-black italic leading-relaxed -mt-2 pl-4">
            I need marketing tools that deliver real insights without the learning curve. Time is my most valuable resource.
          </p>
        </div>

        {/* Traits */}
        <div className="space-y-2 mb-6">
          {traits.map((trait, index) => (
            <div
              key={trait.label}
              className={`inline-flex items-center gap-1.5 mr-2 transition-all duration-500 ${
                isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${trait.color}`}>
                <trait.icon className="w-3 h-3" />
                {trait.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div
          className={`space-y-3 transition-all duration-500 ${
            isAnimated ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hartz-blue flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-hartz-black">Analytical</span>
                <span className="text-xs text-hartz-muted">85%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-hartz-blue rounded-full transition-all duration-700 ease-out"
                  style={{ width: isAnimated ? '85%' : '0%', transitionDelay: '1000ms' }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hartz-blue/70 flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-hartz-black">Empathetic</span>
                <span className="text-xs text-hartz-muted">78%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-hartz-blue/70 rounded-full transition-all duration-700 ease-out"
                  style={{ width: isAnimated ? '78%' : '0%', transitionDelay: '1200ms' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blur */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-hartz-blue rounded-full opacity-10 blur-2xl" />
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [isAnimated, setIsAnimated] = useState(false)

  // Trigger animations after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (businessName) params.set('business_name', businessName)
    if (industry) params.set('industry', industry)
    router.push(`/create?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 min-h-[600px] overflow-hidden bg-hartz-gray">
        {/* Background glow */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-hartz-blue/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-hartz-blue/[0.04] rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column: The Proposition */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-hartz-blue">
                  AI-Powered Persona Generation
                </span>
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-hartz-black leading-tight"
                style={{ letterSpacing: '-0.03em' }}
              >
                Finally understand{' '}
                <span className="text-hartz-blue">who you&apos;re really selling to</span>
              </h1>

              <p className="text-lg lg:text-xl text-hartz-muted leading-relaxed">
                No more guessing. No more generic profiles. Create psychologically-nuanced customer personas in 60 seconds that actually help you sell.
              </p>

              {/* Inline Form Card */}
              <div className="bg-white rounded-3xl shadow-bento p-6 border border-black/[0.08]">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="flex-1 px-4 py-3 border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-hartz-blue/30 focus:border-hartz-blue bg-hartz-gray text-hartz-black placeholder:text-hartz-muted/60"
                    />
                    <input
                      type="text"
                      placeholder="Industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="flex-1 px-4 py-3 border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-hartz-blue/30 focus:border-hartz-blue bg-hartz-gray text-hartz-black placeholder:text-hartz-muted/60"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-4 px-8 py-4 bg-hartz-blue text-white rounded-full font-semibold text-lg hover:bg-hartz-blue/90 hover:shadow-bento-hover hover:scale-[1.01] transition-all duration-200"
                  >
                    Create My First Persona — Free
                  </button>
                </form>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-2">
                  <p className="text-sm text-hartz-muted">No credit card required &bull; Takes 60 seconds</p>
                  <a
                    href="#example-persona"
                    className="text-sm text-hartz-blue font-semibold hover:text-hartz-blue/80 transition-colors"
                  >
                    See an example first &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Persona Card */}
            <div className="relative h-[480px] lg:h-[520px]">
              <PersonaVisualization isAnimated={isAnimated} />
            </div>
          </div>
        </div>
      </section>

      {/* Persona Types Section */}
      <section id="example-persona" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-hartz-blue block mb-3">
              Persona Types
            </span>
            <h2 className="text-3xl font-bold text-hartz-black mb-4">
              Create Personas for Any Business
            </h2>
            <p className="text-lg text-hartz-muted">
              Whether B2C or B2B, Penelope helps you understand who you&apos;re really talking to
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-hartz-blue/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-hartz-blue" />
              </div>
              <h3 className="text-xl font-semibold text-hartz-black mb-2">B2C Buyer Personas</h3>
              <p className="text-hartz-muted mb-6">Create detailed individual customer profiles</p>
              <ul className="space-y-3 mb-6">
                {[
                  'Demographics & psychographics',
                  'Emotional & cultural drivers',
                  'Pain points & motivations',
                  'Buying journey mapping',
                  'MBTI & Enneagram analysis',
                  'Deep psychological insights'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-hartz-blue flex-shrink-0 mt-0.5" />
                    <span className="text-hartz-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/create?type=b2c"
                className="block w-full px-6 py-3.5 bg-hartz-blue text-white rounded-full font-semibold text-center hover:bg-hartz-blue/90 transition-all"
              >
                Create B2C Persona
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-hartz-blue/10 flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-hartz-blue" />
              </div>
              <h3 className="text-xl font-semibold text-hartz-black mb-2">B2B Company & Buyer Profiles</h3>
              <p className="text-hartz-muted mb-6">Create company profiles with linked decision-makers</p>
              <ul className="space-y-3 mb-6">
                {[
                  'Ideal company profile (ICP)',
                  'Company culture & challenges',
                  'Buying process & stakeholders',
                  'Multiple buyer personas per company',
                  'Decision-maker analysis',
                  'Strategic priorities & goals'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-hartz-blue flex-shrink-0 mt-0.5" />
                    <span className="text-hartz-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/create?type=b2b"
                className="block w-full px-6 py-3.5 bg-hartz-black text-white rounded-full font-semibold text-center hover:bg-hartz-black/90 transition-all"
              >
                Create B2B Profile
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-hartz-gray">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-hartz-blue block mb-3">
              The Process
            </span>
            <h2 className="text-3xl font-bold text-hartz-black mb-4">
              How Penelope Works
            </h2>
            <p className="text-lg text-hartz-muted">
              Three simple steps to deeply understand your customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tell Us About Your Business',
                description: 'Share your business name, sector, pricing, target location, and what makes you unique.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'Penelope Creates Your Persona',
                description: 'Using advanced AI and consumer psychology, Penelope crafts a detailed, multi-dimensional persona.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Chat & Refine',
                description: 'Ask Penelope questions, dive deeper into insights, and refine your understanding.',
                icon: MessageCircle,
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all duration-300 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-hartz-blue/10 flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-hartz-blue" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-hartz-blue text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-hartz-black mb-2">
                  {item.title}
                </h3>
                <p className="text-hartz-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="use-cases" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-hartz-blue block mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl font-bold text-hartz-black mb-4">
              What Makes Penelope Different
            </h2>
            <p className="text-lg text-hartz-muted">
              Powered by neuromarketing, consumer psychology, and advanced AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Psychological Depth',
                description: 'Goes beyond demographics to uncover fears, desires, and hidden contradictions.',
              },
              {
                title: 'MBTI & Enneagram Analysis',
                description: 'Understand personality types and how they influence buying behavior.',
              },
              {
                title: 'Actionable Insights',
                description: 'Every insight is designed to be immediately useful for marketing and sales.',
              },
              {
                title: 'Chat with Penelope',
                description: 'Ask follow-up questions and dive deeper into any aspect of your persona.',
              },
              {
                title: 'Professional PDF Export',
                description: 'Download beautiful, shareable PDF reports for your team or clients.',
              },
              {
                title: 'B2B & B2C Support',
                description: 'Create individual personas or complete company profiles with buyer maps.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-3xl p-6 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all duration-300">
                <h3 className="text-lg font-semibold text-hartz-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-hartz-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-hartz-blue to-hartz-blue/80 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 border border-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 border border-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 block mb-4">
            Get Started Today
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Truly Understand Your Customers?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Create your first persona for free. No credit card required.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-hartz-blue rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-hartz-black">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-hartz-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-white">Penelope</span>
              <span className="text-xs text-hartz-muted ml-1">by Hartz AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-hartz-muted">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <a href="https://hartzai.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Hartz AI
              </a>
            </div>
            <p className="text-sm text-hartz-muted">
              &copy; {new Date().getFullYear()} Hartz AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
