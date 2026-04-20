type InsightListProps = {
  title: string
  items: string[]
  tone?: 'default' | 'warning'
}

export function InsightList({ title, items, tone = 'default' }: InsightListProps) {
  return (
    <section
      className={`panel p-5 sm:p-6 ${
        tone === 'warning' ? 'border-amber-200 bg-amber-50/70' : ''
      }`}
    >
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm leading-6 text-slate/80"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}
