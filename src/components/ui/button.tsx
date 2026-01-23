import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-hartz-blue text-white hover:bg-hartz-blue/90 focus-visible:ring-hartz-blue/30 shadow-sm hover:shadow-bento-hover',
        secondary:
          'bg-hartz-black/5 text-hartz-black hover:bg-hartz-black/10 focus-visible:ring-hartz-black/20',
        outline:
          'border-2 border-hartz-black text-hartz-black hover:bg-hartz-black hover:text-white focus-visible:ring-hartz-black/30',
        ghost:
          'text-hartz-black hover:bg-hartz-black/5',
        link:
          'text-hartz-blue underline-offset-4 hover:underline',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500/30',
      },
      size: {
        default: 'h-12 px-8 rounded-full text-sm',
        sm: 'h-10 px-6 rounded-full text-sm',
        lg: 'h-14 px-10 rounded-full text-base',
        xl: 'h-16 px-12 rounded-full text-lg',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
