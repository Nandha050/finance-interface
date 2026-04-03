import { Download, Plus } from 'lucide-react'

import { PerformanceOverview } from '@/components/dashboard/performance-overview'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCategoryBreakdown, getInsights, getMonthlyTrend, getSummaryMetrics } from '@/lib/analytics'
import type { Role, Transaction } from '@/types/finance'

interface DashboardViewProps {
  transactions: Transaction[]
  role: Role
  onAddTransaction: () => void
  onExportCSV: () => void
  onExportJSON: () => void
}

export function DashboardView({
  transactions,
  role,
  onAddTransaction,
  onExportCSV,
  onExportJSON,
}: DashboardViewProps) {
  const metrics = getSummaryMetrics(transactions)
  const trend = getMonthlyTrend(transactions)
  const categoryData = getCategoryBreakdown(transactions)
  const insights = getInsights(transactions)

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[34px] leading-none text-[#F0F4FF] sm:text-[42px]">
            Financial Blueprint
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#8EA2D6] sm:text-base">
            Welcome back, Architect. Here is your real-time performance summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2">
                <Download className="h-3.5 w-3.5" /> Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportCSV}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={onExportJSON}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {role === 'admin' && (
            <Button size="sm" className="gap-2" onClick={onAddTransaction}>
              <Plus className="h-3.5 w-3.5" /> New Entry
            </Button>
          )}
        </div>
      </section>

      <SummaryCards metrics={metrics} monthOverMonth={insights.monthOverMonthChange} />
      <PerformanceOverview trend={trend} categoryData={categoryData} />
      <RecentActivity transactions={transactions} />
    </div>
  )
}
