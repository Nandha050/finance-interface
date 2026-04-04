import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Cloud, MonitorSmartphone, ReceiptText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [historyType, setHistoryType] = useState<'all' | 'income' | 'expense'>('all')
  const [historyCategory, setHistoryCategory] = useState('all')

  const latest = transactions.slice(0, 4)
  const fullHistory = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [transactions],
  )

  const categories = useMemo(
    () => ['all', ...new Set(fullHistory.map((item) => item.category))],
    [fullHistory],
  )

  const filteredHistory = useMemo(() => {
    const normalizedQuery = historySearch.trim().toLowerCase()

    return fullHistory.filter((item) => {
      if (historyType !== 'all' && item.type !== historyType) {
        return false
      }

      if (historyCategory !== 'all' && item.category !== historyCategory) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      return `${item.description} ${item.category}`.toLowerCase().includes(normalizedQuery)
    })
  }, [fullHistory, historyCategory, historySearch, historyType])

  const netFlow = filteredHistory.reduce(
    (sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount),
    0,
  )

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-xl sm:text-2xl">Recent Activity</CardTitle>
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="shrink-0 text-xs text-[#9CB0E4] transition hover:text-[#E6EDFF] sm:text-sm"
              >
                <span className="sm:hidden">View History</span>
                <span className="hidden sm:inline">View All History</span>
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {latest.map((transaction) => {
                const Icon = iconByCategory[transaction.category] ?? ReceiptText
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-2.5 sm:items-start sm:gap-3 sm:p-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5 sm:items-start sm:gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--btn-secondary-bg)] text-[var(--text-primary)] sm:h-9 sm:w-9">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)] sm:text-[1rem]">
                          {transaction.description}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-base font-semibold leading-none sm:text-[1.35rem] ${
                          transaction.type === 'income' ? 'text-[#A9FFA1]' : 'text-[#FF9AB6]'
                        }`}
                      >
                        {transaction.type === 'income'
                          ? `+${formatCurrency(transaction.amount)}`
                          : formatCurrency(-Math.abs(transaction.amount))}
                      </p>
                      <Badge
                        variant={transaction.type === 'income' ? 'income' : 'expense'}
                        className="mt-1 px-2 py-0.5 text-[9px] sm:px-2.5 sm:py-1 sm:text-[10px]"
                      >
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
          <Card className="upgrade-card overflow-hidden border-[var(--surface-border)]">
            <CardContent className="relative p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.2)_0%,transparent_46%)]" />
              <p className="relative text-[30px] font-semibold leading-none text-[var(--text-primary)]">Elevate Your Architecture</p>
              <p className="relative mt-3 text-sm text-[var(--text-muted)]">
                Unlock advanced predictive modeling and unlimited vault storage.
              </p>
              <button
                type="button"
                className="upgrade-card-button relative mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition"
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
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-income)]" /> Global Vaults Online
                </p>
                <span>99.9%</span>
              </div>
              <p className="mt-4 text-xs text-[var(--text-soft)]">12 active collaborators</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="w-[min(96vw,980px)] max-w-[980px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-[2rem]">Total Activity History</DialogTitle>
          </DialogHeader>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Input
              value={historySearch}
              onChange={(event) => setHistorySearch(event.target.value)}
              placeholder="Search by description or category"
              className="sm:col-span-1"
            />

            <Select value={historyType} onValueChange={(value: 'all' | 'income' | 'expense') => setHistoryType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={historyCategory} onValueChange={setHistoryCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-muted)]">
            <p>
              Total Entries: {filteredHistory.length}
              {filteredHistory.length !== fullHistory.length ? ` of ${fullHistory.length}` : ''}
            </p>
            <p>
              Net Flow:{' '}
              <span className={netFlow >= 0 ? 'text-[#A9FFA1]' : 'text-[#FF9AB6]'}>
                {formatCurrency(netFlow)}
              </span>
            </p>
          </div>

          <div className="mt-3 max-h-[62svh] space-y-2 overflow-y-auto pr-1">
            {filteredHistory.map((transaction) => {
              const Icon = iconByCategory[transaction.category] ?? ReceiptText

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-2.5 sm:p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--btn-secondary-bg)] text-[var(--text-primary)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--text-primary)]">{transaction.description}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {formatDate(transaction.date)} · {transaction.category}
                      </p>
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

            {filteredHistory.length === 0 && (
              <div className="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-2)] p-5 text-center text-sm text-[var(--text-muted)]">
                No entries match your current search and filters.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
