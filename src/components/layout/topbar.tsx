import {
  Bell,
  Menu,
  MoonStar,
  Search,
  ShieldQuestion,
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
          'sticky top-0 z-30 border-b px-3 py-2 backdrop-blur-xl sm:px-6 sm:py-3',
          isLight ? 'border-[#D8DFEB] bg-[#F7F9FC]/95' : 'border-[#18284F]/80 bg-[#071332]/80',
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

          <div className="relative min-w-0 flex-1">
            <Search className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', isLight ? 'text-[#8A97AE]' : 'text-[#6F84B7]')} />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search transactions..."
              className="h-9 pl-9 text-sm sm:h-10"
            />
          </div>

          <div
            className={cn(
              'hidden items-center rounded-lg border p-1 sm:flex',
              isLight ? 'border-[#D7DEEB] bg-white' : 'border-[#203665] bg-[#0D1A40]',
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
                      : 'bg-[#6C86FF] text-[#07142F]'
                    : isLight
                      ? 'text-[#71819E] hover:text-[#2C3D57]'
                      : 'text-[#9CB0DF] hover:text-[#E6EDFF]',
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div
              className={cn(
                'hidden items-center gap-2 rounded-lg border px-2 py-1.5 md:flex',
                isLight ? 'border-[#D7DEEB] bg-white' : 'border-[#1F3363] bg-[#0E1B42]',
              )}
            >
              <MoonStar className={cn('h-3.5 w-3.5', isLight ? 'text-[#7486A5]' : 'text-[#A6B7EA]')} />
              <Switch
                checked={theme === 'light'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'light' : 'dark')}
                aria-label="Toggle theme"
              />
              <Sun className={cn('h-3.5 w-3.5', isLight ? 'text-[#7486A5]' : 'text-[#A6B7EA]')} />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-lg border transition',
                    isLight
                      ? 'border-[#D7DEEB] bg-white text-[#7888A6] hover:text-[#2D3F57]'
                      : 'border-[#1F3363] bg-[#0D1B40] text-[#A8BAE9] hover:text-[#E6EEFF]',
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
                    'grid h-9 w-9 place-items-center rounded-lg border transition',
                    isLight
                      ? 'border-[#D7DEEB] bg-white text-[#7888A6] hover:text-[#2D3F57]'
                      : 'border-[#1F3363] bg-[#0D1B40] text-[#A8BAE9] hover:text-[#E6EEFF]',
                  )}
                >
                  <ShieldQuestion className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Support</TooltipContent>
            </Tooltip>

            <div
              className={cn(
                'flex items-center gap-2 rounded-lg border p-1.5 pl-2.5',
                isLight ? 'border-[#D7DEEB] bg-white' : 'border-[#1F3363] bg-[#0D1B40]',
              )}
            >
              <div className="text-right leading-tight">
                <p className={cn('text-xs font-semibold', isLight ? 'text-[#243650]' : 'text-[#E7EDFF]')}>Alex Chen</p>
                <p className={cn('text-[10px]', isLight ? 'text-[#7888A6]' : 'text-[#8FA4D8]')}>Lead Architect</p>
              </div>
              <div className={cn('grid h-8 w-8 place-items-center rounded-lg', isLight ? 'bg-[#E8EEFF] text-[#2F66F6]' : 'bg-[#213B76] text-[#BFD0FF]')}>
                <UserCircle2 className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
