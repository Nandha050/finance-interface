import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Download, Sparkles, TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCategoryBreakdown, getInsights, getMonthlyTrend } from '@/lib/analytics'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { Transaction } from '@/types/finance'

interface InsightsViewProps {
  transactions: Transaction[]
  role: 'viewer' | 'admin'
  onExportCSV: () => void
  onExportJSON: () => void
}

export function InsightsView({ transactions, role, onExportCSV, onExportJSON }: InsightsViewProps) {
  const insights = getInsights(transactions)
  const trend = getMonthlyTrend(transactions)
  const categoryBreakdown = getCategoryBreakdown(transactions)
  const monthlyBase = trend[trend.length - 1]?.expenses ?? 5200

  const spendingPerformance = [
    {
      label: 'Week 1',
      actual: Math.round(monthlyBase * 0.19),
      budget: Math.round(monthlyBase * 0.22),
    },
    {
      label: 'Week 2',
      actual: Math.round(monthlyBase * 0.27),
      budget: Math.round(monthlyBase * 0.24),
    },
    {
      label: 'Week 3',
      actual: Math.round(monthlyBase * 0.21),
      budget: Math.round(monthlyBase * 0.25),
    },
    {
      label: 'Week 4',
      actual: Math.round(monthlyBase * 0.33),
      budget: Math.round(monthlyBase * 0.29),
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[2.1rem] leading-none text-[var(--text-primary)] sm:text-[42px]">Financial Insights</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
            Predictive pattern recognition and spending diagnostics for the current period.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" className="gap-2">
            <CalendarDays className="h-3.5 w-3.5" /> Oct 2023
          </Button>
          {role === 'admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Download className="h-3.5 w-3.5" /> Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportCSV}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={onExportJSON}>Export as JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Spending Performance</CardTitle>
              <CardDescription>Weekly delta against architectural budget</CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="h-[260px] w-full sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendingPerformance}>
                    <CartesianGrid stroke="var(--surface-border)" strokeDasharray="3 7" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface-2)',
                        borderColor: 'var(--surface-border)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Line type="monotone" dataKey="actual" stroke="#95A9FF" strokeWidth={2.3} dot={false} />
                    <Line
                      type="monotone"
                      dataKey="budget"
                      stroke="#B9FF81"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="4 4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}>
          <Card className="h-full border-[var(--surface-border)] bg-[linear-gradient(180deg,var(--surface-2)_0%,var(--surface-1)_100%)]">
            <CardHeader>
              <p className="inline-flex w-fit rounded-full bg-[color-mix(in_srgb,var(--accent-success)_18%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--accent-success)]">
                Highest Velocity
              </p>
              <CardTitle className="mt-2 text-[32px] leading-none sm:text-[42px]">{insights.highestSpendingCategory}</CardTitle>
              <CardDescription>
                Momentum is {formatPercent(insights.monthOverMonthChange)} vs. previous average.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[40px] font-semibold leading-none text-[var(--accent-success)] sm:text-[54px]">
                {formatCurrency(insights.highestSpendingValue)}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">Used 75% of Goal</p>
              <div className="mt-4 h-2 rounded-full bg-[var(--surface-border)]">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[var(--accent-success-soft)] to-[var(--accent-success)]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl">Subscription Audit</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--text-muted)]">
            Found recurring charges for underused tools. Potential monthly saving:{' '}
            <span className="font-semibold text-[var(--accent-success)]">{formatCurrency(420)}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl">Grocery Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--text-muted)]">
            Mid-week spending peaks are 15% more expensive than weekends. Recommended: bulk purchase window.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl">General Spending</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--text-muted)]">{insights.warning}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Architectural Breakdown</CardTitle>
          <button type="button" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            View All Clusters
          </button>
        </CardHeader>
        <CardContent className="space-y-5 pt-0">
          {categoryBreakdown.slice(0, 3).map((item) => {
            const goal = item.value * 1.7
            const progress = Math.min((item.value / goal) * 100, 100)

            return (
              <div key={item.category} className="grid gap-2 sm:grid-cols-[180px,1fr,160px] sm:items-center">
                <p className="font-medium text-[var(--text-primary)]">{item.category}</p>
                <div className="h-2 rounded-full bg-[var(--surface-border)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary-soft)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-right text-sm text-[var(--text-muted)]">
                  {formatCurrency(item.value)} / {formatCurrency(Math.round(goal))}
                </p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <footer className="border-t border-[var(--surface-border)] pt-3 text-xs text-[var(--text-soft)]">
        <p>
          © 2026 Cobalt Architect. Financial intelligence processed through secure architectural neural networks.
        </p>
      </footer>
    </div>
  )
}
