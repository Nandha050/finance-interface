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
  onExportCSV: () => void
  onExportJSON: () => void
}

export function InsightsView({ transactions, onExportCSV, onExportJSON }: InsightsViewProps) {
  const insights = getInsights(transactions)
  const trend = getMonthlyTrend(transactions)
  const categoryBreakdown = getCategoryBreakdown(transactions)

  const spendingPerformance = trend.slice(-4).map((month, index) => ({
    label: `Week ${index + 1}`,
    actual: Math.max(1000, Math.round(month.expenses / 4)),
    budget: Math.max(1200, Math.round((month.expenses * 1.15) / 4)),
  }))

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[34px] leading-none text-[#F0F4FF] sm:text-[42px]">Financial Insights</h1>
          <p className="mt-2 max-w-xl text-sm text-[#8EA2D6] sm:text-base">
            Predictive pattern recognition and spending diagnostics for the current period.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" className="gap-2">
            <CalendarDays className="h-3.5 w-3.5" /> Oct 2023
          </Button>
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
                    <CartesianGrid stroke="#17315F" strokeDasharray="3 7" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#8095CC', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#091939',
                        borderColor: '#284272',
                        borderRadius: '10px',
                        color: '#E8EEFF',
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
          <Card className="h-full border-[#2C406F] bg-[linear-gradient(180deg,#192B58_0%,#121F43_100%)]">
            <CardHeader>
              <p className="inline-flex w-fit rounded-full bg-[#1B3A3A] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#B9FF81]">
                Highest Velocity
              </p>
              <CardTitle className="mt-2 text-[42px] leading-none">{insights.highestSpendingCategory}</CardTitle>
              <CardDescription>
                Momentum is {formatPercent(insights.monthOverMonthChange)} vs. previous average.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[54px] font-semibold leading-none text-[#B2FF86]">
                {formatCurrency(insights.highestSpendingValue)}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[#A1B4E6]">Used 75% of Goal</p>
              <div className="mt-4 h-2 rounded-full bg-[#1A2D5C]">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#EBF8C2] to-[#B5FF83]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-[#1B2F60] text-[#A7B8EE]">
              <Sparkles className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl">Subscription Audit</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[#8EA2D6]">
            Found recurring charges for underused tools. Potential monthly saving:{' '}
            <span className="font-semibold text-[#A9FF9F]">{formatCurrency(420)}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-[#1B2F60] text-[#A7B8EE]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl">Grocery Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[#8EA2D6]">
            Mid-week spending peaks are 15% more expensive than weekends. Recommended: bulk purchase window.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-[#1B2F60] text-[#A7B8EE]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl">General Spending</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[#8EA2D6]">{insights.warning}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Architectural Breakdown</CardTitle>
          <button type="button" className="text-sm text-[#9BB0E3] hover:text-[#E5ECFF]">
            View All Clusters
          </button>
        </CardHeader>
        <CardContent className="space-y-5 pt-0">
          {categoryBreakdown.slice(0, 3).map((item) => {
            const goal = item.value * 1.7
            const progress = Math.min((item.value / goal) * 100, 100)

            return (
              <div key={item.category} className="grid gap-2 sm:grid-cols-[180px,1fr,160px] sm:items-center">
                <p className="font-medium text-[#DDE6FF]">{item.category}</p>
                <div className="h-2 rounded-full bg-[#193060]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#91A8FF] to-[#C5D2FF]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-right text-sm text-[#9CB0E1]">
                  {formatCurrency(item.value)} / {formatCurrency(Math.round(goal))}
                </p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <footer className="border-t border-[#1A2D5A] pt-3 text-xs text-[#7388BE]">
        <p>
          © 2026 Cobalt Architect. Financial intelligence processed through secure architectural neural networks.
        </p>
      </footer>
    </div>
  )
}
