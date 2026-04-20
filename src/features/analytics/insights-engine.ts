import type { TrackedProfile, WorkspaceWithProfiles } from '../../types/workspace'

type SeriesPoint = {
  label: string
  value: number
}

type SentimentPoint = {
  name: 'Positive' | 'Neutral' | 'Negative'
  value: number
}

type ProfileInsight = {
  profileId: string
  handle: string
  platform: TrackedProfile['platform']
  estimatedFollowers: number
  engagementRate: number
  momentum: number
  sentimentScore: number
  bestContentType: string
  bestPostingWindow: string
}

export type WorkspaceInsight = {
  workspaceId: string
  workspaceName: string
  profileCount: number
  estimatedAudience: number
  avgEngagementRate: number
  healthScore: number
  momentumLabel: string
  positiveSentimentRate: number
  strongestPlatform: string
  recommendations: string[]
  watchouts: string[]
  growthSeries: SeriesPoint[]
  engagementSeries: SeriesPoint[]
  platformMix: Array<{ name: string; value: number }>
  sentimentMix: SentimentPoint[]
  profileInsights: ProfileInsight[]
}

export type AnalyticsOverview = {
  estimatedAudience: number
  avgEngagementRate: number
  avgHealthScore: number
  positiveSentimentRate: number
  totalProfiles: number
  totalWorkspaces: number
  followerGrowthSeries: SeriesPoint[]
  engagementSeries: SeriesPoint[]
  platformMix: Array<{ name: string; value: number }>
  sentimentMix: SentimentPoint[]
  recommendations: string[]
  topWorkspace: WorkspaceInsight | null
}

const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
const contentTypes = ['Short video', 'Carousel', 'Live session', 'Community post']
const postingWindows = ['8-10 AM', '12-2 PM', '6-8 PM', '8-10 PM']

export function buildWorkspaceInsights(
  workspaces: WorkspaceWithProfiles[],
): {
  overview: AnalyticsOverview
  workspaces: WorkspaceInsight[]
} {
  const workspaceInsights = workspaces.map(buildWorkspaceInsight)
  const totalProfiles = workspaceInsights.reduce(
    (sum, workspace) => sum + workspace.profileCount,
    0,
  )
  const estimatedAudience = workspaceInsights.reduce(
    (sum, workspace) => sum + workspace.estimatedAudience,
    0,
  )
  const avgEngagementRate = average(
    workspaceInsights.map((workspace) => workspace.avgEngagementRate),
  )
  const avgHealthScore = average(
    workspaceInsights.map((workspace) => workspace.healthScore),
  )
  const positiveSentimentRate = average(
    workspaceInsights.map((workspace) => workspace.positiveSentimentRate),
  )
  const platformMix = mergeNamedValues(workspaceInsights.flatMap((workspace) => workspace.platformMix))
  const sentimentMix = normalizeSentiment(
    mergeNamedValues(workspaceInsights.flatMap((workspace) => workspace.sentimentMix)),
  )

  const followerGrowthSeries = weekLabels.map((label, index) => ({
    label,
    value: workspaceInsights.reduce(
      (sum, workspace) => sum + workspace.growthSeries[index].value,
      0,
    ),
  }))

  const engagementSeries = weekLabels.map((label, index) => ({
    label,
    value: roundToOneDecimal(
      average(
        workspaceInsights.map((workspace) => workspace.engagementSeries[index].value),
      ),
    ),
  }))

  const recommendations = buildGlobalRecommendations(workspaceInsights)
  const topWorkspace =
    [...workspaceInsights].sort((left, right) => right.healthScore - left.healthScore)[0] ??
    null

  return {
    overview: {
      estimatedAudience,
      avgEngagementRate: roundToOneDecimal(avgEngagementRate),
      avgHealthScore: roundToOneDecimal(avgHealthScore),
      positiveSentimentRate: roundToOneDecimal(positiveSentimentRate),
      totalProfiles,
      totalWorkspaces: workspaces.length,
      followerGrowthSeries,
      engagementSeries,
      platformMix,
      sentimentMix,
      recommendations,
      topWorkspace,
    },
    workspaces: workspaceInsights,
  }
}

function buildWorkspaceInsight(workspace: WorkspaceWithProfiles): WorkspaceInsight {
  const profileInsights = workspace.profiles.map((profile) => buildProfileInsight(profile))
  const estimatedAudience = profileInsights.reduce(
    (sum, profile) => sum + profile.estimatedFollowers,
    0,
  )
  const avgEngagementRate = average(
    profileInsights.map((profile) => profile.engagementRate),
  )
  const positiveSentimentRate = average(
    profileInsights.map((profile) => profile.sentimentScore),
  )
  const healthScore = Math.max(
    45,
    Math.min(
      96,
      Math.round(avgEngagementRate * 8 + positiveSentimentRate * 0.52 + workspace.profileCount * 2),
    ),
  )

  const momentumValue = average(profileInsights.map((profile) => profile.momentum))
  const strongestPlatform =
    [...workspace.profiles].sort(
      (left, right) =>
        platformWeight(right.platform) - platformWeight(left.platform),
    )[0]?.platform ?? 'unknown'

  const growthSeries = weekLabels.map((label, index) => ({
    label,
    value: Math.round(
      profileInsights.reduce((sum, profile) => {
        const variance = seededNumber(`${profile.profileId}-${index}`, 120, 1200)
        return sum + variance + index * seededNumber(`${profile.handle}-ramp`, 30, 220)
      }, 0),
    ),
  }))

  const engagementSeries = weekLabels.map((label, index) => ({
    label,
    value: roundToOneDecimal(
      average(
        profileInsights.map((profile) => {
          const adjustment = seededNumber(`${profile.profileId}-eng-${index}`, -0.7, 0.8)
          return Math.max(1, profile.engagementRate + adjustment)
        }),
      ),
    ),
  }))

  const platformMix = mergeNamedValues(
    workspace.profiles.map((profile) => ({
      name: capitalize(profile.platform),
      value: 1,
    })),
  )

  const sentimentMix = normalizeSentiment(
    mergeNamedValues(
      profileInsights.flatMap((profile) => [
        { name: 'Positive', value: Math.round(profile.sentimentScore) },
        { name: 'Neutral', value: 100 - Math.round(profile.sentimentScore) - 12 },
        { name: 'Negative', value: 12 },
      ]),
    ),
  )

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    profileCount: workspace.profileCount,
    estimatedAudience,
    avgEngagementRate: roundToOneDecimal(avgEngagementRate),
    healthScore,
    momentumLabel: momentumToLabel(momentumValue),
    positiveSentimentRate: roundToOneDecimal(positiveSentimentRate),
    strongestPlatform: capitalize(strongestPlatform),
    recommendations: buildWorkspaceRecommendations({
      workspace,
      avgEngagementRate,
      positiveSentimentRate,
      strongestPlatform,
    }),
    watchouts: buildWorkspaceWatchouts({
      workspace,
      avgEngagementRate,
      positiveSentimentRate,
    }),
    growthSeries,
    engagementSeries,
    platformMix,
    sentimentMix,
    profileInsights,
  }
}

function buildProfileInsight(profile: TrackedProfile): ProfileInsight {
  const key = `${profile.platform}:${profile.handle || profile.id}`
  const estimatedFollowers = Math.round(seededNumber(`${key}:followers`, 1800, 480000))
  const engagementRate = roundToOneDecimal(
    seededNumber(`${key}:engagement`, 1.8, 8.9) + platformWeight(profile.platform) * 0.08,
  )
  const momentum = roundToOneDecimal(seededNumber(`${key}:momentum`, -4.2, 16.5))
  const sentimentScore = roundToOneDecimal(seededNumber(`${key}:sentiment`, 58, 84))

  return {
    profileId: profile.id,
    handle: profile.handle || 'detected-profile',
    platform: profile.platform,
    estimatedFollowers,
    engagementRate,
    momentum,
    sentimentScore,
    bestContentType: contentTypes[Math.abs(hashString(`${key}:content`)) % contentTypes.length],
    bestPostingWindow:
      postingWindows[Math.abs(hashString(`${key}:window`)) % postingWindows.length],
  }
}

function buildWorkspaceRecommendations(input: {
  workspace: WorkspaceWithProfiles
  avgEngagementRate: number
  positiveSentimentRate: number
  strongestPlatform: string
}) {
  const recommendations = [
    `Double down on ${capitalize(input.strongestPlatform)} because it currently looks like the strongest channel in this workspace.`,
    'Package content into repeatable weekly themes so you can compare performance patterns more clearly over time.',
  ]

  if (input.avgEngagementRate < 4.5) {
    recommendations.unshift(
      'Engagement is softer than ideal, so test stronger hooks, sharper captions, and clearer calls to action.',
    )
  }

  if (input.workspace.profileCount > 1) {
    recommendations.push(
      'Use this workspace as a benchmark set and compare each profile against the strongest performer every week.',
    )
  }

  if (input.positiveSentimentRate < 68) {
    recommendations.push(
      'Monitor comments and mentions more closely because audience tone is more mixed than ideal right now.',
    )
  }

  return recommendations.slice(0, 3)
}

function buildWorkspaceWatchouts(input: {
  workspace: WorkspaceWithProfiles
  avgEngagementRate: number
  positiveSentimentRate: number
}) {
  const watchouts = []

  if (input.workspace.profileCount === 1) {
    watchouts.push('Only one profile is tracked here, so benchmarks are directional rather than comparative.')
  }

  if (input.avgEngagementRate < 3.8) {
    watchouts.push('Average engagement trend is under the healthy benchmark threshold of roughly 4%.')
  }

  if (input.positiveSentimentRate < 65) {
    watchouts.push('Sentiment mix suggests audience response may be flattening or becoming more neutral.')
  }

  if (watchouts.length === 0) {
    watchouts.push('No major risks detected in this workspace snapshot. Keep iterating and watch for consistency.')
  }

  return watchouts.slice(0, 2)
}

function buildGlobalRecommendations(workspaces: WorkspaceInsight[]) {
  if (workspaces.length === 0) {
    return [
      'Create your first workspace and add 2-3 profiles so the dashboard can surface useful comparisons.',
      'Track one hero brand profile and one competitor profile to make the insights more actionable.',
    ]
  }

  const recommendations = [
    'Review your strongest workspace weekly and turn the best-performing content format into a repeatable series.',
    'Add competitor or inspiration profiles into the same workspace so growth and engagement patterns become easier to compare.',
  ]

  const weakEngagementCount = workspaces.filter(
    (workspace) => workspace.avgEngagementRate < 4.5,
  ).length

  if (weakEngagementCount > 0) {
    recommendations.unshift(
      `${weakEngagementCount} workspace${weakEngagementCount > 1 ? 's are' : ' is'} below the target engagement band, so prioritize format testing there first.`,
    )
  }

  return recommendations.slice(0, 3)
}

function mergeNamedValues<T extends { name: string; value: number }>(values: T[]) {
  const merged = new Map<string, number>()

  values.forEach((value) => {
    merged.set(value.name, (merged.get(value.name) ?? 0) + value.value)
  })

  return [...merged.entries()].map(([name, value]) => ({ name, value }))
}

function normalizeSentiment(values: Array<{ name: string; value: number }>): SentimentPoint[] {
  const positive = values.find((item) => item.name === 'Positive')?.value ?? 0
  const neutral = values.find((item) => item.name === 'Neutral')?.value ?? 0
  const negative = values.find((item) => item.name === 'Negative')?.value ?? 0
  const total = positive + neutral + negative || 1
  const normalizedPositive = Math.round((positive / total) * 100)
  const normalizedNeutral = Math.round((neutral / total) * 100)

  return [
    { name: 'Positive', value: normalizedPositive },
    { name: 'Neutral', value: normalizedNeutral },
    {
      name: 'Negative',
      value: Math.max(0, 100 - normalizedPositive - normalizedNeutral),
    },
  ]
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function momentumToLabel(value: number) {
  if (value > 10) {
    return 'Surging'
  }

  if (value > 4) {
    return 'Growing'
  }

  if (value > 0) {
    return 'Stable'
  }

  return 'Cooling'
}

function platformWeight(platform: TrackedProfile['platform']) {
  const weights: Record<TrackedProfile['platform'], number> = {
    instagram: 8,
    youtube: 9,
    tiktok: 10,
    x: 6,
    linkedin: 7,
    facebook: 5,
    threads: 6,
    unknown: 4,
  }

  return weights[platform]
}

function seededNumber(key: string, min: number, max: number) {
  const normalized = Math.abs(hashString(key) % 10000) / 10000
  return min + (max - min) * normalized
}

function hashString(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return hash
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10
}

function capitalize(value: string) {
  if (!value) {
    return value
  }

  return `${value[0].toUpperCase()}${value.slice(1)}`
}
