import { Card, CardContent } from '@/components/ui'

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

export default function AdminLoading() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-64 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Bottom cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-10 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 bg-slate-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 bg-slate-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
