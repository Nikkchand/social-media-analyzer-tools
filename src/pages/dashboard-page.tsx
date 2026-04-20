import {
  Activity,
  HeartPulse,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMemo, useState } from 'react'
import { Badge } from '../components/common/badge'
import { Button } from '../components/common/button'
import { ConfirmModal } from '../components/common/confirm-modal'
import { EmptyState } from '../components/common/empty-state'
import { LoadingSkeleton } from '../components/common/loading-skeleton'
import { PageHeader } from '../components/common/page-header'
import { SectionCard } from '../components/common/section-card'
import { MetricCard } from '../components/workspace/metric-card'
import { PlatformPill } from '../components/workspace/platform-pill'
import { WorkspaceForm } from '../components/workspace/workspace-form'
import { useSocialAnalytics } from '../features/analytics/use-social-analytics'
import { useAuth } from '../features/auth/use-auth'
import { useToast } from '../features/toast/use-toast'
import type { WorkspaceWithProfiles } from '../types/workspace'
import { createWorkspace, deleteWorkspace } from '../services/workspace-service'

export function DashboardPage() {
  const { user } = useAuth()
  const { model, workspaces, isLoading } = useSocialAnalytics()
  const { pushToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<WorkspaceWithProfiles | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const sortedWorkspaces = useMemo(
    () => [...workspaces].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [workspaces],
  )

  async function handleCreateWorkspace(payload: {
    name: string
    description: string
    links: string[]
  }) {
    if (!user) {
      return
    }

    setIsSaving(true)
    try {
      await createWorkspace(user, payload)
      pushToast({
        tone: 'success',
        title: 'Workspace created',
        description: `${payload.name} is ready inside your SocioLyzer workspace library.`,
      })
    } catch (error) {
      pushToast({
        tone: 'error',
        title: 'Could not create workspace',
        description:
          error instanceof Error ? error.message : 'Please try again in a moment.',
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteWorkspace() {
    if (!user || !workspaceToDelete) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteWorkspace(user.uid, workspaceToDelete.id)
      pushToast({
        tone: 'success',
        title: 'Workspace deleted',
        description: `${workspaceToDelete.name} and its tracked profiles were removed.`,
      })
      setWorkspaceToDelete(null)
    } catch (error) {
      pushToast({
        tone: 'error',
        title: 'Could not delete workspace',
        description:
          error instanceof Error ? error.message : 'Please try again in a moment.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Executive command center for your social intelligence workflow"
        description="Track the health of your saved profile portfolio, see what is moving, and decide what deserves action next without drowning in noisy UI."
        actions={
          model.isUsingPreviewData ? (
            <Badge tone="accent">Preview analytics mode</Badge>
          ) : (
            <Badge tone="success">Workspace-linked analytics</Badge>
          )
        }
      />

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-40" />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Tracked Profiles"
              value={String(model.kpis.trackedProfiles).padStart(2, '0')}
              helper="Brand, creator, and competitor profiles currently included in your analytics scope."
              icon={<Users className="size-5" />}
            />
            <MetricCard
              label="Engagement Rate"
              value={`${model.kpis.engagementRate}%`}
              helper="Directionally modeled to show where audience response is strongest."
              icon={<HeartPulse className="size-5" />}
            />
            <MetricCard
              label="Sentiment Score"
              value={`${model.kpis.sentimentScore}%`}
              helper="Higher sentiment means healthier audience tone and safer campaign energy."
              icon={<Sparkles className="size-5" />}
            />
            <MetricCard
              label="Audience Estimate"
              value={formatCompact(model.kpis.audienceEstimate)}
              helper="Combined directional audience estimate across the tracked profile set."
              icon={<Activity className="size-5" />}
            />
            <MetricCard
              label="Momentum Score"
              value={`${model.kpis.momentumScore}`}
              helper="A blended indicator from growth and engagement movement."
              icon={<TrendingUp className="size-5" />}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <SectionCard
              title="Growth and engagement pulse"
              description="A clean executive view of how your saved profile universe is moving over time."
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={model.followerGrowthTrend}>
                      <defs>
                        <linearGradient id="dashGrowthFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area
                        dataKey="value"
                        type="monotone"
                        stroke="#0f766e"
                        fill="url(#dashGrowthFill)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={model.engagementTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Engagement']} />
                      <Bar dataKey="value" fill="#ff7a59" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Recent activity"
              description="Short operational updates tied to the current analytics snapshot."
            >
              <div className="space-y-3">
                {model.recentActivity.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-line bg-[var(--surface-strong)] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-main">{item.title}</p>
                      <Badge tone="neutral">{item.time}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <SectionCard
              title="Top profiles and top-performing content"
              description="A quick ranking layer that feels closer to a real analytics product than plain saved cards."
            >
              <div className="space-y-3">
                {model.topProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="rounded-2xl border border-line bg-[var(--surface-strong)] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge tone="accent">{profile.platform}</Badge>
                          <p className="font-semibold text-main">{profile.handle}</p>
                        </div>
                        <p className="mt-3 text-sm text-muted">{profile.contentTitle}</p>
                      </div>
                      <div className="grid gap-2 text-right text-sm text-muted">
                        <span>{profile.engagementRate}% engagement</span>
                        <span>{profile.momentumScore} momentum</span>
                        <span>{profile.sentimentScore}% sentiment</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="grid gap-4">
              <SectionCard
                title="Recommendations"
                description="Actionable guidance instead of decorative filler."
              >
                <div className="space-y-3">
                  {model.recommendations.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl surface-soft px-4 py-4 text-sm leading-6 text-muted"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Watchouts and alerts"
                description="Focused risk signals to keep the product high-signal, not crowded."
              >
                {model.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {model.alerts.map((alert) => (
                      <div
                        key={alert}
                        className="rounded-2xl border border-amber-300/35 bg-[var(--warning-soft)] px-4 py-4 text-sm leading-6 text-muted"
                      >
                        {alert}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No alerts"
                    description="SocioLyzer will surface notable movement here when the workspace shows risk or unusual change."
                  />
                )}
              </SectionCard>
            </div>
          </section>
        </>
      )}

      <WorkspaceForm isSaving={isSaving} onSubmit={handleCreateWorkspace} />

      <SectionCard
        title="Workspace library"
        description="Manage your saved workspaces, review tracked profiles, and delete safely when something is no longer needed."
      >
        {sortedWorkspaces.length > 0 ? (
          <div className="space-y-3">
            {sortedWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="rounded-3xl border border-line bg-[var(--surface-strong)] p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-main">{workspace.name}</p>
                      <Badge tone="neutral">{workspace.profileCount} profiles</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {workspace.description || 'No description added yet.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {workspace.profiles.slice(0, 4).map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center gap-2 rounded-2xl surface-soft px-3 py-2 text-sm text-muted"
                        >
                          <PlatformPill platform={profile.platform} />
                          <span className="max-w-[160px] truncate font-medium text-main">
                            {profile.handle || profile.url}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => setWorkspaceToDelete(workspace)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No saved workspaces yet"
            description="Create your first workspace above to start organizing profiles for analytics, monitoring, and reporting."
          />
        )}
      </SectionCard>

      <ConfirmModal
        isOpen={Boolean(workspaceToDelete)}
        title="Delete workspace?"
        description={
          workspaceToDelete
            ? `This will permanently delete ${workspaceToDelete.name} and its related profile records from Firestore. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete workspace"
        isPending={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setWorkspaceToDelete(null)
          }
        }}
        onConfirm={() => void handleDeleteWorkspace()}
      />
    </div>
  )
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
