import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { InsightsView } from '@/components/dashboard/insights-view'
import { SettingsView } from '@/components/dashboard/settings-view'
import { TransactionFormDialog } from '@/components/dashboard/transaction-form-dialog'
import { TransactionsView } from '@/components/dashboard/transactions-view'
import { SidebarContent } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/topbar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { CATEGORIES } from '@/data/mock-transactions'
import { applyTransactionFilters } from '@/lib/analytics'
import { downloadTextFile, formatDate } from '@/lib/format'
import { uid } from '@/lib/utils'
import { useFinanceStore } from '@/store/use-finance-store'
import type { Transaction } from '@/types/finance'

function App() {
  const {
    activePage,
    role,
    theme,
    transactions,
    filters,
    isLoading,
    currentPage,
    itemsPerPage,
    setActivePage,
    setRole,
    setTheme,
    setSearchQuery,
    setCategoryFilter,
    setTypeFilter,
    setSortBy,
    setCurrentPage,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetTransactions,
    setLoading,
  } = useFinanceStore()

  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const filteredTransactions = useMemo(
    () => applyTransactionFilters(transactions, filters),
    [transactions, filters],
  )

  useEffect(() => {
    if (!isLoading) {
      return
    }

    const timer = window.setTimeout(() => {
      setLoading(false)
    }, 850)

    return () => window.clearTimeout(timer)
  }, [isLoading, setLoading])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  function openAddDialog(): void {
    setSelectedTransaction(null)
    setDialogMode('add')
    setDialogOpen(true)
  }

  function openEditDialog(transaction: Transaction): void {
    setSelectedTransaction(transaction)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  function handleDeleteTransaction(id: string): void {
    const target = transactions.find((item) => item.id === id)
    const shouldDelete = window.confirm(
      `Delete transaction${target ? `: ${target.description}` : ''}? This action cannot be undone.`,
    )

    if (shouldDelete) {
      deleteTransaction(id)
    }
  }

  function handleSubmitTransaction(data: Omit<Transaction, 'id'>): void {
    if (dialogMode === 'edit' && selectedTransaction) {
      updateTransaction(selectedTransaction.id, data)
      return
    }

    addTransaction({
      ...data,
      id: uid('txn'),
    })
  }

  function exportCsv(): void {
    const headers = ['id', 'date', 'description', 'category', 'type', 'amount', 'note']
    const rows = filteredTransactions.map((transaction) =>
      [
        transaction.id,
        formatDate(transaction.date),
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.amount,
        transaction.note ?? '',
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(','),
    )

    const csv = [headers.join(','), ...rows].join('\n')
    downloadTextFile('finance-dashboard-export.csv', csv)
  }

  function exportJson(): void {
    downloadTextFile('finance-dashboard-export.json', JSON.stringify(filteredTransactions, null, 2))
  }

  const pageContent = isLoading ? (
    <DashboardSkeleton />
  ) : (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePage}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {activePage === 'dashboard' && (
          <DashboardView
            transactions={filteredTransactions}
            role={role}
            onAddTransaction={openAddDialog}
            onExportCSV={exportCsv}
            onExportJSON={exportJson}
          />
        )}

        {activePage === 'transactions' && (
          <TransactionsView
            role={role}
            filters={filters}
            categories={CATEGORIES}
            filteredTransactions={filteredTransactions}
            totalTransactions={transactions.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onCategoryChange={setCategoryFilter}
            onTypeChange={setTypeFilter}
            onSortChange={setSortBy}
            onResetFilters={resetFilters}
            onAddTransaction={openAddDialog}
            onEditTransaction={openEditDialog}
            onDeleteTransaction={handleDeleteTransaction}
            onExportCSV={exportCsv}
            onExportJSON={exportJson}
          />
        )}

        {activePage === 'insights' && (
          <InsightsView transactions={filteredTransactions} onExportCSV={exportCsv} onExportJSON={exportJson} />
        )}

        {activePage === 'settings' && (
          <SettingsView
            role={role}
            theme={theme}
            onThemeChange={setTheme}
            onResetData={resetTransactions}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-noise text-[#EAF0FF]">
      <div className="mx-auto flex min-h-screen max-w-[1520px]">
        <aside className="hidden w-[270px] border-r border-[#1A2D5A] bg-[#06122E]/95 lg:block">
          <SidebarContent activePage={activePage} onSelectPage={setActivePage} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            role={role}
            theme={theme}
            searchValue={filters.searchQuery}
            onSearchChange={setSearchQuery}
            onRoleChange={setRole}
            onThemeChange={setTheme}
            onOpenMobileNav={() => setMobileNavOpen(true)}
          />

          <div className="border-b border-[#1A2D59] bg-[#08183A] px-4 py-2 sm:px-6 lg:hidden">
            <div className="flex items-center gap-2">
              {(['admin', 'viewer'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRole(mode)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    role === mode
                      ? 'bg-[#6E86FF] text-[#08153A]'
                      : 'bg-[#142655] text-[#9DB1E2] hover:text-[#E7EDFF]'
                  }`}
                >
                  {mode}
                </button>
              ))}
              <span className="ml-auto text-xs uppercase tracking-[0.08em] text-[#8CA2D7]">Role: {role}</span>
            </div>
          </div>

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{pageContent}</main>
        </div>
      </div>

      <Dialog open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent className="max-w-[360px] p-0">
          <div className="h-[80svh] overflow-y-auto">
            <SidebarContent
              activePage={activePage}
              onSelectPage={(page) => {
                setActivePage(page)
                setMobileNavOpen(false)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <TransactionFormDialog
        key={`${dialogMode}-${selectedTransaction?.id ?? 'new'}`}
        open={isDialogOpen}
        mode={dialogMode}
        categories={CATEGORIES}
        transaction={selectedTransaction}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitTransaction}
      />
    </div>
  )
}

export default App
