'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, Input, Button } from '@/components/ui'
import { Search, ChevronLeft, ChevronRight, Check, X, Shield, User } from 'lucide-react'
import { getAdminUsers, type AdminUserListItem, type AdminUsersResponse } from '../actions'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 20

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg animate-pulse">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  )
}

function RoleBadge({ role }: { role: 'user' | 'admin' }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
        <Shield className="h-3 w-3" />
        Admin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
      <User className="h-3 w-3" />
      User
    </span>
  )
}

function BooleanBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  if (value) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        <Check className="h-3 w-3" />
        {trueLabel}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500">
      <X className="h-3 w-3" />
      {falseLabel}
    </span>
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
        <span className="font-medium">{totalCount}</span> users
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

export default function AdminUsersPage() {
  const [data, setData] = useState<AdminUsersResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUsers = useCallback(async (page: number, search: string) => {
    setIsLoading(true)
    setError(null)
    const response = await getAdminUsers(page, PAGE_SIZE, search || undefined)
    if (response.success && response.data) {
      setData(response.data)
    } else {
      setError(response.error ?? 'Failed to fetch users')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchUsers(currentPage, searchQuery)
  }, [fetchUsers, currentPage, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchUsers(1, searchQuery)
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
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">
            Manage all registered users on the platform
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <TableSkeleton />
              </div>
            ) : data && data.users.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Email
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Name
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Role
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Free Persona
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Created
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                          Personas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map((user: AdminUserListItem) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-slate-900">
                              {user.email}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">
                              {user.name || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-4 py-3">
                            <BooleanBadge
                              value={user.free_persona_used}
                              trueLabel="Used"
                              falseLabel="Available"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">
                              {formatDate(user.created_at)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-medium">
                              {user.persona_count}
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
                  {searchQuery ? 'No users found matching your search.' : 'No users registered yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
