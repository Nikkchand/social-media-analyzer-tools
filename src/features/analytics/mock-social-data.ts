import type { WorkspaceWithProfiles, SupportedPlatform, TrackedProfile } from '../../types/workspace'

export type MentionItem = {
  id: string
  platform: SupportedPlatform
  sentiment: 'positive' | 'neutral' | 'negative'
  keyword: string
  author: string
  excerpt: string
  minutesAgo: number
  engagement: number
}

export type TrendingKeyword = {
  keyword: string
  mentions: number
  change: number
}

export type ProfileBenchmark = {
  id: string
  handle: string
  platform: SupportedPlatform
  audience: number
  engagementRate: number
  growthRate: number
  sentimentScore: number
  postingFrequency: number
  leaderStatus: 'Leader' | 'Rising' | 'Weak'
}

export type ReportItem = {
  id: string
  title: string
  cadence: 'Weekly' | 'Monthly'
  createdAt: string
  summary: string
  status: 'Ready' | 'Draft'
}

export type RecentActivityItem = {
  id: string
  title: string
  description: string
  time: string
}

export type SocioAnalyticsModel = {
  isUsingPreviewData: boolean
  kpis: {
    trackedProfiles: number
    engagementRate: number
    sentimentScore: number
    audienceEstimate: number
    momentumScore: number
  }
  topProfiles: Array<{
    id: string
    handle: string
    platform: SupportedPlatform
    contentTitle: string
    engagementRate: number
    momentumScore: number
    sentimentScore: number
  }>
  recommendations: string[]
  alerts: string[]
  recentActivity: RecentActivityItem[]
  mentions: MentionItem[]
  trendingKeywords: TrendingKeyword[]
  competitorRows: ProfileBenchmark[]
  followerGrowthTrend: Array<{ label: string; value: number }>
  engagementTrend: Array<{ label: string; value: number }>
  postingCadenceTrend: Array<{ label: string; value: number }>
  sentimentTrend: Array<{ label: string; value: number }>
  platformMix: Array<{ name: string; value: number }>
  reports: ReportItem[]
}

const fallbackProfiles: TrackedProfile[] = [
  {
    id: 'demo-1',
    url: 'https://instagram.com/sociolyzerhq',
    platform: 'instagram',
    handle: 'sociolyzerhq',
    status: 'ready_for_processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    url: 'https://youtube.com/@sociolabs',
    platform: 'youtube',
    handle: 'sociolabs',
    status: 'ready_for_processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    url: 'https://linkedin.com/company/socio-watch',
    platform: 'linkedin',
    handle: 'socio-watch',
    status: 'ready_for_processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    url: 'https://x.com/signalintel',
    platform: 'x',
    handle: 'signalintel',
    status: 'ready_for_processing',
    createdAt: new Date().toISOString(),
  },
]

const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const keywordSeeds = [
  'ugc strategy',
  'creator collab',
  'brand recall',
  'viral reel',
  'community response',
  'campaign launch',
]

export function buildSocioAnalyticsModel(
  workspaces: WorkspaceWithProfiles[],
): SocioAnalyticsModel {
  const realProfiles = workspaces.flatMap((workspace) => workspace.profiles)
  const profiles = realProfiles.length > 0 ? realProfiles : fallbackProfiles
  const benchmarks = profiles.map(buildBenchmark)

  const trackedProfiles = benchmarks.length
  const audienceEstimate = benchmarks.reduce((sum, row) => sum + row.audience, 0)
  const engagementRate = average(benchmarks.map((row) => row.engagementRate))
  const sentimentScore = average(benchmarks.map((row) => row.sentimentScore))
  const momentumScore = average(
    benchmarks.map((row) => row.growthRate * 5 + row.engagementRate * 6),
  )

  const platformMix = mergeCounts(
    benchmarks.map((row) => ({
      name: capitalize(row.platform),
      value: 1,
    })),
  )

  return {
    isUsingPreviewData: realProfiles.length === 0,
    kpis: {
      trackedProfiles,
      engagementRate: round(engagementRate),
      sentimentScore: round(sentimentScore),
      audienceEstimate,
      momentumScore: round(momentumScore),
    },
    topProfiles: benchmarks
      .slice()
      .sort((left, right) => right.engagementRate - left.engagementRate)
      .slice(0, 4)
      .map((row) => ({
        id: row.id,
        handle: row.handle,
        platform: row.platform,
        contentTitle: topContentTitle(row.handle),
        engagementRate: row.engagementRate,
        momentumScore: round(row.growthRate * 5 + row.engagementRate * 6),
        sentimentScore: row.sentimentScore,
      })),
    recommendations: buildRecommendations(benchmarks),
    alerts: buildAlerts(benchmarks),
    recentActivity: benchmarks.slice(0, 5).map((row, index) => ({
      id: row.id,
      title: `${capitalize(row.platform)} profile pulse updated`,
      description: `${row.handle} is showing ${row.leaderStatus.toLowerCase()} signals with ${row.engagementRate}% engagement and ${row.growthRate}% growth.`,
      time: `${index + 1}h ago`,
    })),
    mentions: benchmarks.flatMap((row, index) =>
      keywordSeeds.slice(0, 2).map((keyword, keywordIndex) => {
        const sentiment = sentimentForScore(row.sentimentScore - keywordIndex * 8)
        return {
          id: `${row.id}-${keywordIndex}`,
          platform: row.platform,
          sentiment,
          keyword,
          author: `@${row.handle}_audience`,
          excerpt: `${capitalize(keyword)} conversations are picking up around ${row.handle}, with audiences reacting to consistency, visuals, and posting rhythm.`,
          minutesAgo: 14 + index * 17 + keywordIndex * 6,
          engagement: Math.round(seed(`${row.id}-${keyword}`, 180, 7200)),
        }
      }),
    ),
    trendingKeywords: keywordSeeds.map((keyword, index) => ({
      keyword,
      mentions: Math.round(seed(`${keyword}-mentions`, 120, 2200)),
      change: round(seed(`${keyword}-change`, -7, 31) + index),
    })),
    competitorRows: benchmarks
      .slice()
      .sort((left, right) => right.audience - left.audience),
    followerGrowthTrend: chartLabels.map((label, index) => ({
      label,
      value: Math.round(
        benchmarks.reduce(
          (sum, row) => sum + seed(`${row.id}-followers-${index}`, 400, 3000),
          0,
        ),
      ),
    })),
    engagementTrend: chartLabels.map((label, index) => ({
      label,
      value: round(
        average(
          benchmarks.map((row) => row.engagementRate + seed(`${row.id}-eng-${index}`, -0.8, 0.9)),
        ),
      ),
    })),
    postingCadenceTrend: chartLabels.map((label, index) => ({
      label,
      value: round(
        average(
          benchmarks.map((row) =>
            Math.max(2, row.postingFrequency + seed(`${row.id}-cadence-${index}`, -0.7, 0.9)),
          ),
        ),
      ),
    })),
    sentimentTrend: chartLabels.map((label, index) => ({
      label,
      value: round(
        average(
          benchmarks.map((row) => row.sentimentScore + seed(`${row.id}-sentiment-${index}`, -3.5, 3.2)),
        ),
      ),
    })),
    platformMix,
    reports: ['Weekly workspace brief', 'Monthly benchmark report', 'Executive pulse deck'].map(
      (title, index) => ({
        id: `report-${index}`,
        title,
        cadence: index === 1 ? 'Monthly' : 'Weekly',
        createdAt: `${12 - index} Apr 2026`,
        summary:
          index === 0
            ? 'Highlights KPI movement, top profiles, and watchouts.'
            : index === 1
              ? 'Summarizes benchmark shifts, trend changes, and audience tone.'
              : 'Exec-friendly snapshot with charts and recommendations.',
        status: index === 2 ? 'Draft' : 'Ready',
      }),
    ),
  }
}

function buildBenchmark(profile: TrackedProfile): ProfileBenchmark {
  const key = `${profile.platform}:${profile.handle || profile.id}`
  const audience = Math.round(seed(`${key}-audience`, 4200, 680000))
  const engagementRate = round(seed(`${key}-engagement`, 1.9, 8.8))
  const growthRate = round(seed(`${key}-growth`, -1.8, 18.2))
  const sentimentScore = round(seed(`${key}-sentiment`, 56, 88))
  const postingFrequency = round(seed(`${key}-frequency`, 2.4, 9.4))
  const leaderStatus: ProfileBenchmark['leaderStatus'] =
    engagementRate > 6.1 || growthRate > 11
      ? 'Leader'
      : engagementRate > 4.1 || growthRate > 5.5
        ? 'Rising'
        : 'Weak'

  return {
    id: profile.id,
    handle: profile.handle || 'detected-profile',
    platform: profile.platform,
    audience,
    engagementRate,
    growthRate,
    sentimentScore,
    postingFrequency,
    leaderStatus,
  }
}

function buildRecommendations(benchmarks: ProfileBenchmark[]) {
  const leader = benchmarks.find((row) => row.leaderStatus === 'Leader')
  const lowSentiment = benchmarks.find((row) => row.sentimentScore < 66)

  return [
    leader
      ? `${leader.handle} is your strongest benchmark right now. Reuse its strongest content angle as a template for the rest of the workspace.`
      : 'No clear leader yet. Test content hooks and posting rhythm across profiles to find the strongest format.',
    'Track a brand profile and at least one competitor profile in the same workspace to make the comparisons more actionable.',
    lowSentiment
      ? `${lowSentiment.handle} has softer sentiment. Review comment patterns, audience pain points, and content tone before scaling frequency.`
      : 'Sentiment looks healthy overall. Focus next on consistency and content series performance.',
  ]
}

function buildAlerts(benchmarks: ProfileBenchmark[]) {
  const alerts = benchmarks.slice(0, 3).map((row) => {
    if (row.sentimentScore < 64) {
      return `${row.handle}: negative sentiment risk is higher than ideal.`
    }

    if (row.growthRate < 3) {
      return `${row.handle}: momentum is flattening, so content freshness may need attention.`
    }

    return `${row.handle}: healthy signal mix, but keep watching benchmark changes.`
  })

  return alerts
}

function sentimentForScore(score: number): MentionItem['sentiment'] {
  if (score >= 74) {
    return 'positive'
  }

  if (score >= 62) {
    return 'neutral'
  }

  return 'negative'
}

function topContentTitle(handle: string) {
  return `Top-performing content arc for ${handle}`
}

function mergeCounts(values: Array<{ name: string; value: number }>) {
  const merged = new Map<string, number>()

  values.forEach((value) => {
    merged.set(value.name, (merged.get(value.name) ?? 0) + value.value)
  })

  return [...merged.entries()].map(([name, value]) => ({ name, value }))
}

function average(values: number[]) {
  return values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length
}

function seed(key: string, min: number, max: number) {
  const normalized = Math.abs(hash(key) % 10000) / 10000
  return min + (max - min) * normalized
}

function hash(value: string) {
  let result = 0

  for (let index = 0; index < value.length; index += 1) {
    result = (result << 5) - result + value.charCodeAt(index)
    result |= 0
  }

  return result
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

function capitalize(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value
}
