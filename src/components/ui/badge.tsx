import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase',
  {
    variants: {
      variant: {
        default: 'border-[#2C3F72] bg-[#13224A] text-[#B9C7F7]',
        income: 'border-[#2E5B38] bg-[#143322] text-[#9BFFA9]',
        expense: 'border-[#6B2A45] bg-[#2B1730] text-[#FF9BB6]',
        neutral: 'border-[#2A3B68] bg-[#101C40] text-[#8FA4DC]',
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
