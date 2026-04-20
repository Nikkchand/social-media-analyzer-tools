import type { ReactNode } from 'react'

type ChartCardProps = {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}

export function ChartCard({ title, description, action, children }: ChartCardProps) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate/80">{description}</p>
        </div>
        {action}
      </div>
      <div className="h-72">{children}</div>
    </section>
  )
}
