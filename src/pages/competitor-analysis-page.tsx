import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '../components/common/badge'
import { LoadingSkeleton } from '../components/common/loading-skeleton'
import { PageHeader } from '../components/common/page-header'
import { SectionCard } from '../components/common/section-card'
import { useSocialAnalytics } from '../features/analytics/use-social-analytics'

export function CompetitorAnalysisPage() {
  const { model, isLoading } = useSocialAnalytics()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Competitor Analysis"
        title="Compare saved profiles inside the same product surface"
        description="Benchmark audience, engagement, growth, sentiment, and posting rhythm across the profiles you track, with clear leader and weak-signal indicators."
      />

      {isLoading ? (
        <LoadingSkeleton className="h-80" />
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <SectionCard
              title="Comparison table"
              description="Focused and readable benchmarking instead of a noisy spreadsheet."
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-soft">
                    <tr>
                      <th className="pb-3 font-medium">Profile</th>
                      <th className="pb-3 font-medium">Audience</th>
                      <th className="pb-3 font-medium">Engagement</th>
                      <th className="pb-3 font-medium">Growth</th>
                      <th className="pb-3 font-medium">Sentiment</th>
                      <th className="pb-3 font-medium">Posting / wk</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.competitorRows.map((row) => (
                      <tr key={row.id} className="border-t border-line">
                        <td className="py-4">
                          <div>
                            <p className="font-semibold text-main">{row.handle}</p>
                            <p className="text-xs text-soft">{row.platform}</p>
                          </div>
                        </td>
                        <td className="py-4 text-muted">{formatCompact(row.audience)}</td>
                        <td className="py-4 text-muted">{row.engagementRate}%</td>
                        <td className="py-4 text-muted">{row.growthRate}%</td>
                        <td className="py-4 text-muted">{row.sentimentScore}%</td>
                        <td className="py-4 text-muted">{row.postingFrequency}</td>
                        <td className="py-4">
                          <Badge
                            tone={
                              row.leaderStatus === 'Leader'
                                ? 'success'
                                : row.leaderStatus === 'Rising'
                                  ? 'accent'
                                  : 'warning'
                            }
                          >
                            {row.leaderStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard
              title="Audience benchmark"
              description="Which profiles currently dominate the competitive set."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={model.competitorRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="handle" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="audience" fill="#0f766e" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <SectionCard
              title="Leader"
              description="The strongest profile in the current benchmark set."
            >
              {model.competitorRows[0] ? (
                <ProfileSummaryCard row={model.competitorRows[0]} />
              ) : null}
            </SectionCard>
            <SectionCard
              title="Rising"
              description="A profile with room to catch the leader."
            >
              {model.competitorRows.find((row) => row.leaderStatus === 'Rising') ? (
                <ProfileSummaryCard
                  row={model.competitorRows.find((row) => row.leaderStatus === 'Rising')!}
                />
              ) : null}
            </SectionCard>
            <SectionCard
              title="Weak signal"
              description="The profile that most needs attention or a strategy shift."
            >
              {model.competitorRows.find((row) => row.leaderStatus === 'Weak') ? (
                <ProfileSummaryCard
                  row={model.competitorRows.find((row) => row.leaderStatus === 'Weak')!}
                />
              ) : null}
            </SectionCard>
          </section>

          <SectionCard
            title="Actionable competitor recommendations"
            description="Useful prompts you can actually act on, not generic filler."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <Recommendation text="Use the leader’s best engagement style as a benchmark for your next content sprint." />
              <Recommendation text="If a rising profile is growing quickly but with lower sentiment, review comments before copying its format directly." />
              <Recommendation text="Where posting frequency is high but engagement is soft, quality may need more attention than cadence." />
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}

function ProfileSummaryCard({
  row,
}: {
  row: {
    handle: string
    platform: string
    audience: number
    engagementRate: number
    growthRate: number
    sentimentScore: number
  }
}) {
  return (
    <div className="rounded-2xl border border-line bg-[var(--surface-strong)] p-4">
      <p className="font-semibold text-main">{row.handle}</p>
      <p className="mt-1 text-sm text-soft">{row.platform}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="Audience" value={formatCompact(row.audience)} />
        <Metric label="Engagement" value={`${row.engagementRate}%`} />
        <Metric label="Growth" value={`${row.growthRate}%`} />
        <Metric label="Sentiment" value={`${row.sentimentScore}%`} />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl surface-soft px-3 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-soft">{label}</p>
      <p className="mt-2 text-sm font-semibold text-main">{value}</p>
    </div>
  )
}

function Recommendation({ text }: { text: string }) {
  return <div className="rounded-2xl surface-soft px-4 py-4 text-sm leading-6 text-muted">{text}</div>
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
