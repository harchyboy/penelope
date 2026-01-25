'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, Lock, Unlock, Users, Building2, User } from 'lucide-react'
import { getAdminPersonas, type AdminPersonaListItem, type AdminPersonasResponse, type PersonaTypeFilter } from '../actions'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 20

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg animate-pulse">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-28 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  )
}

function TypeBadge({ type }: { type: AdminPersonaListItem['type'] }) {
  const config = {
    b2c_individual: {
      label: 'B2C',
      icon: User,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    b2b_company: {
      label: 'B2B Company',
      icon: Building2,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    b2b_buyer: {
      label: 'B2B Buyer',
      icon: Users,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
    },
  }

  const { label, icon: Icon, bgColor, textColor } = config[type]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

function UnlockedBadge({ isUnlocked }: { isUnlocked: boolean }) {
  if (isUnlocked) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        <Unlock className="h-3 w-3" />
        Unlocked
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500">
      <Lock className="h-3 w-3" />
      Locked
    </span>
  )
}

interface FilterButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-brand-blue text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, totalCount, pageSize, onPageChange }: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
      <div className="text-sm text-slate-600">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalCount}</span> personas
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-slate-600 px-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export default function AdminPersonasPage() {
  const [data, setData] = useState<AdminPersonasResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<PersonaTypeFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const fetchPersonas = useCallback(async (page: number, filter: PersonaTypeFilter) => {
    setIsLoading(true)
    setError(null)
    const response = await getAdminPersonas(page, PAGE_SIZE, filter)
    if (response.success && response.data) {
      setData(response.data)
    } else {
      setError(response.error ?? 'Failed to fetch personas')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchPersonas(currentPage, typeFilter)
  }, [fetchPersonas, currentPage, typeFilter])

  const handleFilterChange = (filter: PersonaTypeFilter) => {
    setTypeFilter(filter)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Personas</h1>
          <p className="text-slate-600 mt-1">
            View and manage all generated personas on the platform
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 mr-2">Filter by type:</span>
              <FilterButton
                active={typeFilter === 'all'}
                onClick={() => handleFilterChange('all')}
              >
                All
              </FilterButton>
              <FilterButton
                active={typeFilter === 'b2c'}
                onClick={() => handleFilterChange('b2c')}
              >
                B2C
              </FilterButton>
              <FilterButton
                active={typeFilter === 'b2b'}
                onClick={() => handleFilterChange('b2b')}
              >
                B2B
              </FilterButton>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Personas Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <TableSkeleton />
              </div>
            ) : data && data.personas.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Persona Name
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Type
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          User Email
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Business Name
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.personas.map((persona: AdminPersonaListItem) => (
                        <tr
                          key={persona.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/persona/${persona.id}`}
                              className="text-sm font-medium text-brand-blue hover:underline"
                            >
                              {persona.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <TypeBadge type={persona.type} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">
                              {persona.user_email}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">
                              {persona.business_name}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <UnlockedBadge isUnlocked={persona.is_unlocked} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">
                              {formatDate(persona.created_at)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.totalPages > 1 && (
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    totalCount={data.totalCount}
                    pageSize={data.pageSize}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600">
                  {typeFilter !== 'all'
                    ? `No ${typeFilter.toUpperCase()} personas found.`
                    : 'No personas generated yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
