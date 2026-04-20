import { clsx } from 'clsx'
import type { SupportedPlatform } from '../../types/workspace'

type PlatformPillProps = {
  platform: SupportedPlatform
}

const platformStyles: Record<SupportedPlatform, string> = {
  instagram: 'bg-pink-50 text-pink-700',
  youtube: 'bg-red-50 text-red-700',
  tiktok: 'bg-slate-900 text-white',
  x: 'bg-sky-50 text-sky-700',
  linkedin: 'bg-blue-50 text-blue-700',
  facebook: 'bg-indigo-50 text-indigo-700',
  threads: 'bg-zinc-100 text-zinc-800',
  unknown: 'bg-slate-100 text-slate-700',
}

export function PlatformPill({ platform }: PlatformPillProps) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
        platformStyles[platform],
      )}
    >
      {platform}
    </span>
  )
}
