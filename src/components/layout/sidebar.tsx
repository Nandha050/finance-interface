import { Crown, Sparkles } from 'lucide-react'

import { NAV_ITEMS } from '@/data/navigation'
import { cn } from '@/lib/utils'
import type { NavPage } from '@/types/finance'

interface SidebarContentProps {
  activePage: NavPage
  onSelectPage: (page: NavPage) => void
  className?: string
}

export function SidebarContent({
  activePage,
  onSelectPage,
  className,
}: SidebarContentProps) {
  return (
    <div className={cn('flex h-full flex-col p-4', className)}>
      <div className="rounded-xl border border-[#1D2F5E] bg-[#0C1940] p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#6E86FF]/20 text-[#A8B7FF]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-[#EDF2FF]">Cobalt Architect</p>
            <p className="text-[10px] tracking-[0.16em] text-[#7D93CA]">DIGITAL ARCHITECTURE</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.page
          return (
            <button
              key={item.page}
              type="button"
              onClick={() => onSelectPage(item.page)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                isActive
                  ? 'bg-[#1A2E65] text-[#E8EEFF] shadow-soft'
                  : 'text-[#9AB0E2] hover:bg-[#122252] hover:text-[#E3EBFF]',
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-[#B8C6FF]' : 'text-[#7D95CE]')} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-[#203664] bg-[linear-gradient(180deg,#0D1E46_0%,#0A1738_100%)] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A1F282]">Pro Plan Active</p>
          <p className="mt-2 text-xs leading-5 text-[#8FA2D8]">
            You are using 82% of architectural resources.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-[#8EA1FF] px-3 py-2 text-xs font-semibold text-[#0C1C47] transition hover:bg-[#9EB0FF]"
          >
            Upgrade
          </button>
        </div>

        <div className="rounded-2xl border border-[#1E335F] bg-[#0C1940] p-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#2A4A9A] text-[#DDE6FF]">
              <Crown className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#E6EDFF]">Alex Sterling</p>
              <p className="text-[11px] text-[#88A0D5]">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
