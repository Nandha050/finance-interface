import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'

import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { InsightsView } from '@/components/dashboard/insights-view'
import { SettingsView } from '@/components/dashboard/settings-view'
import { TransactionFormDialog } from '@/components/dashboard/transaction-form-dialog'
import { TransactionsView } from '@/components/dashboard/transactions-view'
import { SidebarContent } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/topbar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CATEGORIES } from '@/data/mock-transactions'
import { applyTransactionFilters } from '@/lib/analytics'
import { downloadTextFile, formatDate } from '@/lib/format'
import { cn, uid } from '@/lib/utils'
import { useFinanceStore } from '@/store/use-finance-store'
import type { NavPage, Transaction } from '@/types/finance'

function filterTransactionsBySearch(transactions: Transaction[], query: string): Transaction[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return transactions
  }

  return transactions.filter((transaction) => {
    const searchableText = [
      transaction.description,
      transaction.category,
      transaction.note ?? '',
      transaction.type,
      formatDate(transaction.date),
      String(transaction.amount),
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(normalizedQuery)
  })
}

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
  const [pageSearchQueries, setPageSearchQueries] = useState<Record<Exclude<NavPage, 'transactions'>, string>>({
    dashboard: '',
    insights: '',
    settings: '',
  })

  const transactionPageTransactions = useMemo(
    () => applyTransactionFilters(transactions, filters),
    [transactions, filters],
  )
  const dashboardPageTransactions = useMemo(
    () => filterTransactionsBySearch(transactions, pageSearchQueries.dashboard),
    [transactions, pageSearchQueries.dashboard],
  )
  const insightsPageTransactions = useMemo(
    () => filterTransactionsBySearch(transactions, pageSearchQueries.insights),
    [transactions, pageSearchQueries.insights],
  )

  const activeSearchQuery =
    activePage === 'transactions'
      ? filters.searchQuery
      : activePage === 'dashboard'
        ? pageSearchQueries.dashboard
        : activePage === 'insights'
          ? pageSearchQueries.insights
          : pageSearchQueries.settings

  function handlePageSearchChange(value: string): void {
    if (activePage === 'transactions') {
      setSearchQuery(value)
      return
    }

    setPageSearchQueries((previous) => ({
      ...previous,
      [activePage]: value,
    }))
  }

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

  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let targetX = 0.5
    let targetY = 0.5
    let currentX = 0.5
    let currentY = 0.5
    let frame = 0

    root.style.setProperty('--pointer-x', '0.5')
    root.style.setProperty('--pointer-y', '0.5')

    const animate = () => {
      currentX += (targetX - currentX) * (reduceMotion ? 1 : 0.12)
      currentY += (targetY - currentY) * (reduceMotion ? 1 : 0.12)

      root.style.setProperty('--pointer-x', currentX.toFixed(4))
      root.style.setProperty('--pointer-y', currentY.toFixed(4))

      frame = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (clientX: number, clientY: number) => {
      targetX = Math.min(1, Math.max(0, clientX / window.innerWidth))
      targetY = Math.min(1, Math.max(0, clientY / window.innerHeight))
    }

    const onMouseMove = (event: MouseEvent) => {
      handlePointerMove(event.clientX, event.clientY)
    }

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) {
        handlePointerMove(touch.clientX, touch.clientY)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    frame = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  function openAddDialog(): void {
    if (role !== 'admin') {
      return
    }

    setSelectedTransaction(null)
    setDialogMode('add')
    setDialogOpen(true)
  }

  function openEditDialog(transaction: Transaction): void {
    if (role !== 'admin') {
      return
    }

    setSelectedTransaction(transaction)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  function handleDeleteTransaction(id: string): void {
    if (role !== 'admin') {
      return
    }

    const target = transactions.find((item) => item.id === id)
    const shouldDelete = window.confirm(
      `Delete transaction${target ? `: ${target.description}` : ''}? This action cannot be undone.`,
    )

    if (shouldDelete) {
      deleteTransaction(id)
    }
  }

  function handleSubmitTransaction(data: Omit<Transaction, 'id'>): void {
    if (role !== 'admin') {
      return
    }

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
    if (role !== 'admin') {
      return
    }

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

  function exportJsonWithData(data: Transaction[]): void {
    if (role !== 'admin') {
      return
    }

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
            transactions={dashboardPageTransactions}
            role={role}
            theme={theme}
            onAddTransaction={openAddDialog}
            onExportCSV={() => exportCsv(dashboardPageTransactions)}
            onExportJSON={() => exportJsonWithData(dashboardPageTransactions)}
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
            transactions={insightsPageTransactions}
            role={role}
            onExportCSV={() => exportCsv(insightsPageTransactions)}
            onExportJSON={() => exportJsonWithData(insightsPageTransactions)}
          />
        )}

        {activePage === 'settings' && (
          <SettingsView
            role={role}
            theme={theme}
            onThemeChange={setTheme}
            onResetData={() => {
              if (role !== 'admin') {
                return
              }

              resetTransactions()
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="fluid-stage h-[100svh] min-h-screen overflow-hidden text-[var(--text-primary)]">
      <div className="fluid-bg" aria-hidden>
        <div className="fluid-orb fluid-orb-primary" />
        <div className="fluid-orb fluid-orb-secondary" />
        <div className="fluid-orb fluid-orb-tertiary" />
        <div className="fluid-grid" />
      </div>

      <div className="relative z-[1] flex h-full w-full overflow-hidden">
        <aside
          className={cn(
            'hidden h-full w-[284px] p-2 lg:block',
            theme === 'light' ? 'bg-transparent' : 'bg-transparent',
          )}
        >
          <SidebarContent
            activePage={activePage}
            onSelectPage={setActivePage}
            theme={theme}
            className={cn(
              'h-[calc(100svh-1rem)] overflow-y-auto rounded-[24px] border shadow-[0_14px_40px_rgba(8,12,30,0.28)] backdrop-blur-xl',
              theme === 'light'
                ? 'border-[#D9E1EF] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(245,248,253,0.9)_100%)]'
                : 'border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(16,23,37,0.9)_0%,rgba(12,18,30,0.88)_100%)]',
            )}
          />
        </aside>

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar
            role={role}
            theme={theme}
            searchValue={activeSearchQuery}
            onSearchChange={handlePageSearchChange}
            onRoleChange={setRole}
            onThemeChange={setTheme}
            onOpenMobileNav={() => setMobileNavOpen(true)}
          />

          <div
            className={cn(
              'relative z-20 mx-2 mt-1 mb-2 rounded-xl border px-2.5 py-1.5 sm:mx-4 sm:rounded-2xl sm:px-3 sm:py-2 lg:hidden',
              theme === 'light' ? 'border-[#D9E0EB] bg-[#F7F9FC]/95' : 'border-[var(--surface-border-soft)] bg-[#101725]/88',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border p-1',
                  theme === 'light' ? 'border-[#D6DEEA] bg-white' : 'border-[var(--surface-border)] bg-[var(--surface-2)]',
                )}
              >
              {(['admin', 'viewer'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRole(mode)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition sm:px-3.5 ${
                    role === mode
                      ? theme === 'light'
                        ? 'bg-[#2F66F6] text-white'
                        : 'bg-[var(--accent-primary)] text-[#07161A]'
                      : theme === 'light'
                        ? 'bg-[#E8EDF7] text-[#627592] hover:text-[#2C3D57]'
                        : 'bg-[var(--btn-secondary-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {mode}
                </button>
              ))}
              </div>
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.08em] min-[360px]:inline sm:text-xs',
                  theme === 'light' ? 'text-[#7A8CA9]' : 'text-[var(--text-muted)]',
                )}
              >
                Role: {role}
              </span>
            </div>
          </div>

          <main className="w-full flex-1 overflow-y-auto px-2.5 py-3 sm:px-6 sm:py-6">
            <div className="mb-3 sm:hidden">
              <div className="relative min-w-0">
                <Search className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', theme === 'light' ? 'text-[#8A97AE]' : 'text-[var(--text-soft)]')} />
                <Input
                  value={activeSearchQuery}
                  onChange={(event) => handlePageSearchChange(event.target.value)}
                  placeholder="Search transactions..."
                  className="h-9 pl-9 text-sm"
                />
              </div>
            </div>
            {pageContent}
          </main>
        </div>
      </div>

      <Dialog open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent
          overlayClassName={theme === 'light' ? 'bg-[#DDE4F0]/96 backdrop-blur-none' : undefined}
          className={cn('max-w-[360px] p-0', theme === 'light' && 'border-[#D7DFEC] bg-[#F1F4F9]')}
        >
          <div className={cn('h-[80svh] overflow-y-auto', theme === 'light' && 'bg-[#F1F4F9]')}>
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
