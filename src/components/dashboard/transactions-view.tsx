import { motion } from 'framer-motion'
import { ArrowRight, Download, Pencil, Plus, Trash2 } from 'lucide-react'

import { EmptyState } from '@/components/dashboard/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Role, SortOption, Transaction, TransactionFilters, TransactionType } from '@/types/finance'

interface TransactionsViewProps {
  role: Role
  filters: TransactionFilters
  categories: string[]
  filteredTransactions: Transaction[]
  totalTransactions: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onCategoryChange: (value: string) => void
  onTypeChange: (value: 'all' | TransactionType) => void
  onSortChange: (value: SortOption) => void
  onResetFilters: () => void
  onAddTransaction: () => void
  onEditTransaction: (transaction: Transaction) => void
  onDeleteTransaction: (id: string) => void
  onExportCSV: () => void
  onExportJSON: () => void
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'date-asc', label: 'Oldest' },
  { value: 'amount-desc', label: 'Amount High-Low' },
  { value: 'amount-asc', label: 'Amount Low-High' },
]

export function TransactionsView({
  role,
  filters,
  categories,
  filteredTransactions,
  totalTransactions,
  currentPage,
  itemsPerPage,
  onPageChange,
  onCategoryChange,
  onTypeChange,
  onSortChange,
  onResetFilters,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onExportCSV,
  onExportJSON,
}: TransactionsViewProps) {
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * itemsPerPage
  const currentRows = filteredTransactions.slice(start, start + itemsPerPage)

  const totalInflow = filteredTransactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
  const netFlow = filteredTransactions.reduce(
    (sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount),
    0,
  )

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-[34px] leading-none text-[#F0F4FF] sm:text-[42px]">Transactions</h1>
          <p className="mt-2 max-w-xl text-sm text-[#8EA2D6] sm:text-base">
            Detailed log of architectural resource allocation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-[#203766] bg-[#0C1A40] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#7F95CB]">Total Inflow</p>
            <p className="mt-1 text-[34px] font-semibold leading-none text-[#E8EEFF]">
              {formatCurrency(totalInflow)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#203766] bg-[#0C1A40] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#7F95CB]">Net Flow</p>
            <p className="mt-1 text-[34px] font-semibold leading-none text-[#9FB3FF]">
              {formatCurrency(netFlow)}
            </p>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={filters.category} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value: 'all' | TransactionType) => onTypeChange(value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary" className="gap-2">
                    <Download className="h-3.5 w-3.5" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onExportCSV}>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={onExportJSON}>Export as JSON</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {role === 'admin' && (
                <Button size="sm" className="gap-2" onClick={onAddTransaction}>
                  <Plus className="h-3.5 w-3.5" /> New Entry
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-3">
          {currentRows.length === 0 ? (
            <EmptyState
              title={totalTransactions === 0 ? 'No transactions yet' : 'No transactions found'}
              description={
                totalTransactions === 0
                  ? 'Add your first transaction to start tracking cash flow.'
                  : 'Try adjusting filters or reset your search criteria.'
              }
              actionLabel="Reset Filters"
              onAction={onResetFilters}
            />
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-xl border border-[#1C2F5E] md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-[#0F1E47] text-xs uppercase tracking-[0.12em] text-[#8298CC]">
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                      {role === 'admin' && <th className="px-4 py-3 font-medium text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((transaction) => (
                      <tr key={transaction.id} className="border-t border-[#162A56] text-[#D7E2FF] hover:bg-[#0C1B44]">
                        <td className="px-4 py-3 text-[#A8B7E2]">{formatDate(transaction.date)}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#E9F0FF]">{transaction.description}</p>
                          <p className="mt-0.5 text-xs text-[#8197CB]">{transaction.note || transaction.category}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="neutral">{transaction.category}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={transaction.type === 'income' ? 'income' : 'expense'}>
                            {transaction.type}
                          </Badge>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            transaction.type === 'income' ? 'text-[#A9FFA1]' : 'text-[#FF9AB6]'
                          }`}
                        >
                          {transaction.type === 'income'
                            ? `+${formatCurrency(transaction.amount)}`
                            : formatCurrency(-Math.abs(transaction.amount))}
                        </td>
                        {role === 'admin' && (
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onEditTransaction(transaction)}
                                aria-label="Edit transaction"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => onDeleteTransaction(transaction.id)}
                                aria-label="Delete transaction"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {currentRows.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[#1C2F5E] bg-[#0C1A40] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#E9F0FF]">{transaction.description}</p>
                        <p className="mt-1 text-xs text-[#8197CB]">{formatDate(transaction.date)}</p>
                      </div>
                      <p
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-[#A9FFA1]' : 'text-[#FF9AB6]'
                        }`}
                      >
                        {transaction.type === 'income'
                          ? `+${formatCurrency(transaction.amount)}`
                          : formatCurrency(-Math.abs(transaction.amount))}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="neutral">{transaction.category}</Badge>
                      {role === 'admin' && (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => onEditTransaction(transaction)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => onDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 text-sm text-[#8CA2D7] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {Math.min(start + 1, filteredTransactions.length)}-{Math.min(start + itemsPerPage, filteredTransactions.length)} of{' '}
                  {filteredTransactions.length} records
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => onPageChange(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => onPageChange(page)}
                      className={`h-9 w-9 rounded-lg text-sm transition ${
                        safePage === page
                          ? 'bg-[#8EA1FF] text-[#071539]'
                          : 'bg-[#122352] text-[#A9B8E2] hover:text-[#EAF0FF]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Growth Vector</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-[#8EA2D6]">
              Your infrastructure spending has stabilized while advisory revenue continues to rise. The current
              strategy indicates higher operational efficiency.
            </p>
            <div className="mt-5 h-2 rounded-full bg-[#183062]">
              <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-[#F4FFD3] to-[#8CA3FF]" />
            </div>
            <p className="mt-2 text-sm text-[#DCE5FF]">70% Efficiency</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-[#3E55BD] bg-[linear-gradient(160deg,#5F74E9_0%,#445FD9_100%)]">
          <CardContent className="p-6">
            <CardTitle className="text-white">Resource Analysis</CardTitle>
            <p className="mt-2 text-sm text-[#E9EEFF]">
              Generate a comprehensive export for board-level review.
            </p>
            <Button variant="secondary" className="mt-6 w-full bg-white text-[#253E90] hover:bg-[#EEF2FF]">
              Export Blueprint
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
