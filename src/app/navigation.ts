import {
  BarChart3,
  FileText,
  LayoutGrid,
  LineChart,
  Settings,
  Siren,
  Users,
} from 'lucide-react'

export const primaryNavigation = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/app/monitoring', label: 'Social Monitoring', icon: Siren },
  { to: '/app/competitors', label: 'Competitor Analysis', icon: Users },
  { to: '/app/trends', label: 'Trend Analysis', icon: LineChart },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/settings', label: 'Settings', icon: Settings },
] as const

export const secondaryNavigation = [
  { to: '/app/settings', label: 'Workspace Controls', icon: BarChart3 },
] as const
