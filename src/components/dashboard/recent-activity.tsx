import { motion } from 'framer-motion'
import { Cloud, MonitorSmartphone, ReceiptText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Transaction } from '@/types/finance'

interface RecentActivityProps {
  transactions: Transaction[]
}

const iconByCategory: Record<string, typeof Cloud> = {
  Infrastructure: Cloud,
  Software: MonitorSmartphone,
  Consulting: ReceiptText,
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const latest = transactions.slice(0, 4)

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Recent Activity</CardTitle>
            <button type="button" className="text-sm text-[#9CB0E4] transition hover:text-[#E6EDFF]">
              View All History
            </button>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {latest.map((transaction) => {
              const Icon = iconByCategory[transaction.category] ?? ReceiptText
              return (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-[#1A2D5B] bg-[#0A1739]/80 p-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#172A57] text-[#A9BAF1]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#E7EEFF]">{transaction.description}</p>
                      <p className="mt-0.5 text-xs text-[#8BA1D7]">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'income' ? 'text-[#A9FFA1]' : 'text-[#FF9AB6]'
                      }`}
                    >
                      {transaction.type === 'income'
                        ? `+${formatCurrency(transaction.amount)}`
                        : formatCurrency(-Math.abs(transaction.amount))}
                    </p>
                    <Badge variant={transaction.type === 'income' ? 'income' : 'expense'} className="mt-1">
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <Card className="overflow-hidden border-[#3E55BD] bg-[linear-gradient(170deg,#6F88FF_0%,#4A66E7_100%)]">
          <CardContent className="p-6">
            <p className="text-[30px] font-semibold leading-none text-white">Elevate Your Architecture</p>
            <p className="mt-3 text-sm text-[#EAF0FF]">
              Unlock advanced predictive modeling and unlimited vault storage.
            </p>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-[#0E1E4D] px-4 py-3 text-sm font-semibold text-[#D9E3FF] transition hover:bg-[#14295E]"
            >
              Upgrade Plan
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Network Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm text-[#B7C6EF]">
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#A8FF9A]" /> Global Vaults Online
              </p>
              <span>99.9%</span>
            </div>
            <p className="mt-4 text-xs text-[#8197CB]">12 active collaborators</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
