import type { ReactNode } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MessageCircleMore, Radar, Sparkles, Users } from 'lucide-react'
import type { WorkspaceInsight } from '../../features/analytics/insights-engine'
import { ScoreRing } from './score-ring'

type WorkspaceInsightsPanelProps = {
  workspace: WorkspaceInsight
}

export function WorkspaceInsightsPanel({
  workspace,
}: WorkspaceInsightsPanelProps) {
  return (
    <article className="panel overflow-hidden">
      <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lagoon">
              {workspace.momentumLabel}
            </div>
            <div className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate/75">
              {workspace.strongestPlatform} strongest
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-ink">{workspace.workspaceName}</h3>
              <p className="mt-2 text-sm leading-6 text-slate/80">
                Useful workspace view for profile quality, sentiment health, and growth momentum.
              </p>
            </div>
            <ScoreRing score={workspace.healthScore} label="Workspace health" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatTile
              icon={<Users className="size-4" />}
              label="Estimated audience"
              value={formatCompact(workspace.estimatedAudience)}
            />
            <StatTile
              icon={<Radar className="size-4" />}
              label="Avg engagement"
              value={`${workspace.avgEngagementRate}%`}
            />
            <StatTile
              icon={<MessageCircleMore className="size-4" />}
              label="Positive sentiment"
              value={`${workspace.positiveSentimentRate}%`}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-mist p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate/65">
                Recommendations
              </p>
              <div className="mt-4 space-y-3">
                {workspace.recommendations.map((recommendation) => (
                  <div
                    key={recommendation}
                    className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate/80"
                  >
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-amber-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-900/70">
                Watchouts
              </p>
              <div className="mt-4 space-y-3">
                {workspace.watchouts.map((watchout) => (
                  <div
                    key={watchout}
                    className="rounded-2xl border border-amber-200 bg-white/85 px-4 py-3 text-sm leading-6 text-slate/80"
                  >
                    {watchout}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate/65">
              <Sparkles className="size-4 text-lagoon" />
              Weekly growth
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={workspace.growthSeries}>
                  <defs>
                    <linearGradient id={`workspace-growth-${workspace.workspaceId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(49, 65, 88, 0.12)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0f766e"
                    fill={`url(#workspace-growth-${workspace.workspaceId})`}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] bg-ink p-5 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">Top profiles</p>
            <div className="mt-4 space-y-3">
              {workspace.profileInsights.map((profile) => (
                <div
                  key={profile.profileId}
                  className="rounded-2xl bg-white/8 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold capitalize text-white">
                        {profile.handle}
                      </p>
                      <p className="text-sm text-white/65">{profile.platform}</p>
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      {profile.bestContentType}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <MiniMetric label="Followers" value={formatCompact(profile.estimatedFollowers)} />
                    <MiniMetric label="Engagement" value={`${profile.engagementRate}%`} />
                    <MiniMetric label="Momentum" value={`${profile.momentum}%`} />
                    <MiniMetric label="Best slot" value={profile.bestPostingWindow} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="inline-flex rounded-2xl bg-emerald-50 p-2 text-lagoon">{icon}</div>
      <p className="mt-4 text-sm text-slate/75">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/10 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-white/55">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
