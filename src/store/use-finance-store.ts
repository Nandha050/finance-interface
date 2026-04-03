import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { MOCK_TRANSACTIONS } from '@/data/mock-transactions'
import type {
  NavPage,
  Role,
  SortOption,
  ThemeMode,
  Transaction,
  TransactionFilters,
  TransactionType,
} from '@/types/finance'

interface FinanceState {
  activePage: NavPage
  role: Role
  theme: ThemeMode
  transactions: Transaction[]
  filters: TransactionFilters
  isLoading: boolean
  currentPage: number
  itemsPerPage: number
  setActivePage: (page: NavPage) => void
  setRole: (role: Role) => void
  setTheme: (theme: ThemeMode) => void
  setSearchQuery: (searchQuery: string) => void
  setCategoryFilter: (category: string) => void
  setTypeFilter: (type: 'all' | TransactionType) => void
  setSortBy: (sortBy: SortOption) => void
  setCurrentPage: (page: number) => void
  setLoading: (value: boolean) => void
  resetFilters: () => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  resetTransactions: () => void
}

const initialFilters: TransactionFilters = {
  searchQuery: '',
  category: 'All Categories',
  type: 'all',
  sortBy: 'date-desc',
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      activePage: 'dashboard',
      role: 'admin',
      theme: 'dark',
      transactions: MOCK_TRANSACTIONS,
      filters: initialFilters,
      isLoading: true,
      currentPage: 1,
      itemsPerPage: 5,
      setActivePage: (activePage) => set({ activePage }),
      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      setSearchQuery: (searchQuery) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery },
          currentPage: 1,
        })),
      setCategoryFilter: (category) =>
        set((state) => ({
          filters: { ...state.filters, category },
          currentPage: 1,
        })),
      setTypeFilter: (type) =>
        set((state) => ({
          filters: { ...state.filters, type },
          currentPage: 1,
        })),
      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy },
          currentPage: 1,
        })),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setLoading: (isLoading) => set({ isLoading }),
      resetFilters: () => set({ filters: initialFilters, currentPage: 1 }),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      updateTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((item) =>
            item.id === id ? { ...transaction, id } : item,
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((item) => item.id !== id),
        })),
      resetTransactions: () =>
        set({
          transactions: MOCK_TRANSACTIONS,
          filters: initialFilters,
          currentPage: 1,
        }),
    }),
    {
      name: 'finance-dashboard-store',
      partialize: (state) => ({
        role: state.role,
        theme: state.theme,
        transactions: state.transactions,
        filters: state.filters,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false
        }
      },
    },
  ),
)
