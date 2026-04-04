import { motion } from 'framer-motion'
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
import type { Role, ThemeMode, Transaction } from '@/types/finance'

interface DashboardViewProps {
  transactions: Transaction[]
  role: Role
  theme: ThemeMode
  onAddTransaction: () => void
  onExportCSV: () => void
  onExportJSON: () => void
}

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
}

const blockVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38 },
  },
}

export function DashboardView({
  transactions,
  role,
  theme,
  onAddTransaction,
  onExportCSV,
  onExportJSON,
}: DashboardViewProps) {
  const metrics = getSummaryMetrics(transactions)
  const trend = getMonthlyTrend(transactions)
  const categoryData = getCategoryBreakdown(transactions)
  const insights = getInsights(transactions)

  return (
    <motion.div
      className="space-y-4 sm:space-y-5 lg:space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      <motion.section variants={blockVariants} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[2.1rem] leading-none text-[var(--text-primary)] sm:text-[42px]">
            Financial Blueprint
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
            Welcome back, Architect. Here is your real-time performance summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {role === 'admin' && (
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
          )}

          {role === 'admin' && (
            <Button size="sm" className="gap-2" onClick={onAddTransaction}>
              <Plus className="h-3.5 w-3.5" /> New Entry
            </Button>
          )}
        </div>
      </motion.section>

      <motion.div variants={blockVariants}>
        <SummaryCards metrics={metrics} monthOverMonth={insights.monthOverMonthChange} theme={theme} />
      </motion.div>

      <motion.div variants={blockVariants}>
        <PerformanceOverview trend={trend} categoryData={categoryData} />
      </motion.div>

      <motion.div variants={blockVariants}>
        <RecentActivity transactions={transactions} />
      </motion.div>
    </motion.div>
  )
}
