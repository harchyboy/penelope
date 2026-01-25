import { Card, CardContent } from '@/components/ui'

function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="space-y-8 animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-9 w-64 bg-slate-200 rounded" />
              <div className="h-5 w-48 bg-slate-200 rounded" />
            </div>
            <div className="h-11 w-36 bg-slate-200 rounded-lg" />
          </div>

          {/* Free persona banner skeleton */}
          <div className="h-20 bg-slate-200 rounded-lg" />

          {/* Section header skeleton */}
          <div className="h-7 w-40 bg-slate-200 rounded" />

          {/* Cards grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
