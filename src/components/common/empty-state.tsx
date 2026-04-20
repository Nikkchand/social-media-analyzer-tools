type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-line surface-soft p-8 text-center">
      <h3 className="text-lg font-semibold text-main">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </div>
  )
}
