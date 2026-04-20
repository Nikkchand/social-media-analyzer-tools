import { AlertTriangle } from 'lucide-react'
import { Button } from './button'

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isPending,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45"
        onClick={onCancel}
        aria-label="Close confirmation modal"
      />
      <div className="panel relative z-[81] w-full max-w-lg p-6 sm:p-7">
        <div className="inline-flex rounded-2xl bg-[var(--warning-soft)] p-3 text-amber-500">
          <AlertTriangle className="size-5" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold text-main">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant="secondary" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Deleting...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
