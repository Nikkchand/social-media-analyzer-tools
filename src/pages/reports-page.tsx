import { useMemo, useState } from 'react'
import { FileJson, PlusCircle, TableProperties } from 'lucide-react'
import { Button } from '../components/common/button'
import { Badge } from '../components/common/badge'
import { EmptyState } from '../components/common/empty-state'
import { LoadingSkeleton } from '../components/common/loading-skeleton'
import { PageHeader } from '../components/common/page-header'
import { SectionCard } from '../components/common/section-card'
import { useSocialAnalytics } from '../features/analytics/use-social-analytics'
import { useToast } from '../features/toast/use-toast'
import { downloadTextFile } from '../lib/download'

type GeneratedReport = {
  id: string
  title: string
  cadence: 'Weekly' | 'Monthly'
  createdAt: string
  summary: string
  status: 'Ready'
}

export function ReportsPage() {
  const { model, workspaces, isLoading } = useSocialAnalytics()
  const { pushToast } = useToast()
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])

  const reports = useMemo(() => generatedReports, [generatedReports])

  function createReport() {
    if (workspaces.length === 0) {
      pushToast({
        tone: 'info',
        title: 'No workspaces to report on yet',
        description: 'Create at least one workspace before generating a report.',
      })
      return
    }

    const report: GeneratedReport = {
      id: crypto.randomUUID(),
      title: `${workspaces[0].name} summary`,
      cadence: workspaces.length > 1 ? 'Monthly' : 'Weekly',
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      summary: `Portfolio snapshot covering ${model.kpis.trackedProfiles} tracked profiles, ${model.kpis.engagementRate}% engagement, and ${model.kpis.sentimentScore}% sentiment.`,
      status: 'Ready',
    }

    setGeneratedReports((current) => [report, ...current])
    pushToast({
      tone: 'success',
      title: 'Report generated',
      description: `${report.title} is ready for export.`,
    })
  }

  function exportCsv(report: GeneratedReport) {
    const lines = [
      ['Report Title', report.title],
      ['Cadence', report.cadence],
      ['Created At', report.createdAt],
      ['Tracked Profiles', String(model.kpis.trackedProfiles)],
      ['Engagement Rate', `${model.kpis.engagementRate}%`],
      ['Sentiment Score', `${model.kpis.sentimentScore}%`],
      ['Audience Estimate', String(model.kpis.audienceEstimate)],
      ['Momentum Score', String(model.kpis.momentumScore)],
      ['Summary', report.summary],
    ]
      .map((line) => line.map(escapeCsv).join(','))
      .join('\n')

    downloadTextFile(`${slugify(report.title)}.csv`, lines, 'text/csv;charset=utf-8')
    pushToast({
      tone: 'success',
      title: 'CSV exported',
      description: `${report.title} was downloaded as CSV.`,
    })
  }

  function exportStructuredReport(report: GeneratedReport) {
    const payload = {
      report,
      overview: model.kpis,
      topProfiles: model.topProfiles,
      recommendations: model.recommendations,
      alerts: model.alerts,
    }

    downloadTextFile(
      `${slugify(report.title)}.json`,
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8',
    )
    pushToast({
      tone: 'success',
      title: 'Structured report downloaded',
      description: `${report.title} was downloaded as JSON.`,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="A report center with working exports and cleaner reporting flow"
        description="Generate a report from your current workspace analytics, then export it as CSV or structured JSON for sharing or future automation."
        actions={
          <Button variant="secondary" onClick={createReport}>
            <PlusCircle className="size-4" />
            Generate report
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton className="h-80" />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports generated yet"
          description={
            workspaces.length === 0
              ? 'Create a workspace first, then generate your first report from the current analytics snapshot.'
              : 'Generate your first report to create an export-ready analytics summary.'
          }
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {reports.map((report) => (
            <SectionCard
              key={report.id}
              title={report.title}
              description={report.summary}
              action={<Badge tone="success">{report.status}</Badge>}
            >
              <div className="space-y-4">
                <div className="rounded-2xl surface-soft px-4 py-3 text-sm text-muted">
                  {report.cadence} report · Generated {report.createdAt}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="ghost" onClick={() => exportCsv(report)}>
                    <TableProperties className="size-4" />
                    Export CSV
                  </Button>
                  <Button variant="secondary" onClick={() => exportStructuredReport(report)}>
                    <FileJson className="size-4" />
                    Download JSON
                  </Button>
                </div>
              </div>
            </SectionCard>
          ))}
        </section>
      )}

      {reports.length > 0 ? (
        <SectionCard
          title="Report contents"
          description="Each generated report includes the current executive summary, top profiles, recommendations, and watchouts."
        >
          <div className="grid gap-3 md:grid-cols-4">
            {[
              'Executive KPI summary',
              'Top profile snapshot',
              'Recommendations',
              'Alert summary',
            ].map((item) => (
              <div key={item} className="rounded-2xl surface-soft px-4 py-4 text-sm text-muted">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  )
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}
