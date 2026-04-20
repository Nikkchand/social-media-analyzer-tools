import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AnalyticsOverview } from '../../features/analytics/insights-engine'
import { ChartCard } from './chart-card'
import { ScoreRing } from './score-ring'

type OverviewChartsProps = {
  overview: AnalyticsOverview
}

const sentimentColors = ['#0f766e', '#93c5fd', '#fb7185']

export function OverviewCharts({ overview }: OverviewChartsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <ChartCard
        title="Audience momentum"
        description="A simple weekly growth curve based on the profiles inside your saved workspaces."
        action={<ScoreRing score={Math.round(overview.avgHealthScore)} label="Portfolio health" />}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={overview.followerGrowthSeries}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
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
              fill="url(#growthFill)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Platform mix"
        description="How your tracked profiles are distributed across social channels."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={overview.platformMix}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(49, 65, 88, 0.12)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#112031" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Engagement trend"
        description="Average engagement rate trend across your workspace portfolio."
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={overview.engagementSeries}>
            <defs>
              <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7a59" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ff7a59" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(49, 65, 88, 0.12)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Engagement']} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ff7a59"
              fill="url(#engagementFill)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Sentiment mix"
        description="Snapshot of overall audience tone across your tracked profiles."
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={overview.sentimentMix}
              dataKey="value"
              innerRadius={64}
              outerRadius={88}
              paddingAngle={3}
            >
              {overview.sentimentMix.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={sentimentColors[index % sentimentColors.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Share']} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  )
}
