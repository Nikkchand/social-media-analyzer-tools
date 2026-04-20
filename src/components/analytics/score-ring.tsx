type ScoreRingProps = {
  score: number
  label: string
}

export function ScoreRing({ score, label }: ScoreRingProps) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (Math.max(0, Math.min(score, 100)) / 100) * circumference

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-24">
        <svg className="size-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(15, 118, 110, 0.12)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#0f766e"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <div className="text-2xl font-semibold text-ink">{score}</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate/70">
              score
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate/65">{label}</p>
        <p className="mt-2 text-sm leading-6 text-slate/80">
          Weighted from engagement, sentiment, and workspace breadth.
        </p>
      </div>
    </div>
  )
}
