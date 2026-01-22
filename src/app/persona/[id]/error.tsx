'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Plus, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui'

export default function PersonaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Persona page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Error Loading Persona
          </h1>
          <p className="text-slate-600">
            We couldn&apos;t load this persona. It may no longer exist or there was a server error.
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400 mt-2">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/create">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Persona
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
