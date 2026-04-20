import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

type SidebarNavProps = {
  items: readonly NavItem[]
  onNavigate?: () => void
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'border border-line bg-[var(--surface-strong)] text-main shadow-lg shadow-black/10'
                  : 'text-muted hover:bg-[var(--sidebar-hover)] hover:text-main',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={clsx(
                    'inline-flex size-9 items-center justify-center rounded-2xl transition',
                    isActive
                      ? 'bg-[var(--accent)] text-white shadow-lg shadow-black/10'
                      : 'surface-soft text-[var(--accent)]',
                  )}
                >
                  <Icon className="size-4.5" />
                </span>
                <span className={clsx('min-w-0 truncate', isActive && 'text-main')}>{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
