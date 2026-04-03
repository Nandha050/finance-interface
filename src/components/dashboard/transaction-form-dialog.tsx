import { type FormEvent, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Transaction } from '@/types/finance'

interface TransactionFormDialogProps {
  open: boolean
  mode: 'add' | 'edit'
  categories: string[]
  transaction?: Transaction | null
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Transaction, 'id'>) => void
}

const baseForm = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  category: 'Consulting',
  amount: 0,
  type: 'expense' as const,
  note: '',
}

export function TransactionFormDialog({
  open,
  mode,
  categories,
  transaction,
  onOpenChange,
  onSubmit,
}: TransactionFormDialogProps) {
  const cleanedCategories = useMemo(
    () => categories.filter((category) => category !== 'All Categories'),
    [categories],
  )

  const initialForm = {
    date: transaction?.date ?? baseForm.date,
    description: transaction?.description ?? '',
    category: transaction?.category ?? cleanedCategories[0] ?? 'Consulting',
    amount: transaction?.amount ?? 0,
    type: transaction?.type ?? ('expense' as const),
    note: transaction?.note ?? '',
  }

  const [form, setForm] = useState(initialForm)

  const isInvalid = !form.description.trim() || !form.date || form.amount <= 0

  function submitForm(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (isInvalid) {
      return
    }

    onSubmit({
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      amount: form.amount,
      type: form.type,
      note: form.note.trim(),
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}</DialogTitle>
          <DialogDescription>
            Maintain your finance ledger with clean, accurate transaction entries.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={submitForm}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#89A0D7]">Date</p>
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#89A0D7]">Amount</p>
              <Input
                type="number"
                min={1}
                value={form.amount || ''}
                onChange={(event) => setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))}
                placeholder="Amount"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#89A0D7]">Description</p>
            <Input
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Transaction title"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#89A0D7]">Category</p>
              <Select
                value={form.category}
                onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {cleanedCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#89A0D7]">Type</p>
              <Select
                value={form.type}
                onValueChange={(value: 'income' | 'expense') =>
                  setForm((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#89A0D7]">Note (Optional)</p>
            <Textarea
              value={form.note}
              onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
              placeholder="Add a short note"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isInvalid}>
              {mode === 'add' ? 'Create Entry' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
