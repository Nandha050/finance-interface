import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrencyCompact, formatPercent } from '@/lib/format'
import type { SummaryMetrics, ThemeMode } from '@/types/finance'

interface SummaryCardsProps {
  metrics: SummaryMetrics
  monthOverMonth: number
  theme: ThemeMode
}

export function SummaryCards({ metrics, monthOverMonth, theme }: SummaryCardsProps) {
  const isLight = theme === 'light'

  const toneStyles = {
    revenue: {
      panelDark: 'linear-gradient(180deg, rgba(18,66,77,0.92) 0%, rgba(11,43,57,0.58) 70%, rgba(11,43,57,0.12) 100%)',
      panelLight: 'linear-gradient(180deg, rgba(32,164,177,0.18) 0%, rgba(32,164,177,0.09) 70%, rgba(32,164,177,0.02) 100%)',
      dotDark: 'rgba(33, 197, 210, 0.48)',
      dotLight: 'rgba(37, 184, 198, 0.42)',
      barDark: '#21C5D2',
      barLight: '#25B8C6',
    },
    expense: {
      panelDark: 'linear-gradient(180deg, rgba(85,62,24,0.88) 0%, rgba(56,43,19,0.52) 70%, rgba(56,43,19,0.1) 100%)',
      panelLight: 'linear-gradient(180deg, rgba(227,179,60,0.2) 0%, rgba(227,179,60,0.1) 70%, rgba(227,179,60,0.03) 100%)',
      dotDark: 'rgba(228, 184, 72, 0.5)',
      dotLight: 'rgba(227, 179, 60, 0.45)',
      barDark: '#E4B848',
      barLight: '#E3B33C',
    },
    balance: {
      panelDark: 'linear-gradient(180deg, rgba(58,79,151,0.88) 0%, rgba(37,53,112,0.5) 70%, rgba(37,53,112,0.1) 100%)',
      panelLight: 'linear-gradient(180deg, rgba(79,124,255,0.18) 0%, rgba(79,124,255,0.1) 70%, rgba(79,124,255,0.03) 100%)',
      dotDark: 'rgba(138, 164, 255, 0.5)',
      dotLight: 'rgba(79, 124, 255, 0.42)',
      barDark: '#8AA4FF',
      barLight: '#4F7CFF',
    },
    savings: {
      panelDark: 'linear-gradient(180deg, rgba(44,89,64,0.86) 0%, rgba(27,62,44,0.5) 70%, rgba(27,62,44,0.1) 100%)',
      panelLight: 'linear-gradient(180deg, rgba(83,183,123,0.18) 0%, rgba(83,183,123,0.1) 70%, rgba(83,183,123,0.03) 100%)',
      dotDark: 'rgba(120, 212, 155, 0.5)',
      dotLight: 'rgba(83, 183, 123, 0.42)',
      barDark: '#78D49B',
      barLight: '#53B77B',
    },
  } as const

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrencyCompact(metrics.income),
      trend: 12.5,
      icon: Wallet2,
      tone: 'revenue' as const,
      fill: 86,
    },
    {
      title: 'Total Expenses',
      value: formatCurrencyCompact(metrics.expenses),
      trend: -18.2,
      icon: ArrowDownRight,
      tone: 'expense' as const,
      fill: 74,
    },
    {
      title: 'Net Balance',
      value: formatCurrencyCompact(metrics.totalBalance),
      trend: monthOverMonth,
      icon: ArrowUpRight,
      tone: 'balance' as const,
      fill: Math.min(90, Math.max(32, Math.round(Math.abs(monthOverMonth) * 3.5 + 42))),
    },
    {
      title: 'Savings Goal',
      value: `${Math.max(metrics.savingsRate, 0).toFixed(0)}%`,
      trend: 3.1,
      icon: PiggyBank,
      tone: 'savings' as const,
      fill: Math.min(92, Math.max(26, Math.round(metrics.savingsRate))),
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
          whileHover={{ y: -3 }}
        >
          {(() => {
            const styles = toneStyles[card.tone]

            return (
          <Card
            className={cn(
              'relative h-full overflow-hidden rounded-[26px] border shadow-[0_10px_26px_rgba(8,10,20,0.24)]',
              isLight
                ? 'border-[#D9E0EB] bg-[linear-gradient(160deg,#FFFFFF_0%,#F5F8FD_100%)]'
                : 'border-[#212A3B] bg-[linear-gradient(160deg,#171C24_0%,#1B212B_100%)]',
            )}
          >
            <div
              className="pointer-events-none absolute right-0 top-0 h-[72%] w-[34%] rounded-bl-[26px]"
              style={{
                background: isLight ? styles.panelLight : styles.panelDark,
              }}
            />

            <div
              className="pointer-events-none absolute right-4 top-2 h-24 w-20 opacity-95"
              style={{
                backgroundImage: `radial-gradient(${isLight ? styles.dotLight : styles.dotDark} 1.25px, transparent 1.25px)`,
                backgroundSize: '9px 9px',
                maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 85%, transparent 100%)',
              }}
            />

            <CardContent className="relative p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <p className={cn('text-base font-medium sm:text-[18px]', isLight ? 'text-[#263145]' : 'text-[#F3F6FF]')}>
                  {card.title}
                </p>
                <div
                  className={cn(
                    'grid h-10 w-10 place-items-center rounded-2xl border shadow-[0_6px_14px_rgba(5,10,25,0.2)] sm:h-11 sm:w-11',
                    isLight
                      ? 'border-[#D4DDEA] bg-[#EEF2F9] text-[#5B6B87]'
                      : 'border-[#40495D] bg-[#2C3342] text-[#D0D6E2]',
                  )}
                >
                  <card.icon className="h-4 w-4" />
                </div>
              </div>

              <p className={cn('mt-5 text-[2.6rem] font-semibold leading-none sm:text-[3rem]', isLight ? 'text-[#1D273A]' : 'text-[#F5F8FF]')}>
                {card.value}
              </p>

              <div className="mt-6 grid grid-cols-[repeat(46,minmax(0,1fr))] gap-[3px]">
                {Array.from({ length: 46 }, (_, seg) => {
                  const active = seg < Math.round((card.fill / 100) * 46)
                  return (
                    <span
                      key={`${card.title}-${seg}`}
                      className={cn(
                        'h-7 rounded-[2px]',
                        active ? undefined : isLight ? 'bg-[#D6DCE8]' : 'bg-[#363C47]',
                      )}
                      style={active ? { backgroundColor: isLight ? styles.barLight : styles.barDark } : undefined}
                    />
                  )
                })}
              </div>

              <p
                className={cn(
                  'mt-4 flex items-center gap-1.5 text-sm font-semibold',
                  card.trend >= 0 ? (isLight ? 'text-[#3D8D66]' : 'text-[#8DE0AE]') : isLight ? 'text-[#B66479]' : 'text-[#D98A9F]',
                )}
              >
                {card.trend >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {formatPercent(card.trend)}
                <span className={cn('font-medium', isLight ? 'text-[#6E7A90]' : 'text-[#A3ADBF]')}>
                  from last month
                </span>
              </p>
            </CardContent>
          </Card>
            )
          })()}
        </motion.div>
      ))}
    </div>
  )
}
