import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helpText, ...props }, ref) => {
    const id = React.useId()

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-body-sm font-medium text-hartz-black"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            'flex h-14 w-full rounded-xl border border-hartz-border bg-hartz-white px-5 py-4 text-body text-hartz-black',
            'transition-all duration-200',
            'placeholder:text-hartz-muted/60',
            'focus:border-hartz-blue focus:outline-none focus:ring-2 focus:ring-hartz-blue/10',
            'disabled:cursor-not-allowed disabled:bg-hartz-black/5 disabled:text-hartz-muted',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {helpText && !error && (
          <p className="text-body-sm text-hartz-muted">{helpText}</p>
        )}
        {error && (
          <p className="text-body-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helpText, ...props }, ref) => {
    const id = React.useId()

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-body-sm font-medium text-hartz-black"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            'flex min-h-[120px] w-full rounded-xl border border-hartz-border bg-hartz-white px-5 py-4 text-body text-hartz-black',
            'transition-all duration-200 resize-none',
            'placeholder:text-hartz-muted/60',
            'focus:border-hartz-blue focus:outline-none focus:ring-2 focus:ring-hartz-blue/10',
            'disabled:cursor-not-allowed disabled:bg-hartz-black/5 disabled:text-hartz-muted',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {helpText && !error && (
          <p className="text-body-sm text-hartz-muted">{helpText}</p>
        )}
        {error && (
          <p className="text-body-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
