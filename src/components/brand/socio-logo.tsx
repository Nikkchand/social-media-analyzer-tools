import { Activity, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'

type SocioLogoProps = {
  compact?: boolean
}

export function SocioLogo({ compact = false }: SocioLogoProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative flex size-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#112031_0%,#0f766e_100%)] text-white shadow-lg shadow-black/15">
        <Activity className="size-5 opacity-90" />
        <div className="absolute right-1.5 top-1.5 rounded-full bg-white/15 p-1">
          <Sparkles className="size-2.5" />
        </div>
      </div>
      {!compact ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Social intelligence
          </p>
          <p className={clsx('text-lg font-semibold tracking-tight', 'text-main')}>
            SocioLyzer.web
          </p>
        </div>
      ) : null}
    </div>
  )
}
