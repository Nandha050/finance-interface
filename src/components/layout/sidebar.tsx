import { Crown, Sparkles } from 'lucide-react'

import { NAV_ITEMS } from '@/data/navigation'
import { cn } from '@/lib/utils'
import type { NavPage, ThemeMode } from '@/types/finance'

interface SidebarContentProps {
  activePage: NavPage
  onSelectPage: (page: NavPage) => void
  theme: ThemeMode
  className?: string
}

export function SidebarContent({
  activePage,
  onSelectPage,
  theme,
  className,
}: SidebarContentProps) {
  const isLight = theme === 'light'

  return (
    <div className={cn('flex h-full flex-col p-3 sm:p-4', className)}>
      <div
        className={cn(
          'rounded-xl border p-3',
          isLight ? 'border-[#D6DEEA] bg-white' : 'border-[#1D2F5E] bg-[#0C1940]',
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'grid h-8 w-8 place-items-center rounded-xl sm:h-9 sm:w-9',
              isLight ? 'bg-[#E8EEFF] text-[#3D63E8]' : 'bg-[#6E86FF]/20 text-[#A8B7FF]',
            )}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className={cn('font-display text-sm font-semibold sm:text-base', isLight ? 'text-[#1E2B44]' : 'text-[#EDF2FF]')}>
              Cobalt Architect
            </p>
            <p className={cn('text-[10px] tracking-[0.16em]', isLight ? 'text-[#7A889F]' : 'text-[#7D93CA]')}>
              DIGITAL ARCHITECTURE
            </p>
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
                  ? isLight
                    ? 'bg-[#1E4FE0] text-white shadow-soft'
                    : 'bg-[#1A2E65] text-[#E8EEFF] shadow-soft'
                  : isLight
                    ? 'text-[#5F6F88] hover:bg-[#E8EDF7] hover:text-[#2F3F57]'
                    : 'text-[#9AB0E2] hover:bg-[#122252] hover:text-[#E3EBFF]',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  isActive ? (isLight ? 'text-white' : 'text-[#B8C6FF]') : isLight ? 'text-[#7F8DA5]' : 'text-[#7D95CE]',
                )}
              />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div
          className={cn(
            'rounded-2xl border p-3',
            isLight
              ? 'border-[#D7DFEC] bg-[linear-gradient(180deg,#F6F9FF_0%,#EDF3FF_100%)]'
              : 'border-[#203664] bg-[linear-gradient(180deg,#0D1E46_0%,#0A1738_100%)]',
          )}
        >
          <p className={cn('text-[10px] font-semibold uppercase tracking-[0.1em]', isLight ? 'text-[#3A67E8]' : 'text-[#A1F282]')}>
            Pro Plan Active
          </p>
          <p className={cn('mt-2 text-xs leading-5', isLight ? 'text-[#70819B]' : 'text-[#8FA2D8]')}>
            You are using 82% of architectural resources.
          </p>
          <button
            type="button"
            className={cn(
              'mt-3 w-full rounded-xl px-3 py-2 text-xs font-semibold transition',
              isLight
                ? 'bg-[#2F66F6] text-white hover:bg-[#3F73FF]'
                : 'bg-[#8EA1FF] text-[#0C1C47] hover:bg-[#9EB0FF]',
            )}
          >
            Upgrade
          </button>
        </div>

        <div className={cn('rounded-2xl border p-3', isLight ? 'border-[#D7DFEC] bg-white' : 'border-[#1E335F] bg-[#0C1940]')}>
          <div className="flex items-center gap-2.5">
            <div className={cn('grid h-8 w-8 place-items-center rounded-full', isLight ? 'bg-[#E8EEFF] text-[#2F66F6]' : 'bg-[#2A4A9A] text-[#DDE6FF]')}>
              <Crown className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className={cn('text-sm font-semibold', isLight ? 'text-[#1F2D45]' : 'text-[#E6EDFF]')}>Alex Sterling</p>
              <p className={cn('text-[11px]', isLight ? 'text-[#74839D]' : 'text-[#88A0D5]')}>Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
