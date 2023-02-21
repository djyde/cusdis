import * as React from "react"
import cn from 'classnames'
import { VariantProps, cva } from "class-variance-authority"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { 
    _size?: 'default' | 'sm' | 'lg'
  }


const inputVariants = cva("flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900", {
  variants: {
    _size: {
      'default': 'h-10 py-2',
      'sm': 'h-9 text-sm',
      'lg': 'h-11 text-lg'
    }
  },
  defaultVariants: {
    _size: 'default'
  }
})

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, _size, ...props }, ref) => {
    return (
      <input
        className={cn(
          inputVariants({ _size, className }),
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }