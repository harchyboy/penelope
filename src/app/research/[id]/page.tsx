'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Users,
  Building2,
  Lock,
  Unlock,
  Sparkles,
  Pencil,
  Check,
  X,
  Trash2,
} from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { useAuth } from '@/components/providers/auth-provider'
import { formatDate } from '@/lib/utils'
import type { Persona, PersonaType } from '@/types'
import {
  getResearchProject,
  updateResearchProjectTitle,
  deleteResearchProject,
  type ResearchProjectWithPersonas,
} from './actions'

function TypeBadge({ type }: { type: PersonaType }) {
  const config = {
    b2c_individual: {
      label: 'B2C',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Users,
    },
    b2b_company: {
      label: 'B2B Company',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: Building2,
    },
    b2b_buyer: {
      label: 'B2B Buyer',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: Users,
    },
  }

  const { label, bgColor, textColor, icon: Icon } = config[type]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

function PersonaCard({ persona }: { persona: Persona }) {
  const personaName = persona.persona_data?.name || persona.company_profile?.name || 'Unnamed Persona'

  return (
    <Link href={`/persona/${persona.id}`}>
      <Card hover className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-1">{personaName}</CardTitle>
            {persona.is_unlocked ? (
              <Unlock className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
            )}
          </div>
          <CardDescription className="flex items-center gap-2">
            <TypeBadge type={persona.type} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-500">
            <p>
              <span className="font-medium text-slate-700">Created:</span> {formatDate(persona.created_at)}
            </p>
            <p className="flex items-center gap-1">
              <span className="font-medium text-slate-700">Status:</span>
              {persona.is_unlocked ? (
                <span className="text-green-600">Unlocked</span>
              ) : (
                <span className="text-slate-500">Locked</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ResearchPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoading: authLoading } = useAuth()
  const [project, setProject] = useState<ResearchProjectWithPersonas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    async function loadProject() {
      if (authLoading) return
      if (!params.id || typeof params.id !== 'string') return

      try {
        const result = await getResearchProject(params.id)
        if (result.success && result.data) {
          setProject(result.data)
          setEditTitle(result.data.title)
        } else {
          setError(result.error || 'Failed to load research project')
        }
      } catch {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params.id, authLoading])

  const handleSaveTitle = async () => {
    if (!project || !editTitle.trim()) return

    const result = await updateResearchProjectTitle(project.id, editTitle.trim())
    if (result.success) {
      setProject({ ...project, title: editTitle.trim() })
      setIsEditingTitle(false)
    }
  }

  const handleDelete = async () => {
    if (!project) return

    const result = await deleteResearchProject(project.id)
    if (result.success) {
      router.push('/dashboard')
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="space-y-8 animate-pulse">
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-24 bg-slate-200 rounded-lg" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Error loading research project</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const businessContext = project.business_context

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="space-y-8">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Project Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle()
                      if (e.key === 'Escape') {
                        setEditTitle(project.title)
                        setIsEditingTitle(false)
                      }
                    }}
                    className="text-3xl font-bold text-slate-900 border-b-2 border-brand-blue bg-transparent focus:outline-none"
                    autoFocus
                  />
                  <button onClick={handleSaveTitle} className="text-green-600 hover:text-green-700">
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditTitle(project.title)
                      setIsEditingTitle(false)
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <TypeBadge type={project.type as PersonaType} />
                <span className="text-sm text-slate-500">
                  {project.personas.length} {project.personas.length === 1 ? 'persona' : 'personas'}
                </span>
                <span className="text-sm text-slate-500">
                  Created {formatDate(project.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/create?research_project_id=${project.id}`}>
                <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  Add Another Persona
                </Button>
              </Link>
              {deleteConfirm ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    Confirm Delete
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Business Context Summary */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Business Context</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Sector</span>
                <p className="font-medium text-slate-900 mt-0.5">{businessContext.business_sector}</p>
              </div>
              <div>
                <span className="text-slate-500">Target Location</span>
                <p className="font-medium text-slate-900 mt-0.5">{businessContext.target_location}</p>
              </div>
              <div>
                <span className="text-slate-500">Price Point</span>
                <p className="font-medium text-slate-900 mt-0.5 capitalize">{businessContext.price_point} than competitors</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <span className="text-slate-500">Problem Solved</span>
                <p className="font-medium text-slate-900 mt-0.5">{businessContext.problem_solved}</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <span className="text-slate-500">Unique Selling Point</span>
                <p className="font-medium text-slate-900 mt-0.5">{businessContext.unique_selling_point}</p>
              </div>
            </div>
          </Card>

          {/* Personas Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Personas
              {project.personas.length > 0 && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({project.personas.length})
                </span>
              )}
            </h2>

            {project.personas.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-brand-blue" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">No personas yet</h3>
                    <p className="text-slate-600 max-w-sm">
                      Generate your first persona for this research project.
                    </p>
                  </div>
                  <Link href={`/create?research_project_id=${project.id}`}>
                    <Button size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Generate First Persona
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.personas.map((persona) => (
                  <PersonaCard key={persona.id} persona={persona} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
