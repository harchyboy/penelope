import { Card, CardContent, CardHeader } from '@/components/ui'

function TableRowSkeleton() {
  return (
    <tr>
      <td className="p-4">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      </td>
    </tr>
  )
}

export default function AdminPersonasLoading() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-9 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-56 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Filter buttons */}
        <Card>
          <CardContent className="p-4 flex gap-2">
            <div className="h-9 w-16 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-9 w-16 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-9 w-16 bg-slate-200 rounded-lg animate-pulse" />
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="h-6 w-28 bg-slate-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="p-4 text-left"><div className="h-4 w-12 bg-slate-200 rounded animate-pulse" /></th>
                  <th className="p-4 text-left"><div className="h-4 w-10 bg-slate-200 rounded animate-pulse" /></th>
                  <th className="p-4 text-left"><div className="h-4 w-10 bg-slate-200 rounded animate-pulse" /></th>
                  <th className="p-4 text-left"><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></th>
                  <th className="p-4 text-left"><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></th>
                  <th className="p-4 text-left"><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-44 bg-slate-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
