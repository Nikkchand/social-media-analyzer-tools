import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    fullWidth?: boolean
  }
>

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--surface-dark)] text-white shadow-lg shadow-black/15 hover:-translate-y-0.5',
  secondary:
    'bg-[var(--accent)] text-white shadow-lg shadow-emerald-950/10 hover:-translate-y-0.5',
  ghost:
    'border border-line bg-[var(--surface-strong)] text-main hover:-translate-y-0.5 hover:bg-[var(--surface-soft)]',
}

export function Button({
  children,
  className,
  fullWidth,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
