export function LoadingSkeleton({ className = 'h-24' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl border border-line surface-soft ${className}`}
    />
  )
}
