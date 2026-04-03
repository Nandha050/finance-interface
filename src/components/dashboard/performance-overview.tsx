import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrencyCompact } from '@/lib/format'

interface PerformanceOverviewProps {
  trend: Array<{ month: string; balance: number; income: number; expenses: number }>
  categoryData: Array<{ category: string; value: number; share: number }>
}

const PERIODS = [
  { label: '1Y', value: 12 },
  { label: '6M', value: 6 },
  { label: '3M', value: 3 },
] as const

const PIE_COLORS = ['#9BAEFF', '#B9FF81', '#FF7FA8', '#64C8FF', '#FFC874']

export function PerformanceOverview({ trend, categoryData }: PerformanceOverviewProps) {
  const [period, setPeriod] = useState<number>(12)

  const visibleTrend = useMemo(() => trend.slice(-period), [period, trend])

  const totalSpending = categoryData.reduce((total, item) => total + item.value, 0)

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card>
          <CardHeader className="flex flex-col items-start justify-between gap-3 pb-2 sm:flex-row">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription className="text-sm leading-6">Equity and liquidity growth over selected months</CardDescription>
            </div>
            <div className="flex items-center rounded-xl border border-[#1F3364] bg-[#0D1A40] p-1">
              {PERIODS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                    period === item.value
                      ? 'bg-[#6E86FF] text-[#081539]'
                      : 'text-[#91A6D8] hover:text-[#E1E9FF]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[220px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibleTrend} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8EA4FF" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#8EA4FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#17315F" strokeDasharray="2 8" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#7F95CB', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, 'dataMax + 12000']} />
                  <Tooltip
                    cursor={{ stroke: '#4F6EC3', strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: '#091939',
                      borderColor: '#284272',
                      borderRadius: '10px',
                      color: '#E8EEFF',
                    }}
                    formatter={(value) => [formatCurrencyCompact(Number(value ?? 0)), 'Balance']}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#9FB2FF"
                    strokeWidth={2.2}
                    fill="url(#balanceGradient)"
                    dot={{ fill: '#AFC0FF', strokeWidth: 0, r: 2.8 }}
                    activeDot={{ r: 4.5, fill: '#DDE5FF' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}>
        <Card className="h-full">
          <CardHeader className="pb-1">
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription className="text-sm leading-6">Structural distribution of capital</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="mx-auto h-[180px] w-[180px] sm:h-[220px] sm:w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={78}
                    stroke="none"
                    paddingAngle={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#091939',
                      borderColor: '#284272',
                      borderRadius: '10px',
                      color: '#E8EEFF',
                    }}
                    formatter={(value) => [formatCurrencyCompact(Number(value ?? 0)), 'Spend']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="-mt-2 text-center">
              <p className="text-[2rem] font-semibold leading-none text-[var(--text-primary)] sm:text-[30px]">
                {formatCurrencyCompact(totalSpending)}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--text-soft)] sm:text-[11px]">Total</p>
            </div>

            <div className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
              {categoryData.slice(0, 3).map((item, index) => (
                <div key={item.category} className="flex items-center justify-between text-[0.96rem] sm:text-sm">
                  <p className="flex items-center gap-2 text-[var(--text-muted)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    {item.category}
                  </p>
                  <p className="font-medium text-[var(--text-primary)]">{Math.round(item.share)}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
