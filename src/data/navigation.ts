import {
  BarChart3,
  LayoutDashboard,
  Settings,
  SplitSquareVertical,
} from 'lucide-react'

import type { NavPage } from '@/types/finance'

export interface NavItem {
  label: string
  page: NavPage
  icon: typeof LayoutDashboard
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
  { label: 'Transactions', page: 'transactions', icon: SplitSquareVertical },
  { label: 'Insights', page: 'insights', icon: BarChart3 },
  { label: 'Settings', page: 'settings', icon: Settings },
]
