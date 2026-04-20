import { Hash } from 'lucide-react'
import { Badge } from '../components/common/badge'
import { EmptyState } from '../components/common/empty-state'
import { LoadingSkeleton } from '../components/common/loading-skeleton'
import { PageHeader } from '../components/common/page-header'
import { SectionCard } from '../components/common/section-card'
import { useSocialAnalytics } from '../features/analytics/use-social-analytics'

export function SocialMonitoringPage() {
  const { model, isLoading } = useSocialAnalytics()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Social Monitoring"
        title="Monitor conversations, terms, mentions, and profile activity in one place"
        description="Built for future live monitoring pipelines, but already structured as a useful mentions workspace with sentiment context and trending keywords."
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">All platforms</Badge>
            <Badge tone="neutral">Last 24h</Badge>
            <Badge tone="accent">Sentiment filter</Badge>
          </div>
        }
      />

      {isLoading ? (
        <LoadingSkeleton className="h-64" />
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
            <SectionCard
              title="Mentions feed"
              description="Mentions cards stay compact, readable, and ready for later real-time ingestion."
            >
              <div className="grid gap-3 md:grid-cols-2">
                {model.mentions.map((mention) => (
                  <article
                    key={mention.id}
                    className="flex min-h-[210px] flex-col rounded-2xl border border-line bg-[var(--surface-strong)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                        <Badge
                          tone={
                            mention.sentiment === 'positive'
                              ? 'success'
                              : mention.sentiment === 'negative'
                                ? 'danger'
                                : 'neutral'
                          }
                        >
                          {mention.sentiment}
                        </Badge>
                        <Badge tone="accent">{mention.platform}</Badge>
                      </div>
                      <span className="shrink-0 rounded-full surface-soft px-3 py-1 text-xs font-medium text-soft">
                        {mention.minutesAgo}m ago
                      </span>
                    </div>
                    <p className="mt-3 break-words text-sm font-semibold text-main">
                      {mention.author}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted">{mention.excerpt}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                      <span className="min-w-0 break-words">Keyword: {mention.keyword}</span>
                      <span className="shrink-0">{formatCompact(mention.engagement)} interactions</span>
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>

            <div className="grid gap-4">
              <SectionCard
                title="Sentiment summary"
                description="Quick monitoring summary by audience tone."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <SummaryTile
                    label="Positive"
                    value={`${model.kpis.sentimentScore}%`}
                    tone="success"
                  />
                  <SummaryTile
                    label="Neutral"
                    value={`${Math.max(0, 100 - model.kpis.sentimentScore - 12)}%`}
                    tone="neutral"
                  />
                  <SummaryTile label="Negative" value="12%" tone="danger" />
                </div>
              </SectionCard>

              <SectionCard
                title="Trending topics and keywords"
                description="Useful placeholder structure for future keyword and hashtag tracking."
              >
                <div className="space-y-3">
                  {model.trendingKeywords.map((keyword) => (
                    <div
                      key={keyword.keyword}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-[var(--surface-strong)] px-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                          <Hash className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-main">{keyword.keyword}</p>
                          <p className="text-sm text-muted">
                            {formatCompact(keyword.mentions)} mentions
                          </p>
                        </div>
                      </div>
                      <Badge tone={keyword.change >= 0 ? 'success' : 'danger'}>
                        {keyword.change >= 0 ? '+' : ''}
                        {keyword.change}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </section>

          {model.mentions.length === 0 ? (
            <EmptyState
              title="No mentions yet"
              description="Once monitoring sources are connected, incoming mentions and profile events will show up here."
            />
          ) : null}
        </>
      )}
    </div>
  )
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'success' | 'neutral' | 'danger'
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl surface-soft p-4">
      <Badge tone={tone}>{label}</Badge>
      <p className="mt-4 break-words text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-none tracking-tight text-main">
        {value}
      </p>
    </div>
  )
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
