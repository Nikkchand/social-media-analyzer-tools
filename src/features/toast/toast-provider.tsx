import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { ToastContext, type ToastItem, type ToastTone } from './toast-context'

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 className="size-4" />,
  error: <TriangleAlert className="size-4" />,
  info: <Info className="size-4" />,
}

const toneClasses: Record<ToastTone, string> = {
  success: 'border-emerald-300/35 bg-emerald-500/10 text-main',
  error: 'border-rose-300/35 bg-rose-500/10 text-main',
  info: 'border-line bg-[var(--surface-strong)] text-main',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, ...toast }])
      window.setTimeout(() => removeToast(id), 4200)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(92vw,420px)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-3xl border p-4 shadow-2xl backdrop-blur ${toneClasses[toast.tone]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <span className="mt-0.5 text-[var(--accent)]">{toneIcon[toast.tone]}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-main">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm leading-6 text-muted">{toast.description}</p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="inline-flex size-8 items-center justify-center rounded-2xl surface-soft text-main"
                aria-label="Dismiss toast"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
