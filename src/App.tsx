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
import { cn, uid } from '@/lib/utils'
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

  const transactionPageTransactions = useMemo(
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

  function exportCsv(data: Transaction[]): void {
    const headers = ['id', 'date', 'description', 'category', 'type', 'amount', 'note']
    const rows = data.map((transaction) =>
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
    downloadTextFile('finance-dashboard-export.json', JSON.stringify(transactions, null, 2))
  }

  function exportJsonWithData(data: Transaction[]): void {
    downloadTextFile('finance-dashboard-export.json', JSON.stringify(data, null, 2))
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
            transactions={transactions}
            role={role}
            onAddTransaction={openAddDialog}
            onExportCSV={() => exportCsv(transactions)}
            onExportJSON={exportJson}
          />
        )}

        {activePage === 'transactions' && (
          <TransactionsView
            role={role}
            filters={filters}
            categories={CATEGORIES}
            filteredTransactions={transactionPageTransactions}
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
            onExportCSV={() => exportCsv(transactionPageTransactions)}
            onExportJSON={() => exportJsonWithData(transactionPageTransactions)}
          />
        )}

        {activePage === 'insights' && (
          <InsightsView
            transactions={transactions}
            role={role}
            onExportCSV={() => exportCsv(transactions)}
            onExportJSON={exportJson}
          />
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
    <div className="min-h-screen bg-noise text-[var(--text-primary)]">
      <div className="flex min-h-screen w-full">
        <aside
          className={cn(
            'hidden w-[270px] border-r lg:block',
            theme === 'light' ? 'border-[#D9E0EB] bg-[#F1F4F9]' : 'border-[#1A2D5A] bg-[#06122E]/95',
          )}
        >
          <SidebarContent activePage={activePage} onSelectPage={setActivePage} theme={theme} />
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

          <div
            className={cn(
              'border-b px-3 py-2 sm:px-6 lg:hidden',
              theme === 'light' ? 'border-[#D9E0EB] bg-[#F7F9FC]' : 'border-[#1A2D59] bg-[#08183A]',
            )}
          >
            <div className="flex items-center gap-2">
              {(['admin', 'viewer'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRole(mode)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    role === mode
                      ? theme === 'light'
                        ? 'bg-[#2F66F6] text-white'
                        : 'bg-[#6E86FF] text-[#08153A]'
                      : theme === 'light'
                        ? 'bg-[#E8EDF7] text-[#627592] hover:text-[#2C3D57]'
                        : 'bg-[#142655] text-[#9DB1E2] hover:text-[#E7EDFF]'
                  }`}
                >
                  {mode}
                </button>
              ))}
              <span
                className={cn(
                  'ml-auto hidden text-[10px] uppercase tracking-[0.08em] min-[360px]:inline sm:text-xs',
                  theme === 'light' ? 'text-[#7A8CA9]' : 'text-[#8CA2D7]',
                )}
              >
                Role: {role}
              </span>
            </div>
          </div>

          <main className="w-full flex-1 px-2.5 py-3 sm:px-6 sm:py-6">{pageContent}</main>
        </div>
      </div>

      <Dialog open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent className="max-w-[360px] p-0">
          <div className="h-[80svh] overflow-y-auto">
            <SidebarContent
              activePage={activePage}
              theme={theme}
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
