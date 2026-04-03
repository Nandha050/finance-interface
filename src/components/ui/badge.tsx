import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase',
  {
    variants: {
      variant: {
        default:
          'border-[var(--badge-default-border)] bg-[var(--badge-default-bg)] text-[var(--badge-default-text)]',
        income:
          'border-[var(--badge-income-border)] bg-[var(--badge-income-bg)] text-[var(--badge-income-text)]',
        expense:
          'border-[var(--badge-expense-border)] bg-[var(--badge-expense-bg)] text-[var(--badge-expense-text)]',
        neutral:
          'border-[var(--badge-neutral-border)] bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
