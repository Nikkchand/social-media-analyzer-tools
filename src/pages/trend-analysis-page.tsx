import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
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

const ranges = ['30D', '90D', '6M'] as const

export function TrendAnalysisPage() {
  const { model, isLoading } = useSocialAnalytics()
  const [selectedRange, setSelectedRange] = useState<(typeof ranges)[number]>('90D')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trend Analysis"
        title="Read momentum, engagement, posting cadence, sentiment, and platform mix"
        description="Elegant trend views with enough structure to feel like a serious analytics product today and still stay ready for future live time-series ingestion."
        actions={
          <div className="flex gap-2">
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  selectedRange === range
                    ? 'bg-[var(--surface-dark)] text-white'
                    : 'surface-soft text-main'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        }
      />

      {isLoading ? (
        <LoadingSkeleton className="h-96" />
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-2">
            <TrendChart
              title="Follower growth trend"
              description="Momentum rising across the tracked set."
              data={model.followerGrowthTrend}
              color="#0f766e"
            />
            <TrendChart
              title="Engagement trend"
              description="Watch for flattening or lift around new content experiments."
              data={model.engagementTrend}
              color="#ff7a59"
              suffix="%"
            />
            <TrendChart
              title="Posting cadence"
              description="Publishing rhythm over time."
              data={model.postingCadenceTrend}
              color="#3b82f6"
            />
            <TrendChart
              title="Sentiment trend"
              description="Negative spikes or healthy audience tone shifts will be easy to spot here."
              data={model.sentimentTrend}
              color="#8b5cf6"
              suffix="%"
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <SectionCard title="Platform mix" description="Channel distribution across tracked profiles.">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={model.platformMix}
                      dataKey="value"
                      innerRadius={64}
                      outerRadius={88}
                      paddingAngle={3}
                      fill="#0f766e"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard
              title="Signal summary"
              description="The calm, high-signal interpretation layer for the charts."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <SignalCard
                  label="Momentum"
                  headline="Rising"
                  description="Follower growth signals are trending upward across the tracked portfolio."
                  tone="success"
                />
                <SignalCard
                  label="Engagement"
                  headline="Watch closely"
                  description="Engagement is healthy overall, but some profiles are flattening and need new hooks."
                  tone="warning"
                />
                <SignalCard
                  label="Sentiment"
                  headline="Stable"
                  description="No major negative spike is visible right now, but mixed sentiment exists in weaker profiles."
                  tone="accent"
                />
              </div>
            </SectionCard>
          </section>
        </>
      )}
    </div>
  )
}

function TrendChart({
  title,
  description,
  data,
  color,
  suffix = '',
}: {
  title: string
  description: string
  data: Array<{ label: string; value: number }>
  color: string
  suffix?: string
}) {
  const gradientId = `${title.replace(/\s+/g, '-')}-gradient`

  return (
    <SectionCard title={title} description={description}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value ?? 0}${suffix}`, title]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#${gradientId})`}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}

function SignalCard({
  label,
  headline,
  description,
  tone,
}: {
  label: string
  headline: string
  description: string
  tone: 'success' | 'warning' | 'accent'
}) {
  return (
    <div className="rounded-2xl border border-line bg-[var(--surface-strong)] p-4">
      <Badge tone={tone}>{label}</Badge>
      <p className="mt-4 text-xl font-semibold text-main">{headline}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </div>
  )
}
