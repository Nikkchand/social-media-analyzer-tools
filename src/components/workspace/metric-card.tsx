import type { ReactNode } from 'react'

type MetricCardProps = {
  label: string
  value: string
  helper: string
  icon: ReactNode
}

export function MetricCard({ label, value, helper, icon }: MetricCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-main">{value}</p>
        </div>
        <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{helper}</p>
    </div>
  )
}
