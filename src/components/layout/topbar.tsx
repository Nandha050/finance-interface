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
  return (
    <TooltipProvider delayDuration={150}>
      <header className="sticky top-0 z-30 border-b border-[#18284F]/80 bg-[#071332]/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F84B7]" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search transactions..."
              className="h-10 pl-9"
            />
          </div>

          <div className="hidden items-center rounded-lg border border-[#203665] bg-[#0D1A40] p-1 sm:flex">
            {(['admin', 'viewer'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onRoleChange(mode)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition',
                  role === mode
                    ? 'bg-[#6C86FF] text-[#07142F]'
                    : 'text-[#9CB0DF] hover:text-[#E6EDFF]',
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="hidden items-center gap-2 rounded-lg border border-[#1F3363] bg-[#0E1B42] px-2 py-1.5 md:flex">
              <MoonStar className="h-3.5 w-3.5 text-[#A6B7EA]" />
              <Switch
                checked={theme === 'light'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'light' : 'dark')}
                aria-label="Toggle theme"
              />
              <Sun className="h-3.5 w-3.5 text-[#A6B7EA]" />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[#1F3363] bg-[#0D1B40] text-[#A8BAE9] transition hover:text-[#E6EEFF]"
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
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[#1F3363] bg-[#0D1B40] text-[#A8BAE9] transition hover:text-[#E6EEFF]"
                >
                  <ShieldQuestion className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Support</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2 rounded-lg border border-[#1F3363] bg-[#0D1B40] p-1.5 pl-2.5">
              <div className="text-right leading-tight">
                <p className="text-xs font-semibold text-[#E7EDFF]">Alex Chen</p>
                <p className="text-[10px] text-[#8FA4D8]">Lead Architect</p>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#213B76] text-[#BFD0FF]">
                <UserCircle2 className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
