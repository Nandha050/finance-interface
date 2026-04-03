import { SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#2B4071] bg-[#0A1738]/70 p-6 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#172A58] text-[#AABCF2]">
        <SearchX className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl text-[#E6EDFF]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#8BA0D4]">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
