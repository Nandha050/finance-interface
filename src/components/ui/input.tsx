import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-[var(--field-border)] bg-[var(--field-bg)] px-3 py-2 text-sm text-[var(--field-text)] placeholder:text-[var(--field-placeholder)] outline-none transition focus-visible:border-[var(--field-focus)] focus-visible:ring-2 focus-visible:ring-[var(--field-focus)]/35 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10',
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
