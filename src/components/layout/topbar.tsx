import {
  Bell,
  Menu,
  MoonStar,
  Search,
  ShieldQuestion,
  Sparkles,
  Sun,
  UserCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Role, ThemeMode } from '@/types/finance'

interface TopBarProps {
  role: Role
  theme: ThemeMode
  searchValue: string
  onSearchChange: (value: string) => void
  onRoleChange: (role: Role) => void
  onThemeChange: (theme: ThemeMode) => void
  onOpenMobileNav: () => void
}

export function TopBar({
  role,
  theme,
  searchValue,
  onSearchChange,
  onRoleChange,
  onThemeChange,
  onOpenMobileNav,
}: TopBarProps) {
  const isLight = theme === 'light'

  return (
    <TooltipProvider delayDuration={150}>
      <header
        className={cn(
          'topbar-shell sticky top-2 z-30 mx-2 rounded-2xl border px-3 py-2 backdrop-blur-xl sm:mx-4 sm:px-4 sm:py-3 lg:mx-6',
          isLight ? 'border-[#D8DFEB] bg-[#F7F9FC]/92' : 'border-[var(--surface-border-soft)] bg-[#0C1321]/88',
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="sm:hidden"
            onClick={() => onThemeChange(isLight ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            {isLight ? <MoonStar className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <div
            className={cn(
              'flex items-center gap-2 rounded-xl border px-2.5 py-1.5 lg:hidden',
              isLight ? 'border-[#D7DEEB] bg-white' : 'border-[var(--surface-border)] bg-[var(--surface-2)]',
            )}
          >
            <div
              className={cn(
                'grid h-6 w-6 place-items-center rounded-lg',
                isLight ? 'bg-[#E8EEFF] text-[#2F66F6]' : 'bg-[#173238] text-[#6DEDDC]',
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="hidden min-[460px]:block">
              <p className={cn('text-xs font-semibold leading-none', isLight ? 'text-[#1E2B44]' : 'text-[var(--text-primary)]')}>
                Cobalt Architect
              </p>
              <p className={cn('mt-0.5 text-[9px] tracking-[0.12em]', isLight ? 'text-[#7A889F]' : 'text-[var(--text-soft)]')}>
                DIGITAL ARCHITECTURE
              </p>
            </div>
          </div>

          <div className="relative min-w-0 flex-1">
            <Search className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', isLight ? 'text-[#8A97AE]' : 'text-[var(--text-soft)]')} />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search transactions..."
              className="h-9 pl-9 text-sm sm:h-10"
            />
          </div>

          <div
            className={cn(
              'hidden items-center rounded-lg border p-1 lg:flex',
              isLight ? 'border-[#D7DEEB] bg-white' : 'border-[var(--surface-border)] bg-[var(--surface-2)]',
            )}
          >
            {(['admin', 'viewer'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onRoleChange(mode)}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition',
                  role === mode
                    ? isLight
                      ? 'bg-[#2F66F6] text-white'
                      : 'bg-[var(--accent-primary)] text-[#07161A]'
                    : isLight
                      ? 'text-[#71819E] hover:text-[#2C3D57]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div
              className={cn(
                'hidden items-center gap-2 rounded-lg border px-2 py-1.5 lg:flex',
                isLight ? 'border-[#D7DEEB] bg-white' : 'border-[var(--surface-border)] bg-[var(--surface-2)]',
              )}
            >
              <MoonStar className={cn('h-3.5 w-3.5', isLight ? 'text-[#7486A5]' : 'text-[var(--text-muted)]')} />
              <Switch
                checked={theme === 'light'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'light' : 'dark')}
                aria-label="Toggle theme"
              />
              <Sun className={cn('h-3.5 w-3.5', isLight ? 'text-[#7486A5]' : 'text-[var(--text-muted)]')} />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-lg border transition',
                    isLight
                      ? 'border-[#D7DEEB] bg-white text-[#7888A6] hover:text-[#2D3F57]'
                      : 'border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  )}
                >
                  <Bell className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'hidden h-9 w-9 place-items-center rounded-lg border transition xl:grid',
                    isLight
                      ? 'border-[#D7DEEB] bg-white text-[#7888A6] hover:text-[#2D3F57]'
                      : 'border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  )}
                >
                  <ShieldQuestion className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Support</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-lg border transition xl:hidden',
                    isLight
                      ? 'border-[#D7DEEB] bg-white text-[#7888A6] hover:text-[#2D3F57]'
                      : 'border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  )}
                >
                  <UserCircle2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>

            <div
              className={cn(
                'hidden items-center gap-2 rounded-lg border p-1.5 pl-2.5 xl:flex',
                isLight ? 'border-[#D7DEEB] bg-white' : 'border-[var(--surface-border)] bg-[var(--surface-2)]',
              )}
            >
              <div className="text-right leading-tight">
                <p className={cn('text-xs font-semibold', isLight ? 'text-[#243650]' : 'text-[var(--text-primary)]')}>Alex Chen</p>
                <p className={cn('text-[10px]', isLight ? 'text-[#7888A6]' : 'text-[var(--text-muted)]')}>Lead Architect</p>
              </div>
              <div className={cn('grid h-8 w-8 place-items-center rounded-lg', isLight ? 'bg-[#E8EEFF] text-[#2F66F6]' : 'bg-[#173238] text-[#6DEDDC]')}>
                <UserCircle2 className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
