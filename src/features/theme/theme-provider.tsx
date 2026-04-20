import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ThemeContext, type ThemeMode } from './theme-context'

const storageKey = 'sociolyzer-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(storageKey)

    if (stored === 'light' || stored === 'dark') {
      return stored
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    localStorage.setItem(storageKey, resolvedTheme)
  }, [resolvedTheme])

  const value = useMemo(
    () => ({
      resolvedTheme,
      setTheme: (theme: ThemeMode) => setResolvedTheme(theme),
      toggleTheme: () =>
        setResolvedTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
