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
  ArrowRight,
  Twitter,
  Linkedin,
  Github
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
    <div className="min-h-screen bg-light-bg font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-brand-teal/[0.08]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border-2 border-brand-teal flex items-center justify-center bg-white">
              <span className="text-brand-teal font-semibold text-sm tracking-tight">AI</span>
            </div>
            <span className="font-semibold text-lg text-brand-dark tracking-tight">HARTZ</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-gray-text hover:text-brand-teal transition-colors text-sm font-medium">
              How it Works
            </a>
            <a href="#use-cases" className="text-gray-text hover:text-brand-teal transition-colors text-sm font-medium">
              Use Cases
            </a>
            <a href="#pricing" className="text-gray-text hover:text-brand-teal transition-colors text-sm font-medium">
              Pricing
            </a>
            <Link
              href="/create"
              className="px-6 py-2.5 bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white rounded-full font-medium text-sm hover:shadow-glow-teal transition-all"
            >
              Try it Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-28 px-6 relative overflow-hidden">
        {/* Subtle Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/[0.06] rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-coral/[0.04] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Column - Copy & Form */}
            <AnimatedSection>
              <div className="mb-8">
                <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal">
                  AI-Powered Persona Generation
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium text-brand-dark mb-8 leading-[1.15] tracking-tight">
                Know your customer{' '}
                <span className="text-brand-teal">
                  better than they know themselves
                </span>
              </h1>

              <p className="text-xl text-gray-text mb-10 leading-relaxed font-serif">
                Create psychologically-nuanced customer personas in 60 seconds.
                Move beyond basic demographics to understand motivations, pain points,
                and what actually drives buying decisions.
              </p>

              {/* Inline Form */}
              <form onSubmit={handleSubmit} className="bg-white/85 backdrop-blur-sm rounded-[24px] shadow-soft p-7 border border-brand-teal/[0.1]">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="flex-1 px-5 py-3.5 bg-light-bg border border-brand-teal/[0.1] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-brand-dark placeholder:text-gray-text/60"
                  />
                  <input
                    type="text"
                    placeholder="Industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="flex-1 px-5 py-3.5 bg-light-bg border border-brand-teal/[0.1] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-brand-dark placeholder:text-gray-text/60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!businessName || !industry}
                  className="w-full mt-5 px-8 py-4 bg-gradient-to-r from-brand-coral to-brand-coral-dark text-white rounded-full font-semibold text-lg shadow-glow-coral hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                >
                  Create My First Persona — Free
                </button>
                <p className="text-center text-sm text-gray-text mt-4 font-serif">
                  No credit card required • Takes 60 seconds
                </p>
              </form>
            </AnimatedSection>

            {/* Right Column - Persona Visualization */}
            <AnimatedSection delay={200}>
              <div className="relative flex justify-center">
                {/* Persona Silhouette Card */}
                <div className="relative w-[320px]">
                  {/* Teal gradient silhouette shape */}
                  <div className="relative">
                    {/* Silhouette with rounded top */}
                    <div className="w-full h-[400px] bg-gradient-to-b from-brand-teal to-brand-teal-dark rounded-t-[160px] rounded-b-[24px] relative overflow-hidden">
                      {/* Subtle inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10"></div>

                      {/* Persona content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="mb-4">
                          <h3 className="font-semibold text-xl mb-1">Sarah Chen, 34</h3>
                          <p className="text-white/70 text-sm">Brand Manager • London</p>
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

                    {/* Teal circle border accent (like persona report) */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-brand-teal/30"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full border-2 border-brand-coral/20"></div>
                  </div>

                  {/* Floating insight box */}
                  <div className="absolute -right-8 top-1/3 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-[18px] p-4 shadow-soft-lg max-w-[200px]">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold tracking-[2px] uppercase text-white/70 block mb-1">
                          Key Insight
                        </span>
                        <p className="text-white text-sm leading-snug">
                          "Seeks tools that save time without sacrificing quality"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data indicator */}
                  <div className="absolute -left-6 bottom-20 bg-white/85 backdrop-blur-sm rounded-[14px] p-3 shadow-soft border border-brand-teal/[0.1]">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-brand-teal" />
                      <div>
                        <p className="text-[10px] text-gray-text uppercase tracking-wider">Psychographics</p>
                        <p className="text-brand-dark font-semibold text-sm">85% analyzed</p>
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
              <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal block mb-4">
                The Process
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-brand-dark mb-5 tracking-tight">How It Works</h2>
              <p className="text-lg text-gray-text font-serif max-w-2xl mx-auto">
                From business context to deep customer insights in three simple steps
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <AnimatedSection delay={100}>
              <div className="relative group h-full">
                <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Keyboard className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal block mb-3">Step 01</span>
                  <h3 className="text-xl font-medium text-brand-dark mb-4">Input</h3>
                  <p className="text-gray-text leading-relaxed font-serif">
                    Describe your business in 30 seconds. Share your industry, target market, and what you're trying to achieve.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection delay={200}>
              <div className="relative group h-full">
                <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal block mb-3">Step 02</span>
                  <h3 className="text-xl font-medium text-brand-dark mb-4">AI Analysis</h3>
                  <p className="text-gray-text leading-relaxed font-serif">
                    Penelope synthesizes psychology, behavioral patterns, and market data to build a comprehensive understanding.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection delay={300}>
              <div className="relative group h-full">
                <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal block mb-3">Step 03</span>
                  <h3 className="text-xl font-medium text-brand-dark mb-4">Rich Persona</h3>
                  <p className="text-gray-text leading-relaxed font-serif">
                    Get actionable insights with messaging strategies, channel recommendations, and psychological triggers.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-28 px-6 bg-light-bg">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal block mb-4">
                Applications
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-brand-dark mb-5 tracking-tight">Built for Every Team</h2>
              <p className="text-lg text-gray-text font-serif max-w-2xl mx-auto">
                From marketing to sales to product—everyone benefits from deeper customer understanding
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Marketers */}
            <AnimatedSection delay={100}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 shadow-soft border border-brand-teal/[0.1] hover:shadow-soft-lg transition-all h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-xl flex items-center justify-center mb-6">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-brand-dark mb-3">For Marketers</h3>
                <p className="text-gray-text mb-6 leading-relaxed font-serif">
                  Craft campaigns that actually resonate with your audience's deepest motivations and pain points.
                </p>

                <div className="bg-light-bg rounded-[18px] p-4 border border-brand-teal/[0.08]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center text-white font-medium text-xs">SC</div>
                    <div>
                      <p className="font-medium text-sm text-brand-dark">Sarah Chen, 34</p>
                      <p className="text-xs text-gray-text">Brand Manager</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-text italic font-serif">"Values authentic storytelling over hard sells..."</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-teal">LinkedIn</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-teal">Video</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Founders */}
            <AnimatedSection delay={200}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 shadow-soft border border-brand-teal/[0.1] hover:shadow-soft-lg transition-all h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-coral to-brand-coral-dark rounded-xl flex items-center justify-center mb-6">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-brand-dark mb-3">For Founders</h3>
                <p className="text-gray-text mb-6 leading-relaxed font-serif">
                  Validate your ICP before you build. Understand who will actually pay for your solution and why.
                </p>

                <div className="bg-light-bg rounded-[18px] p-4 border border-brand-coral/[0.08]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-brand-coral flex items-center justify-center text-white font-medium text-xs">MJ</div>
                    <div>
                      <p className="font-medium text-sm text-brand-dark">Marcus Johnson, 29</p>
                      <p className="text-xs text-gray-text">Tech Founder</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-text italic font-serif">"Seeks efficiency tools that integrate seamlessly..."</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-coral">Product Hunt</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-coral">Twitter</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Sales */}
            <AnimatedSection delay={300}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 shadow-soft border border-brand-teal/[0.1] hover:shadow-soft-lg transition-all h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-xl flex items-center justify-center mb-6">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-brand-dark mb-3">For Sales Teams</h3>
                <p className="text-gray-text mb-6 leading-relaxed font-serif">
                  Understand what your buyer really cares about. Map complex B2B buying committees with precision.
                </p>

                <div className="bg-light-bg rounded-[18px] p-4 border border-brand-teal/[0.08]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center text-white font-medium text-xs">DP</div>
                    <div>
                      <p className="font-medium text-sm text-brand-dark">David Park, 42</p>
                      <p className="text-xs text-gray-text">VP of Sales</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-text italic font-serif">"Decision-maker who values ROI and team consensus..."</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-teal">Email</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-teal">Demos</span>
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
              <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal block mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-brand-dark mb-5 tracking-tight">Why Penelope?</h2>
              <p className="text-lg text-gray-text font-serif max-w-2xl mx-auto">
                Go deeper than basic demographics with AI-powered psychological insights
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Value 1 */}
            <AnimatedSection delay={100}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-dark mb-3">AI-Powered Depth</h3>
                    <p className="text-gray-text leading-relaxed font-serif">
                      Move beyond age and location. Understand psychological drivers, decision-making patterns, and emotional triggers that influence buying behaviour.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Value 2 */}
            <AnimatedSection delay={200}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-dark mb-3">Speed & Simplicity</h3>
                    <p className="text-gray-text leading-relaxed font-serif">
                      Get detailed personas in 60 seconds, not 6 weeks. No lengthy surveys, no expensive research firms—just instant, actionable insights.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Value 3 */}
            <AnimatedSection delay={300}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-coral to-brand-coral-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-dark mb-3">Actionable Insights</h3>
                    <p className="text-gray-text leading-relaxed font-serif">
                      Don't just learn who they are—learn how to reach them. Get messaging frameworks, channel recommendations, and positioning strategies.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Value 4 */}
            <AnimatedSection delay={400}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-dark mb-3">B2B Buyer Mapping</h3>
                    <p className="text-gray-text leading-relaxed font-serif">
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
      <section id="pricing" className="py-28 px-6 bg-light-bg">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="text-[11px] font-semibold tracking-[3px] uppercase text-brand-teal block mb-4">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-brand-dark mb-5 tracking-tight">Start Free, Scale as You Grow</h2>
              <p className="text-lg text-gray-text font-serif max-w-2xl mx-auto">
                Try Penelope with no commitment. Upgrade when you're ready for more.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <AnimatedSection delay={100}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-brand-dark mb-3">Free</h3>
                  <div className="text-5xl font-medium text-brand-dark mb-2 tracking-tight">£0</div>
                  <p className="text-gray-text font-serif">Perfect for trying it out</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-text font-serif">1 persona generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-text font-serif">Preview mode access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-text font-serif">Basic insights</span>
                  </li>
                </ul>
                <Link
                  href="/create"
                  className="block w-full px-6 py-3.5 border-2 border-brand-teal/20 text-brand-dark rounded-full font-medium hover:bg-brand-teal/5 transition-all text-center"
                >
                  Get Started
                </Link>
              </div>
            </AnimatedSection>

            {/* Pro Tier - Highlighted */}
            <AnimatedSection delay={200}>
              <div className="bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-[24px] p-8 shadow-glow-teal transform md:scale-105 relative h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-brand-coral rounded-full shadow-sm">
                  <span className="text-white text-xs font-semibold tracking-wide">Most Popular</span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-white mb-3">Pro</h3>
                  <div className="text-5xl font-medium text-white mb-2 tracking-tight">£49</div>
                  <p className="text-white/70 font-serif">per month</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 font-serif">Unlimited personas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 font-serif">Full psychological insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 font-serif">Messaging strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 font-serif">B2B buyer mapping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 font-serif">Export & share</span>
                  </li>
                </ul>
                <button className="w-full px-6 py-3.5 bg-white text-brand-teal rounded-full font-semibold hover:bg-white/90 transition-all">
                  Start Free Trial
                </button>
              </div>
            </AnimatedSection>

            {/* Enterprise Tier */}
            <AnimatedSection delay={300}>
              <div className="bg-white/85 backdrop-blur-sm rounded-[24px] p-8 border border-brand-teal/[0.1] shadow-soft hover:shadow-soft-lg transition-all h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-brand-dark mb-3">Enterprise</h3>
                  <div className="text-5xl font-medium text-brand-dark mb-2 tracking-tight">Custom</div>
                  <p className="text-gray-text font-serif">For larger teams</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-text font-serif">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-text font-serif">Team collaboration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-text font-serif">Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-text font-serif">Priority support</span>
                  </li>
                </ul>
                <button className="w-full px-6 py-3.5 border-2 border-brand-teal text-brand-teal rounded-full font-medium hover:bg-brand-teal/5 transition-all">
                  Contact Sales
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 bg-gradient-to-br from-brand-teal to-brand-teal-dark relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 border border-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 border border-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/70 block mb-6">
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6 tracking-tight">
              Ready to understand your customers?
            </h2>
            <p className="text-xl text-white/80 mb-10 font-serif max-w-2xl mx-auto">
              Create your first persona in 60 seconds. No credit card required.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-teal rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Create My First Persona
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-brand-dark to-brand-dark-lighter text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border-2 border-brand-teal flex items-center justify-center">
                  <span className="text-brand-teal font-semibold text-xs">AI</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">HARTZ</span>
              </div>
              <p className="text-gray-text text-sm leading-relaxed font-serif">
                AI-powered customer personas that go beyond demographics to reveal the psychology behind buying decisions.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-sm tracking-wide uppercase text-white/70 mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#how-it-works" className="text-gray-text hover:text-white transition-colors text-sm">How it Works</a></li>
                <li><a href="#use-cases" className="text-gray-text hover:text-white transition-colors text-sm">Use Cases</a></li>
                <li><a href="#pricing" className="text-gray-text hover:text-white transition-colors text-sm">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm tracking-wide uppercase text-white/70 mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="https://hartzai.com" target="_blank" rel="noopener noreferrer" className="text-gray-text hover:text-white transition-colors text-sm">About Hartz AI</a></li>
                <li><a href="#" className="text-gray-text hover:text-white transition-colors text-sm">Contact</a></li>
                <li><a href="#" className="text-gray-text hover:text-white transition-colors text-sm">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm tracking-wide uppercase text-white/70 mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-text hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-text hover:text-white transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-text text-sm">© 2025 Hartz AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-text hover:text-brand-teal transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-text hover:text-brand-teal transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-text hover:text-brand-teal transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
