import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { LayoutDashboard } from 'lucide-react'

export default function AdminDashboardPage() {
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

        {/* Placeholder for stats - will be implemented in US-020 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <CardTitle>Dashboard Stats</CardTitle>
                <CardDescription>Platform metrics coming soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              Stats cards with total users, personas, and B2B breakdown will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
