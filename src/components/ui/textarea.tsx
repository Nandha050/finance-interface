import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'min-h-20 w-full rounded-lg border border-[#1D2E59] bg-[#0A1535] px-3 py-2 text-sm text-[#D8E3FF] placeholder:text-[#5F75AB] outline-none transition focus-visible:border-[#4E6BBD] focus-visible:ring-2 focus-visible:ring-[#4E6BBD]/35 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
