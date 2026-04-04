import { Crown, MoonStar, Sparkles, Sun } from 'lucide-react'

import { NAV_ITEMS } from '@/data/navigation'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { NavPage, ThemeMode } from '@/types/finance'

interface SidebarContentProps {
  activePage: NavPage
  onSelectPage: (page: NavPage) => void
  theme: ThemeMode
  showThemeToggle?: boolean
  onThemeChange?: (theme: ThemeMode) => void
  className?: string
}

export function SidebarContent({
  activePage,
  onSelectPage,
  theme,
  showThemeToggle,
  onThemeChange,
  className,
}: SidebarContentProps) {
  const isLight = theme === 'light'

  return (
    <div className={cn('relative flex h-full flex-col overflow-hidden p-3 sm:p-4', className)}>
      <div
        className={cn(
          'pointer-events-none absolute left-4 right-4 top-2 h-24 rounded-2xl',
          isLight
            ? 'bg-[radial-gradient(circle_at_top,rgba(47,102,246,0.13),transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(35,215,198,0.16),transparent_68%)]',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -right-10 top-20 h-40 w-40 rounded-full blur-3xl',
          isLight ? 'bg-[#5A86FF]/20' : 'bg-[#22D8C7]/18',
        )}
      />

      {showThemeToggle && onThemeChange && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2.5 text-[var(--text-primary)]">
          <p className="text-sm font-medium">Light Theme</p>
          <div className="flex items-center gap-2">
            <MoonStar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <Switch
              checked={theme === 'light'}
              onCheckedChange={(checked) => onThemeChange(checked ? 'light' : 'dark')}
              aria-label="Toggle theme"
            />
            <Sun className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </div>
        </div>
      )}

      <div
        className={cn(
          'relative z-[1] rounded-xl border p-3 backdrop-blur-lg',
          isLight ? 'border-[#D6DEEA] bg-white' : 'border-[var(--surface-border)] bg-[var(--surface-2)]',
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'grid h-8 w-8 place-items-center rounded-xl sm:h-9 sm:w-9',
              isLight ? 'bg-[#E8EEFF] text-[#3D63E8]' : 'bg-[#173238] text-[#6DEDDC]',
            )}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className={cn('font-display text-sm font-semibold sm:text-base', isLight ? 'text-[#1E2B44]' : 'text-[var(--text-primary)]')}>
              Cobalt Architect
            </p>
            <p className={cn('text-[10px] tracking-[0.16em]', isLight ? 'text-[#7A889F]' : 'text-[var(--text-soft)]')}>
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
                'group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition',
                isActive
                  ? isLight
                    ? 'border-transparent bg-[#1E4FE0] text-white shadow-soft'
                    : 'border-[#25545A] bg-[linear-gradient(90deg,#12333A_0%,#173943_100%)] text-[#E9FCF8] shadow-soft'
                  : isLight
                    ? 'border-transparent text-[#4B5D78] hover:bg-[#E2EAF8] hover:text-[#1F2E45]'
                    : 'border-transparent text-[var(--text-muted)] hover:border-[#24354A] hover:bg-[#172233]/72 hover:text-[var(--text-primary)]',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  isActive ? (isLight ? 'text-white' : 'text-[#77F3E3]') : isLight ? 'text-[#5C6F8D]' : 'text-[var(--text-soft)]',
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
            'rounded-2xl border p-3 backdrop-blur-lg',
            isLight
              ? 'border-[#D7DFEC] bg-[linear-gradient(180deg,#F6F9FF_0%,#EDF3FF_100%)]'
              : 'border-[var(--surface-border)] bg-[linear-gradient(180deg,#121b2d_0%,#0d1422_100%)]',
          )}
        >
          <p className={cn('text-[10px] font-semibold uppercase tracking-[0.1em]', isLight ? 'text-[#3A67E8]' : 'text-[var(--accent-success)]')}>
            Pro Plan Active
          </p>
          <p className={cn('mt-2 text-xs leading-5', isLight ? 'text-[#70819B]' : 'text-[var(--text-muted)]')}>
            You are using 82% of architectural resources.
          </p>
          <button
            type="button"
            className={cn(
              'mt-3 w-full rounded-xl px-3 py-2 text-xs font-semibold transition',
              isLight
                ? 'bg-[#2F66F6] text-white hover:bg-[#3F73FF]'
                : 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] hover:bg-[var(--btn-primary-bg-hover)]',
            )}
          >
            Upgrade
          </button>
        </div>

        <div className={cn('rounded-2xl border p-3 backdrop-blur-lg', isLight ? 'border-[#D7DFEC] bg-white' : 'border-[var(--surface-border)] bg-[var(--surface-2)]')}>
          <div className="flex items-center gap-2.5">
            <div className={cn('grid h-8 w-8 place-items-center rounded-full', isLight ? 'bg-[#E8EEFF] text-[#2F66F6]' : 'bg-[#1B2C3A] text-[#6DEDDC]')}>
              <Crown className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className={cn('text-sm font-semibold', isLight ? 'text-[#1F2D45]' : 'text-[var(--text-primary)]')}>Alex Sterling</p>
              <p className={cn('text-[11px]', isLight ? 'text-[#74839D]' : 'text-[var(--text-muted)]')}>Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
