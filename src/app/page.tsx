import Link from 'next/link'
import { ArrowRight, Users, Building2, MessageCircle, FileText, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-semibold text-xl text-slate-900">Penelope</span>
            <span className="text-xs text-slate-500 ml-1">by Hartz AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/create">
              <Button size="sm">
                Create Persona
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Customer Personas
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Know Your Audience,<br />
              <span className="gradient-text">Upgrade Your Outputs</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meet Penelope, your AI expert in customer persona creation. 
              Dive deep into your audience&apos;s needs and motivations to craft 
              detailed personas that sharpen your marketing strategies.
            </p>
            
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
            
            <p className="text-sm text-slate-500">
              No credit card required • First persona is free
            </p>
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
