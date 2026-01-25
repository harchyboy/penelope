import Link from 'next/link'
import { ArrowRight, Users, Building2, MessageCircle, FileText, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

function PersonaPreviewCard() {
  return (
    <div
      className="bg-white border border-slate-200 p-8 w-full max-w-md"
      style={{ borderRadius: '40px' }}
    >
      {/* Avatar - Vector line art placeholder */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
        <svg className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </div>

      {/* Label */}
      <p
        className="text-center font-bold text-slate-900 mb-1"
        style={{ letterSpacing: '0.3em', fontSize: '0.75rem' }}
      >
        SARAH CHEN, 34
      </p>

      {/* Role */}
      <p
        className="text-center font-bold text-slate-500 mb-6"
        style={{ letterSpacing: '0.3em', fontSize: '0.65rem' }}
      >
        BRAND MANAGER
      </p>

      {/* Quote */}
      <p className="text-center text-slate-600 italic mb-8 text-sm">
        &quot;I need data that justifies our creative direction without the jargon.&quot;
      </p>

      {/* Progress Bars */}
      <div className="space-y-4">
        {[
          { label: 'DEPTH', value: 92 },
          { label: 'ACTIONABILITY', value: 88 },
          { label: 'ACCURACY', value: 95 },
        ].map((bar) => (
          <div key={bar.label}>
            <div className="flex justify-between mb-1">
              <span
                className="text-xs font-medium text-slate-500"
                style={{ letterSpacing: '0.1em' }}
              >
                {bar.label}
              </span>
              <span className="text-xs text-slate-400">{bar.value}%</span>
            </div>
            <div className="h-px bg-slate-200 relative">
              <div
                className="absolute h-px bg-brand-blue"
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 noise-overlay">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Column: The Proposition */}
            <div className="space-y-8">
              <h1
                className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight"
                style={{ letterSpacing: '-0.05em' }}
              >
                Know your customer better than they know themselves.
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Stop guessing. Generate deep, data-driven customer personas in 60 seconds.
                We provide clarity over hype, helping you map your audience with scientific precision.
              </p>

              {/* Inline Form */}
              <form
                className="flex flex-col sm:flex-row gap-3"
                action="/create"
                method="GET"
              >
                <Input
                  name="business_name"
                  placeholder="Business Name"
                  className="flex-1"
                  required
                />
                <Input
                  name="industry"
                  placeholder="Industry"
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  className="whitespace-nowrap"
                >
                  CREATE MY FIRST PERSONA — FREE
                </Button>
              </form>

              <p className="text-sm text-slate-500">
                No credit card required
              </p>
            </div>

            {/* Right Column: Persona Preview Card */}
            <div className="flex justify-center lg:justify-end">
              <PersonaPreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* Persona Types Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Create Personas for Any Business
            </h2>
            <p className="text-lg text-slate-600">
              Whether B2C or B2B, Penelope helps you understand who you&apos;re really talking to
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card hover className="p-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-brand-blue" />
                </div>
                <CardTitle>B2C Buyer Personas</CardTitle>
                <CardDescription>
                  Create detailed individual customer profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Demographics & psychographics',
                    'Emotional & cultural drivers',
                    'Pain points & motivations',
                    'Buying journey mapping',
                    'MBTI & Enneagram analysis',
                    'Deep psychological insights'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/create?type=b2c" className="mt-6 block">
                  <Button className="w-full">
                    Create B2C Persona
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card hover className="p-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-brand-orange" />
                </div>
                <CardTitle>B2B Company & Buyer Profiles</CardTitle>
                <CardDescription>
                  Create company profiles with linked decision-makers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Ideal company profile (ICP)',
                    'Company culture & challenges',
                    'Buying process & stakeholders',
                    'Multiple buyer personas per company',
                    'Decision-maker analysis',
                    'Strategic priorities & goals'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/create?type=b2b" className="mt-6 block">
                  <Button variant="accent" className="w-full">
                    Create B2B Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How Penelope Works
            </h2>
            <p className="text-lg text-slate-600">
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
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-brand-blue" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-orange text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What Makes Penelope Different
            </h2>
            <p className="text-lg text-slate-600">
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
              <Card key={feature.title} className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-blue to-brand-blue/80">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Truly Understand Your Customers?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Create your first persona for free. No credit card required.
          </p>
          <Link href="/create">
            <Button size="xl" variant="accent">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-white">Penelope</span>
              <span className="text-xs text-slate-400 ml-1">by Hartz AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
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
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Hartz AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
