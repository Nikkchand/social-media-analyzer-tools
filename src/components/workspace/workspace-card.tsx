import { CalendarDays, FolderKanban, Link as LinkIcon } from 'lucide-react'
import type { WorkspaceWithProfiles } from '../../types/workspace'
import { formatDate } from '../../lib/date'
import { PlatformPill } from './platform-pill'

type WorkspaceCardProps = {
  workspace: WorkspaceWithProfiles
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <article className="panel p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate/75">
            <FolderKanban className="size-3.5" />
            {workspace.status}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-ink">{workspace.name}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate/80">
            {workspace.description || 'No description yet. Ready for analytics enrichment.'}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-lagoon">
          {workspace.profileCount} tracked {workspace.profileCount === 1 ? 'profile' : 'profiles'}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {workspace.profiles.map((profile) => (
          <div
            key={profile.id}
            className="rounded-2xl border border-slate-100 bg-white px-3 py-2 text-sm text-slate/80"
          >
            <div className="mb-2 flex items-center gap-2">
              <PlatformPill platform={profile.platform} />
              <span className="font-medium text-ink">{profile.handle || 'Detected profile'}</span>
            </div>
            <div className="flex items-center gap-2 break-all text-xs">
              <LinkIcon className="size-3.5 shrink-0" />
              <span>{profile.url}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate/75">
        <div className="inline-flex items-center gap-2">
          <CalendarDays className="size-4" />
          Created {formatDate(workspace.createdAt)}
        </div>
        <div className="inline-flex items-center gap-2">
          <LinkIcon className="size-4" />
          Ready for future engagement and sentiment jobs
        </div>
      </div>
    </article>
  )
}
