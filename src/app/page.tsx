'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Users, Building2, MessageCircle, FileText, Sparkles, CheckCircle2, Star, TrendingUp, Clock, Brain, Heart, FlaskConical, BookOpen, ShieldCheck, Microscope } from 'lucide-react'

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
                Not a generic chatbot. Penelope is a specialist AI trained on peer-reviewed neuroscience, behavioural psychology, and consumer research to create personas with real scientific depth.
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

      {/* Science-Backed Section */}
      <section className="py-20 px-4 bg-hartz-gray">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-hartz-blue block mb-3">
              Beyond Generic AI
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-hartz-black mb-4">
              This isn&apos;t ChatGPT with a persona prompt
            </h2>
            <p className="text-lg text-hartz-muted max-w-3xl mx-auto">
              Anyone can ask ChatGPT to &ldquo;create a buyer persona.&rdquo; You&apos;ll get a flat, generic profile that could apply to any business. Penelope is fundamentally different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* What ChatGPT gives you */}
            <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-hartz-muted" />
                </div>
                <h3 className="text-lg font-semibold text-hartz-muted">Generic AI chatbot</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Surface-level demographics (age, location, job title)',
                  'Generic pain points anyone could guess',
                  'No scientific methodology behind the output',
                  'Same template regardless of industry',
                  'No understanding of cognitive biases or decision science',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-hartz-muted">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Penelope gives you */}
            <div className="bg-white rounded-3xl p-8 border-2 border-hartz-blue/20 shadow-bento relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-hartz-blue/[0.04] rounded-full blur-[60px]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-hartz-blue/10 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-hartz-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-hartz-black">Penelope</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Trained on peer-reviewed neuroscience and behavioural psychology',
                    'Applies Kahneman\'s dual-process theory, loss aversion, and cognitive bias frameworks',
                    'Uses academic consumer behaviour models (not marketing fluff)',
                    'MBTI, Enneagram, and psychographic profiling grounded in research',
                    'Generates messaging strategies based on proven persuasion science',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-hartz-blue flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-hartz-black">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Research foundations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Microscope, label: 'Neuroscience', desc: 'How the brain makes buying decisions' },
              { icon: Brain, label: 'Behavioural Psychology', desc: 'Cognitive biases and decision heuristics' },
              { icon: BookOpen, label: 'Academic Journals', desc: 'Peer-reviewed consumer research' },
              { icon: ShieldCheck, label: 'Proven Frameworks', desc: 'MBTI, Enneagram, Big Five validated models' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-black/[0.08] shadow-bento text-center">
                <div className="w-10 h-10 rounded-xl bg-hartz-blue/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-hartz-blue" />
                </div>
                <h4 className="text-sm font-semibold text-hartz-black mb-1">{item.label}</h4>
                <p className="text-xs text-hartz-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
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
                title: 'Penelope Analyses the Science',
                description: 'Drawing on neuroscience research, behavioural psychology, and consumer decision science to build a multi-dimensional persona.',
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
      <section id="use-cases" className="py-16 px-4 bg-hartz-gray">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-hartz-blue block mb-3">
              Research-Driven Features
            </span>
            <h2 className="text-3xl font-bold text-hartz-black mb-4">
              Every Feature Backed by Science
            </h2>
            <p className="text-lg text-hartz-muted">
              Not opinions. Not guesses. Insights grounded in published research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Cognitive Bias Mapping',
                description: 'Identifies which of Kahneman\'s cognitive biases your customer is most susceptible to, so you can frame your offer accordingly.',
              },
              {
                title: 'MBTI & Enneagram Profiling',
                description: 'Validated personality frameworks applied to your specific customer, revealing how they process information and make decisions.',
              },
              {
                title: 'Neuroscience-Based Messaging',
                description: 'Generates copy angles based on how the brain actually responds to persuasion\u2014not marketing hunches.',
              },
              {
                title: 'Conversational Deep-Dives',
                description: 'Chat with Penelope to explore any dimension of your persona. Ask "why do they hesitate?" and get a science-backed answer.',
              },
              {
                title: 'Professional PDF Reports',
                description: 'Export comprehensive persona documents your entire team can use\u2014from strategy to creative to sales.',
              },
              {
                title: 'B2B Buying Committee Maps',
                description: 'Model complex B2B decisions with multiple stakeholders, each with their own psychological profile and influence dynamics.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-3xl p-6 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all duration-300">
                <h3 className="text-lg font-semibold text-hartz-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-hartz-muted text-sm leading-relaxed">
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
      <footer className="bg-hartz-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Logo & Contact Column */}
            <div className="col-span-2">
              <a href="https://hartzai.com" target="_blank" rel="noopener noreferrer" className="inline-block mb-6">
                <img
                  src="/images/hartz-ai-logo-white.webp"
                  alt="Hartz AI"
                  className="h-24 w-auto"
                />
              </a>
              <p className="text-sm text-white/60 mb-6 max-w-xs">
                Helping UK SMEs build confidence, clarity and capability with AI.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:hello@hartzai.com"
                  className="block text-white/80 hover:text-hartz-blue transition-colors"
                >
                  hello@hartzai.com
                </a>
                <a
                  href="tel:+44(0)7957855638"
                  className="block text-white/80 hover:text-hartz-blue transition-colors"
                >
                  +44 (0) 7957 855 638
                </a>
                <p className="text-white/60 text-xs mt-4">
                  Wohl Enterprise Hub, 2b Redbourne Avenue, London N3 2BS
                </p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="https://hartzai.com/ai-training" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">AI Training & Academy</a></li>
                <li><a href="https://hartzai.com/ai-consultancy-services" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">AI Consultancy</a></li>
                <li><a href="https://hartzai.com/ai-implementation" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">AI Implementation</a></li>
                <li><a href="https://hartzai.com/ai-governance-risk-services" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">AI Governance</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="https://hartzai.com/resources/templates" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">Templates</a></li>
                <li><a href="https://hartzai.com/case-studies" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">Case Studies</a></li>
                <li><a href="https://hartzai.com/resources/webinars" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">Webinars</a></li>
                <li><a href="https://hartzai.com/blog" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">Articles</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="https://hartzai.com/about/team" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">About Hartz AI</a></li>
                <li><a href="https://hartzai.com/contact" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="https://hartzai.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-hartz-blue transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Hartz AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
