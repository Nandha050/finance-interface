import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { SummaryMetrics } from '@/types/finance'

interface SummaryCardsProps {
  metrics: SummaryMetrics
  monthOverMonth: number
}

export function SummaryCards({ metrics, monthOverMonth }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(metrics.totalBalance),
      trend: monthOverMonth,
      icon: Wallet2,
      accent: 'text-[#9FB2FF] bg-[#1A2C5F]',
      trendColor: monthOverMonth >= 0 ? 'text-[#A8FF9A]' : 'text-[#FF9EBB]',
    },
    {
      title: 'Total Income',
      value: formatCurrency(metrics.income),
      trend: 12.4,
      icon: ArrowUpRight,
      accent: 'text-[#ABFF9F] bg-[#123A2A]',
      trendColor: 'text-[#A8FF9A]',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(-Math.abs(metrics.expenses)),
      trend: -5.2,
      icon: ArrowDownRight,
      accent: 'text-[#FF9FC2] bg-[#311A33]',
      trendColor: 'text-[#FF9EBB]',
    },
    {
      title: 'Savings Goal',
      value: `${Math.max(metrics.savingsRate, 0).toFixed(0)}%`,
      trend: 3.1,
      icon: PiggyBank,
      accent: 'text-[#C3CFFF] bg-[#1A2A58]',
      trendColor: 'text-[#A8FF9A]',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
          whileHover={{ y: -3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${card.accent}`}>
                  <card.icon className="h-4 w-4" />
                </div>
                <p className={`text-xs font-semibold ${card.trendColor}`}>
                  {formatPercent(card.trend)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#7E93C8]">{card.title}</p>
              <CardTitle className="mt-1.5 text-[30px] leading-none sm:text-[28px]">{card.value}</CardTitle>
              <div className="mt-4 h-1.5 w-2/3 rounded-full bg-[#1B2F61]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8AA4FF] to-[#C6D3FF]"
                  style={{ width: `${Math.min(Math.max(Math.abs(card.trend) * 5, 20), 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
