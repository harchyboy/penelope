import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  helpText?: string
  options: SelectOption[]
  placeholder?: string
  onChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helpText, options, placeholder, onChange, ...props }, ref) => {
    const id = React.useId()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value)
    }

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
        <div className="relative">
          <select
            id={id}
            className={cn(
              'flex h-14 w-full appearance-none rounded-xl border border-hartz-border bg-hartz-white px-5 py-4 pr-12 text-body text-hartz-black',
              'transition-all duration-200',
              'focus:border-hartz-blue focus:outline-none focus:ring-2 focus:ring-hartz-blue/10',
              'disabled:cursor-not-allowed disabled:bg-hartz-black/5 disabled:text-hartz-muted',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hartz-muted pointer-events-none" />
        </div>
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
Select.displayName = 'Select'

export { Select }
