import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--surface-soft)] text-main',
  accent: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: PropsWithChildren<{ tone?: BadgeTone; className?: string }>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
