'use client'

import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  title?: string
  message: string
  variant?: 'default' | 'inline' | 'page'
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  title,
  message,
  variant = 'default',
  onRetry,
  className,
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('bg-red-50 border border-red-200 rounded-lg p-4', className)}>
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            {title && <p className="font-medium text-red-800 mb-1">{title}</p>}
            <p className="text-red-700 text-sm">{message}</p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'page') {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-slate-50', className)}>
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {title || 'Something Went Wrong'}
            </h1>
            <p className="text-slate-600">{message}</p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} className="mx-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Default variant - card-based
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-8 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title || 'Error'}
      </h3>
      <p className="text-slate-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}
