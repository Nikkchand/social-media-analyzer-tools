import { MoonStar, SunMedium } from 'lucide-react'
import { useTheme } from '../../features/theme/use-theme'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-2xl border border-line surface-soft px-4 py-2.5 text-sm font-semibold text-main transition hover:translate-y-[-1px]"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <MoonStar className="size-4 text-[var(--accent)]" />
      ) : (
        <SunMedium className="size-4 text-[var(--accent)]" />
      )}
      {resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode'}
    </button>
  )
}
