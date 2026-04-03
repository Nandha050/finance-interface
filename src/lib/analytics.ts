import type {
  InsightData,
  SummaryMetrics,
  Transaction,
  TransactionFilters,
} from '@/types/finance'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function applyTransactionFilters(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const normalizedSearch = filters.searchQuery.trim().toLowerCase()

  return [...transactions]
    .filter((transaction) => {
      if (filters.category !== 'All Categories' && transaction.category !== filters.category) {
        return false
      }

      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const searchable = [transaction.description, transaction.category, transaction.note ?? '']
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalizedSearch)
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'amount-desc':
          return b.amount - a.amount
        case 'amount-asc':
          return a.amount - b.amount
        case 'date-desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })
}

export function getSummaryMetrics(transactions: Transaction[]): SummaryMetrics {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0)

  const expenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0)

  const totalBalance = income - expenses
  const savingsRate = income === 0 ? 0 : (totalBalance / income) * 100

  return { totalBalance, income, expenses, savingsRate }
}

export function getMonthlyTrend(transactions: Transaction[]): Array<{
  month: string
  income: number
  expenses: number
  net: number
  balance: number
}> {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const grouped = new Map<string, { income: number; expenses: number }>()

  for (const transaction of sorted) {
    const date = new Date(transaction.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`

    if (!grouped.has(key)) {
      grouped.set(key, { income: 0, expenses: 0 })
    }

    const current = grouped.get(key)
    if (!current) {
      continue
    }

    if (transaction.type === 'income') {
      current.income += transaction.amount
    } else {
      current.expenses += transaction.amount
    }
  }

  let runningBalance = 0
  return Array.from(grouped.entries())
    .slice(-12)
    .map(([key, values]) => {
      const [, monthIndex] = key.split('-')
      const net = values.income - values.expenses
      runningBalance += net

      return {
        month: MONTH_LABELS[Number(monthIndex)] ?? key,
        income: values.income,
        expenses: values.expenses,
        net,
        balance: runningBalance,
      }
    })
}

export function getCategoryBreakdown(transactions: Transaction[]): Array<{
  category: string
  value: number
  share: number
}> {
  const expenses = transactions.filter((item) => item.type === 'expense')
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0)

  const grouped = new Map<string, number>()

  for (const transaction of expenses) {
    grouped.set(transaction.category, (grouped.get(transaction.category) ?? 0) + transaction.amount)
  }

  return Array.from(grouped.entries())
    .map(([category, value]) => ({
      category,
      value,
      share: totalExpense === 0 ? 0 : (value / totalExpense) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

export function getInsights(transactions: Transaction[]): InsightData {
  const summary = getSummaryMetrics(transactions)
  const categoryBreakdown = getCategoryBreakdown(transactions)
  const monthly = getMonthlyTrend(transactions)

  const highestSpendingCategory = categoryBreakdown[0]?.category ?? 'No category'
  const highestSpendingValue = categoryBreakdown[0]?.value ?? 0

  const currentMonth = monthly[monthly.length - 1]?.expenses ?? 0
  const previousMonth = monthly[monthly.length - 2]?.expenses ?? 0
  const monthOverMonthChange =
    previousMonth === 0 ? 0 : ((currentMonth - previousMonth) / previousMonth) * 100

  const observation =
    summary.savingsRate >= 40
      ? 'Strong cash efficiency with healthy retained earnings this cycle.'
      : 'Cash flow remains stable, but expense concentration can be optimized.'

  const warning =
    monthOverMonthChange > 20
      ? 'Spending accelerated materially month-over-month. Review discretionary categories.'
      : 'Current spend trajectory is within healthy operational boundaries.'

  return {
    highestSpendingCategory,
    highestSpendingValue,
    monthOverMonthChange,
    observation,
    warning,
  }
}
