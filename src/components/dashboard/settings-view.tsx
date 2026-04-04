import { RefreshCw, ShieldCheck, UserCog } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import type { Role, ThemeMode } from '@/types/finance'

interface SettingsViewProps {
  role: Role
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
  onResetData: () => void
}

export function SettingsView({ role, theme, onThemeChange, onResetData }: SettingsViewProps) {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <section>
        <h1 className="font-display text-[2.1rem] leading-none text-[var(--text-primary)] sm:text-[42px]">Settings</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
          Manage interface preferences and local dashboard behavior.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-[#9FB2FF]" /> Role Mode
            </CardTitle>
            <CardDescription>Current role determines whether transaction controls are editable.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="inline-flex rounded-full bg-[#172B5A] px-3 py-1 text-sm font-semibold capitalize text-[#DCE5FF]">
              {role}
            </p>
            <p className="mt-3 text-sm text-[#8EA2D6]">
              Viewer has read-only access. Admin can create, edit, and delete entries.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#9FB2FF]" /> Theme Preference
            </CardTitle>
            <CardDescription>Saved in local storage and restored on reload.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 rounded-xl border border-[#1F3362] bg-[#0D1A40] p-3">
              <p className="text-sm text-[#D8E3FF]">Light Theme</p>
              <Switch
                checked={theme === 'light'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'light' : 'dark')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-[#9FB2FF]" /> Data Controls
          </CardTitle>
          <CardDescription>
            Reset all transactions, filters, and derived dashboard metrics to starter data.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {role === 'admin' ? (
            <Button variant="secondary" onClick={onResetData}>
              Reset Mock Data
            </Button>
          ) : (
            <p className="text-sm text-[#8EA2D6]">
              Viewer role is read-only. Switch to admin mode to reset stored data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
