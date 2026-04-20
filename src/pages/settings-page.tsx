import { Bell, Link2, LogOut, Shield, SunMoon, UserCircle2 } from 'lucide-react'
import { useAuth } from '../features/auth/use-auth'
import { useTheme } from '../features/theme/use-theme'
import { signOutUser } from '../lib/firebase/auth'
import { Button } from '../components/common/button'
import { Badge } from '../components/common/badge'
import { PageHeader } from '../components/common/page-header'
import { SectionCard } from '../components/common/section-card'

export function SettingsPage() {
  const { user } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Manage profile, workspace, theme, privacy, and future integrations"
        description="A clean settings page that feels like part of a real product, while keeping the backend and account model easy for a beginner to maintain."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Profile info" description="Your authenticated user identity from Google sign-in.">
          <div className="rounded-2xl surface-soft p-4">
            <div className="flex items-start gap-3">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <UserCircle2 className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-main">{user?.displayName}</p>
                <p className="mt-1 text-sm text-muted">{user?.email}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Workspace settings" description="Foundational app controls for how your analytics workspace is organized.">
          <div className="space-y-3">
            <SettingRow label="Workspace mode" value="Single-user secure workspace" />
            <SettingRow label="Data model" value="User-scoped Firestore collections" />
            <SettingRow label="Future expansion" value="Ready for live ingestion and reporting" />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Theme" description="Intentional light and dark modes, not just inverted colors.">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                resolvedTheme === 'light'
                  ? 'bg-[var(--surface-dark)] text-white'
                  : 'surface-soft text-main'
              }`}
            >
              Light mode
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                resolvedTheme === 'dark'
                  ? 'bg-[var(--surface-dark)] text-white'
                  : 'surface-soft text-main'
              }`}
            >
              Dark mode
            </button>
            <div className="inline-flex items-center gap-2 rounded-2xl surface-soft px-4 py-3 text-sm text-muted">
              <SunMoon className="size-4 text-[var(--accent)]" />
              Current theme: {resolvedTheme}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notification preferences" description="Placeholder structure for operational product settings.">
          <div className="space-y-3">
            <PreferenceRow label="Weekly summary email" enabled />
            <PreferenceRow label="Alert on sentiment drop" enabled={false} />
            <PreferenceRow label="Report ready notification" enabled />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Connected accounts" description="Future integrations will appear here when live platform connections are added.">
          <div className="rounded-2xl surface-soft p-4 text-sm leading-6 text-muted">
            No platform accounts connected yet. SocioLyzer currently uses profile links and secure workspace storage as the onboarding flow.
          </div>
        </SectionCard>

        <SectionCard title="Data and privacy" description="Keep the product security story visible and understandable.">
          <div className="space-y-3">
            <div className="rounded-2xl surface-soft px-4 py-4 text-sm leading-6 text-muted">
              Users only access their own workspaces and profiles through Firestore security rules.
            </div>
            <div className="rounded-2xl surface-soft px-4 py-4 text-sm leading-6 text-muted">
              Frontend config stays in local environment files. Backend-only secrets should stay out of the client.
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">
                <Shield className="mr-1 size-3" />
                Firestore rules active
              </Badge>
              <Badge tone="accent">
                <Link2 className="mr-1 size-3" />
                Auth-protected
              </Badge>
              <Badge tone="neutral">
                <Bell className="mr-1 size-3" />
                Hosting live
              </Badge>
            </div>
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Session" description="Account-level action for ending the current session.">
        <Button variant="ghost" onClick={() => void signOutUser()}>
          <LogOut className="size-4" />
          Sign out
        </Button>
      </SectionCard>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl surface-soft px-4 py-4 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-main">{value}</span>
    </div>
  )
}

function PreferenceRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl surface-soft px-4 py-4 text-sm">
      <span className="text-muted">{label}</span>
      <Badge tone={enabled ? 'success' : 'neutral'}>{enabled ? 'Enabled' : 'Paused'}</Badge>
    </div>
  )
}
