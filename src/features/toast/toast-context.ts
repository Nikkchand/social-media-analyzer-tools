import { createContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  title: string
  description?: string
  tone: ToastTone
}

export type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, 'id'>) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
