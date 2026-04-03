import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#1D2E59] bg-[#0A1535] px-3 py-2 text-sm text-[#D8E3FF] placeholder:text-[#5F75AB] outline-none transition focus-visible:border-[#4E6BBD] focus-visible:ring-2 focus-visible:ring-[#4E6BBD]/35 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
