import Link from 'next/link'
import { ArrowRight, Users, Building2, MessageCircle, FileText, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Glass Navigation */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-hartz-black">PENELOPE</span>
            <span className="text-body-sm text-hartz-muted">by Hartz AI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-body-sm text-hartz-muted hover:text-hartz-black transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-body-sm text-hartz-muted hover:text-hartz-black transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-body-sm text-hartz-muted hover:text-hartz-black transition-colors">
              Pricing
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/create">
              <Button size="sm">
                Create Persona
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8">
            {/* Meta Label */}
            <div className="inline-block">
              <span className="meta-label">AI-POWERED PERSONA CREATION</span>
            </div>

            {/* Headline */}
            <h1 className="text-display-xl md:text-[5.5rem] font-extrabold text-hartz-black leading-[0.9] tracking-[-0.05em]">
              Know Your
              <br />
              <span className="text-gradient">Audience</span>
            </h1>

            {/* Subheadline */}
            <p className="text-subheading text-hartz-muted max-w-2xl mx-auto font-normal leading-relaxed">
              Meet Penelope, your AI expert in customer persona creation.
              Dive deep into your audience&apos;s psychology to craft detailed personas
              that sharpen your marketing strategies.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/create">
                <Button size="xl">
                  Create Your First Persona Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="xl">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust Line */}
            <p className="text-body-sm text-hartz-muted">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Technical Hairline */}
      <div className="hairline" />

      {/* Persona Types - Bento Grid */}
      <section className="py-24 px-6" id="features">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="meta-label">PERSONA TYPES</span>
            <h2 className="text-display mt-4 text-hartz-black">
              Built for Any Business
            </h2>
          </div>

          {/* Bento Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* B2C Card */}
            <div className="bento-card group">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-hartz-blue/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-hartz-blue" />
                </div>
                <span className="meta-label text-hartz-blue">B2C</span>
              </div>

              <h3 className="text-heading text-hartz-black mb-3">
                Individual Personas
              </h3>
              <p className="text-body text-hartz-muted mb-8">
                Create detailed consumer profiles with psychological depth,
                emotional drivers, and buying journey insights.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Demographics & psychographics',
                  'MBTI & Enneagram analysis',
                  'Pain points & motivations',
                  'Deep psychological insights'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-body-sm text-hartz-muted">
                    <Check className="h-4 w-4 text-hartz-blue flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/create?type=b2c">
                <Button className="w-full">
                  Create B2C Persona
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* B2B Card */}
            <div className="bento-card group">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-hartz-black/5 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-hartz-black" />
                </div>
                <span className="meta-label">B2B</span>
              </div>

              <h3 className="text-heading text-hartz-black mb-3">
                Company Profiles
              </h3>
              <p className="text-body text-hartz-muted mb-8">
                Build ideal company profiles with linked decision-maker
                personas and buying process insights.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Ideal company profile (ICP)',
                  'Multiple buyer personas',
                  'Decision-maker analysis',
                  'Buying process mapping'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-body-sm text-hartz-muted">
                    <Check className="h-4 w-4 text-hartz-black flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/create?type=b2b">
                <Button variant="outline" className="w-full">
                  Create B2B Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Hairline */}
      <div className="hairline" />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="meta-label">PROCESS</span>
            <h2 className="text-display mt-4 text-hartz-black">
              How Penelope Works
            </h2>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Share Your Context',
                description: 'Tell us about your business, target market, and what makes you unique.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Penelope applies consumer psychology and neuromarketing principles.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Refine & Explore',
                description: 'Chat with Penelope to dive deeper into any aspect of your persona.',
                icon: MessageCircle,
              },
            ].map((item) => (
              <div key={item.step} className="bento-card text-center">
                <span className="text-display-lg text-hartz-blue/20 font-extrabold">
                  {item.step}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-hartz-blue/10 flex items-center justify-center mx-auto mt-4 mb-6">
                  <item.icon className="h-7 w-7 text-hartz-blue" />
                </div>
                <h3 className="text-subheading text-hartz-black mb-3">
                  {item.title}
                </h3>
                <p className="text-body-sm text-hartz-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Hairline */}
      <div className="hairline" />

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="meta-label">CAPABILITIES</span>
            <h2 className="text-display mt-4 text-hartz-black">
              What Makes Penelope Different
            </h2>
          </div>

          {/* Features Bento Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Psychological Depth',
                description: 'Goes beyond demographics to uncover fears, desires, and hidden contradictions.',
              },
              {
                title: 'Personality Analysis',
                description: 'MBTI & Enneagram typing to understand how personality influences buying.',
              },
              {
                title: 'Actionable Insights',
                description: 'Every insight is designed to be immediately useful for marketing and sales.',
              },
              {
                title: 'Chat Interface',
                description: 'Ask follow-up questions and explore any aspect of your persona in depth.',
              },
              {
                title: 'PDF Export',
                description: 'Download beautiful, shareable reports for your team or clients.',
              },
              {
                title: 'B2B & B2C',
                description: 'Create individual personas or complete company profiles with buyer maps.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bento-card">
                <h4 className="text-subheading text-hartz-black mb-2">
                  {feature.title}
                </h4>
                <p className="text-body-sm text-hartz-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-hartz-black">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="meta-label text-hartz-blue">GET STARTED</span>
          <h2 className="text-display mt-4 text-white mb-6">
            Ready to Understand Your Customers?
          </h2>
          <p className="text-subheading text-white/60 mb-10 font-normal">
            Create your first persona for free. No credit card required.
          </p>
          <Link href="/create">
            <Button size="xl">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-hartz-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tight text-hartz-black">PENELOPE</span>
              <span className="text-body-sm text-hartz-muted">by Hartz AI</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-body-sm text-hartz-muted">
              <Link href="/privacy" className="hover:text-hartz-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-hartz-black transition-colors">
                Terms
              </Link>
              <a href="https://hartzai.com" target="_blank" rel="noopener noreferrer" className="hover:text-hartz-black transition-colors">
                Hartz AI
              </a>
            </div>

            {/* Copyright */}
            <p className="text-body-sm text-hartz-muted">
              {new Date().getFullYear()} Hartz AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
