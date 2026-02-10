'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Keyboard,
  Sparkles,
  BarChart3,
  Megaphone,
  Rocket,
  Handshake,
  Brain,
  Zap,
  Lightbulb,
  Users,
  Check,
  ArrowRight
} from 'lucide-react'

// Intersection Observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Animated section wrapper
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (businessName && industry) {
      router.push(`/create?business=${encodeURIComponent(businessName)}&industry=${encodeURIComponent(industry)}`)
    }
  }

  return (
    <div className="min-h-screen bg-hartz-gray font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-hartz-blue flex items-center justify-center">
              <span className="text-white font-semibold text-sm tracking-tight">AI</span>
            </div>
            <span className="font-semibold text-lg text-hartz-black tracking-tight">HARTZ</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-hartz-muted hover:text-hartz-black transition-colors text-sm font-medium">
              How it Works
            </a>
            <a href="#use-cases" className="text-hartz-muted hover:text-hartz-black transition-colors text-sm font-medium">
              Use Cases
            </a>
            <a href="#pricing" className="text-hartz-muted hover:text-hartz-black transition-colors text-sm font-medium">
              Pricing
            </a>
            <Link
              href="/create"
              className="px-6 py-2.5 bg-hartz-blue text-white rounded-full font-medium text-sm hover:bg-hartz-blue/90 hover:shadow-bento-hover transition-all"
            >
              Try it Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-28 px-6 relative overflow-hidden">
        {/* Subtle Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-hartz-blue/[0.06] rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hartz-blue/[0.03] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Column - Copy & Form */}
            <AnimatedSection>
              <div className="mb-8">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue">
                  AI-Powered Persona Generation
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium text-hartz-black mb-8 leading-[1.15] tracking-tight">
                Know your customer{' '}
                <span className="text-hartz-blue">
                  better than they know themselves
                </span>
              </h1>

              <p className="text-xl text-hartz-muted mb-10 leading-relaxed">
                Create psychologically-nuanced customer personas in 60 seconds.
                Move beyond basic demographics to understand motivations, pain points,
                and what actually drives buying decisions.
              </p>

              {/* Inline Form */}
              <form onSubmit={handleSubmit} className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-bento p-7 border border-black/[0.08]">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="flex-1 px-5 py-3.5 bg-hartz-gray border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-hartz-blue/20 focus:border-hartz-blue transition-all text-hartz-black placeholder:text-hartz-muted/60"
                  />
                  <input
                    type="text"
                    placeholder="Industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="flex-1 px-5 py-3.5 bg-hartz-gray border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-hartz-blue/20 focus:border-hartz-blue transition-all text-hartz-black placeholder:text-hartz-muted/60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!businessName || !industry}
                  className="w-full mt-5 px-8 py-4 bg-hartz-blue text-white rounded-full font-semibold text-lg hover:bg-hartz-blue/90 hover:shadow-bento-hover hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                >
                  Create My First Persona — Free
                </button>
                <p className="text-center text-sm text-hartz-muted mt-4">
                  No credit card required &bull; Takes 60 seconds
                </p>
              </form>
            </AnimatedSection>

            {/* Right Column - Persona Visualization */}
            <AnimatedSection delay={200}>
              <div className="relative flex justify-center">
                {/* Persona Silhouette Card */}
                <div className="relative w-[320px]">
                  {/* Blue gradient silhouette shape */}
                  <div className="relative">
                    <div className="w-full h-[400px] bg-gradient-to-b from-hartz-blue to-hartz-blue/80 rounded-t-[160px] rounded-b-3xl relative overflow-hidden">
                      {/* Subtle inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10"></div>

                      {/* Persona content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="mb-4">
                          <h3 className="font-semibold text-xl mb-1">Sarah Chen, 34</h3>
                          <p className="text-white/70 text-sm">Brand Manager &bull; London</p>
                        </div>

                        {/* Traits */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                            Values authenticity
                          </span>
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                            Research-driven
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Circle border accents */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-hartz-blue/30"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full border-2 border-hartz-blue/20"></div>
                  </div>

                  {/* Floating insight box */}
                  <div className="absolute -right-8 top-1/3 bg-hartz-blue rounded-[18px] p-4 shadow-bento-lg max-w-[200px]">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 block mb-1">
                          Key Insight
                        </span>
                        <p className="text-white text-sm leading-snug">
                          &ldquo;Seeks tools that save time without sacrificing quality&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data indicator */}
                  <div className="absolute -left-6 bottom-20 bg-white/85 backdrop-blur-sm rounded-[14px] p-3 shadow-bento border border-black/[0.08]">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-hartz-blue" />
                      <div>
                        <p className="text-[10px] text-hartz-muted uppercase tracking-[0.15em]">Psychographics</p>
                        <p className="text-hartz-black font-semibold text-sm">85% analyzed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue block mb-4">
                The Process
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-hartz-black mb-5 tracking-tight">How It Works</h2>
              <p className="text-lg text-hartz-muted max-w-2xl mx-auto">
                From business context to deep customer insights in three simple steps
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <AnimatedSection delay={100}>
              <div className="relative group h-full">
                <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all h-full">
                  <div className="w-14 h-14 bg-hartz-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Keyboard className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue block mb-3">Step 01</span>
                  <h3 className="text-xl font-medium text-hartz-black mb-4">Input</h3>
                  <p className="text-hartz-muted leading-relaxed">
                    Describe your business in 30 seconds. Share your industry, target market, and what you&apos;re trying to achieve.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection delay={200}>
              <div className="relative group h-full">
                <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all h-full">
                  <div className="w-14 h-14 bg-hartz-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue block mb-3">Step 02</span>
                  <h3 className="text-xl font-medium text-hartz-black mb-4">AI Analysis</h3>
                  <p className="text-hartz-muted leading-relaxed">
                    Penelope synthesizes psychology, behavioral patterns, and market data to build a comprehensive understanding.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection delay={300}>
              <div className="relative group h-full">
                <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all h-full">
                  <div className="w-14 h-14 bg-hartz-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue block mb-3">Step 03</span>
                  <h3 className="text-xl font-medium text-hartz-black mb-4">Rich Persona</h3>
                  <p className="text-hartz-muted leading-relaxed">
                    Get actionable insights with messaging strategies, channel recommendations, and psychological triggers.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-28 px-6 bg-hartz-gray">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue block mb-4">
                Applications
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-hartz-black mb-5 tracking-tight">Built for Every Team</h2>
              <p className="text-lg text-hartz-muted max-w-2xl mx-auto">
                From marketing to sales to product&mdash;everyone benefits from deeper customer understanding
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Marketers */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-3xl p-8 shadow-bento border border-black/[0.08] hover:shadow-bento-hover transition-all h-full">
                <div className="w-12 h-12 bg-hartz-blue rounded-xl flex items-center justify-center mb-6">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-hartz-black mb-3">For Marketers</h3>
                <p className="text-hartz-muted mb-6 leading-relaxed">
                  Craft campaigns that actually resonate with your audience&apos;s deepest motivations and pain points.
                </p>

                <div className="bg-hartz-gray rounded-[18px] p-4 border border-black/[0.06]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-hartz-blue flex items-center justify-center text-white font-medium text-xs">SC</div>
                    <div>
                      <p className="font-medium text-sm text-hartz-black">Sarah Chen, 34</p>
                      <p className="text-xs text-hartz-muted">Brand Manager</p>
                    </div>
                  </div>
                  <p className="text-sm text-hartz-muted italic">&ldquo;Values authentic storytelling over hard sells...&rdquo;</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-hartz-blue">LinkedIn</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-hartz-blue">Video</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Founders */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-3xl p-8 shadow-bento border border-black/[0.08] hover:shadow-bento-hover transition-all h-full">
                <div className="w-12 h-12 bg-hartz-blue/80 rounded-xl flex items-center justify-center mb-6">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-hartz-black mb-3">For Founders</h3>
                <p className="text-hartz-muted mb-6 leading-relaxed">
                  Validate your ICP before you build. Understand who will actually pay for your solution and why.
                </p>

                <div className="bg-hartz-gray rounded-[18px] p-4 border border-black/[0.06]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-hartz-blue/80 flex items-center justify-center text-white font-medium text-xs">MJ</div>
                    <div>
                      <p className="font-medium text-sm text-hartz-black">Marcus Johnson, 29</p>
                      <p className="text-xs text-hartz-muted">Tech Founder</p>
                    </div>
                  </div>
                  <p className="text-sm text-hartz-muted italic">&ldquo;Seeks efficiency tools that integrate seamlessly...&rdquo;</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-hartz-blue">Product Hunt</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-hartz-blue">Twitter</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Sales */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-3xl p-8 shadow-bento border border-black/[0.08] hover:shadow-bento-hover transition-all h-full">
                <div className="w-12 h-12 bg-hartz-blue rounded-xl flex items-center justify-center mb-6">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-hartz-black mb-3">For Sales Teams</h3>
                <p className="text-hartz-muted mb-6 leading-relaxed">
                  Understand what your buyer really cares about. Map complex B2B buying committees with precision.
                </p>

                <div className="bg-hartz-gray rounded-[18px] p-4 border border-black/[0.06]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-hartz-blue flex items-center justify-center text-white font-medium text-xs">DP</div>
                    <div>
                      <p className="font-medium text-sm text-hartz-black">David Park, 42</p>
                      <p className="text-xs text-hartz-muted">VP of Sales</p>
                    </div>
                  </div>
                  <p className="text-sm text-hartz-muted italic">&ldquo;Decision-maker who values ROI and team consensus...&rdquo;</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-hartz-blue">Email</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-hartz-blue">Demos</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue block mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-hartz-black mb-5 tracking-tight">Why Penelope?</h2>
              <p className="text-lg text-hartz-muted max-w-2xl mx-auto">
                Go deeper than basic demographics with AI-powered psychological insights
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Value 1 */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-hartz-blue rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-hartz-black mb-3">AI-Powered Depth</h3>
                    <p className="text-hartz-muted leading-relaxed">
                      Move beyond age and location. Understand psychological drivers, decision-making patterns, and emotional triggers that influence buying behaviour.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Value 2 */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-hartz-blue rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-hartz-black mb-3">Speed & Simplicity</h3>
                    <p className="text-hartz-muted leading-relaxed">
                      Get detailed personas in 60 seconds, not 6 weeks. No lengthy surveys, no expensive research firms&mdash;just instant, actionable insights.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Value 3 */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-hartz-blue/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-hartz-black mb-3">Actionable Insights</h3>
                    <p className="text-hartz-muted leading-relaxed">
                      Don&apos;t just learn who they are&mdash;learn how to reach them. Get messaging frameworks, channel recommendations, and positioning strategies.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Value 4 */}
            <AnimatedSection delay={400}>
              <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-hartz-blue rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-hartz-black mb-3">B2B Buyer Mapping</h3>
                    <p className="text-hartz-muted leading-relaxed">
                      Map complex buying committees with multiple stakeholders. Understand how different decision-makers influence the purchase process.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-28 px-6 bg-hartz-gray">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-hartz-blue block mb-4">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-hartz-black mb-5 tracking-tight">Start Free, Scale as You Grow</h2>
              <p className="text-lg text-hartz-muted max-w-2xl mx-auto">
                Try Penelope with no commitment. Upgrade when you&apos;re ready for more.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-hartz-black mb-3">Free</h3>
                  <div className="text-5xl font-medium text-hartz-black mb-2 tracking-tight">&pound;0</div>
                  <p className="text-hartz-muted">Perfect for trying it out</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-hartz-blue mt-0.5 flex-shrink-0" />
                    <span className="text-hartz-muted">1 persona generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-hartz-blue mt-0.5 flex-shrink-0" />
                    <span className="text-hartz-muted">Preview mode access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-hartz-blue mt-0.5 flex-shrink-0" />
                    <span className="text-hartz-muted">Basic insights</span>
                  </li>
                </ul>
                <Link
                  href="/create"
                  className="block w-full px-6 py-3.5 border-2 border-hartz-blue/20 text-hartz-black rounded-full font-medium hover:bg-hartz-blue/5 transition-all text-center"
                >
                  Get Started
                </Link>
              </div>
            </AnimatedSection>

            {/* Pro Tier - Highlighted */}
            <AnimatedSection delay={200}>
              <div className="bg-hartz-blue rounded-3xl p-8 shadow-bento-lg transform md:scale-105 relative h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-hartz-black rounded-full shadow-sm">
                  <span className="text-white text-xs font-semibold tracking-wide">Most Popular</span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-white mb-3">Pro</h3>
                  <div className="text-5xl font-medium text-white mb-2 tracking-tight">&pound;49</div>
                  <p className="text-white/70">per month</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Unlimited personas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Full psychological insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Messaging strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">B2B buyer mapping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Export & share</span>
                  </li>
                </ul>
                <button className="w-full px-6 py-3.5 bg-white text-hartz-blue rounded-full font-semibold hover:bg-white/90 transition-all">
                  Start Free Trial
                </button>
              </div>
            </AnimatedSection>

            {/* Enterprise Tier */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-3xl p-8 border border-black/[0.08] shadow-bento hover:shadow-bento-hover transition-all h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-hartz-black mb-3">Enterprise</h3>
                  <div className="text-5xl font-medium text-hartz-black mb-2 tracking-tight">Custom</div>
                  <p className="text-hartz-muted">For larger teams</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-hartz-blue mt-0.5 flex-shrink-0" />
                    <span className="text-hartz-muted">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-hartz-blue mt-0.5 flex-shrink-0" />
                    <span className="text-hartz-muted">Team collaboration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-hartz-blue mt-0.5 flex-shrink-0" />
                    <span className="text-hartz-muted">Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-hartz-blue mt-0.5 flex-shrink-0" />
                    <span className="text-hartz-muted">Priority support</span>
                  </li>
                </ul>
                <button className="w-full px-6 py-3.5 border-2 border-hartz-blue text-hartz-blue rounded-full font-medium hover:bg-hartz-blue/5 transition-all">
                  Contact Sales
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 bg-gradient-to-br from-hartz-blue to-hartz-blue/80 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 border border-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 border border-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 block mb-6">
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6 tracking-tight">
              Ready to understand your customers?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Create your first persona in 60 seconds. No credit card required.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-hartz-blue rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Create My First Persona
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </AnimatedSection>
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
