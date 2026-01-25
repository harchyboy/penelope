'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui'
import { Users, UserCircle, TrendingUp, Building2, User } from 'lucide-react'
import { getAdminStats, type AdminStats } from './actions'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  iconBgColor: string
  iconColor: string
  subtitle?: string
}

function StatCard({ title, value, icon: Icon, iconBgColor, iconColor, subtitle }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="w-12 h-12 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      setError(null)
      const response = await getAdminStats()
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        setError(response.error ?? 'Failed to fetch stats')
      }
      setIsLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Overview of Penelope platform metrics
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : stats ? (
            <>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              <StatCard
                title="Total Personas"
                value={stats.totalPersonas}
                icon={UserCircle}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
              />
              <StatCard
                title="Personas This Week"
                value={stats.personasThisWeek}
                icon={TrendingUp}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
              />
              <StatCard
                title="B2B vs B2C"
                value={`${stats.b2bCount} / ${stats.b2cCount}`}
                icon={Building2}
                iconBgColor="bg-orange-100"
                iconColor="text-orange-600"
                subtitle="B2B / B2C personas"
              />
            </>
          ) : null}
        </div>

        {/* Detailed Breakdown */}
        {!isLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Persona Type Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700">B2C Individual</span>
                    </div>
                    <span className="font-semibold text-slate-900">{stats.b2cCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-slate-700">B2B (Company + Buyer)</span>
                    </div>
                    <span className="font-semibold text-slate-900">{stats.b2bCount}</span>
                  </div>
                </div>
                {stats.totalPersonas > 0 && (
                  <div className="mt-6">
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{ width: `${(stats.b2cCount / stats.totalPersonas) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-slate-500">
                      <span>{Math.round((stats.b2cCount / stats.totalPersonas) * 100)}% B2C</span>
                      <span>{Math.round((stats.b2bCount / stats.totalPersonas) * 100)}% B2B</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Avg. Personas per User</span>
                    <span className="font-semibold text-slate-900">
                      {stats.totalUsers > 0
                        ? (stats.totalPersonas / stats.totalUsers).toFixed(1)
                        : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Weekly Growth Rate</span>
                    <span className="font-semibold text-slate-900">
                      {stats.totalPersonas > 0
                        ? `${Math.round((stats.personasThisWeek / stats.totalPersonas) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">B2B Adoption Rate</span>
                    <span className="font-semibold text-slate-900">
                      {stats.totalPersonas > 0
                        ? `${Math.round((stats.b2bCount / stats.totalPersonas) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
