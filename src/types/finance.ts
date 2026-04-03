export type Role = 'viewer' | 'admin'

export type NavPage = 'dashboard' | 'transactions' | 'insights' | 'settings'

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: TransactionType
  note?: string
}

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc'

export interface TransactionFilters {
  searchQuery: string
  category: string
  type: 'all' | TransactionType
  sortBy: SortOption
}

export type ThemeMode = 'light' | 'dark'

export interface SummaryMetrics {
  totalBalance: number
  income: number
  expenses: number
  savingsRate: number
}

export interface InsightData {
  highestSpendingCategory: string
  highestSpendingValue: number
  monthOverMonthChange: number
  observation: string
  warning: string
}
