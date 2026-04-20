import { LoaderCircle, Plus, Sparkles, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Button } from '../common/button'
import { PlatformPill } from './platform-pill'
import {
  detectPlatformFromLink,
  getHandleFromLink,
  normalizeProfileLink,
} from '../../features/workspaces/platform-detection'
import type { SupportedPlatform } from '../../types/workspace'

type DraftProfile = {
  id: string
  url: string
  platform: SupportedPlatform
  handle: string
}

type WorkspaceFormProps = {
  isSaving: boolean
  onSubmit: (payload: {
    name: string
    description: string
    links: string[]
  }) => Promise<void>
}

export function WorkspaceForm({ isSaving, onSubmit }: WorkspaceFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [profiles, setProfiles] = useState<DraftProfile[]>([])
  const [error, setError] = useState('')

  const draftDetection = useMemo(() => {
    if (!linkInput.trim()) {
      return null
    }

    try {
      const normalized = normalizeProfileLink(linkInput)
      return {
        normalized,
        platform: detectPlatformFromLink(normalized),
        handle: getHandleFromLink(normalized),
      }
    } catch {
      return null
    }
  }, [linkInput])

  function addProfile() {
    if (!draftDetection) {
      return
    }

    const normalized = draftDetection.normalized

    if (profiles.some((profile) => profile.url === normalized)) {
      setError('That profile link is already in this workspace draft.')
      return
    }

    setProfiles((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        url: normalized,
        platform: draftDetection.platform,
        handle: draftDetection.handle,
      },
    ])
    setLinkInput('')
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Please add a workspace name so you can recognize it later.')
      return
    }

    if (profiles.length === 0) {
      setError('Add at least one social profile link to create a workspace.')
      return
    }

    setError('')
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        links: profiles.map((profile) => profile.url),
      })
      setName('')
      setDescription('')
      setLinkInput('')
      setProfiles([])
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong while saving your workspace.',
      )
    }
  }

  return (
    <form className="panel p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Create workspace
          </p>
          <h2 className="section-title mt-3">Add brand and competitor profiles</h2>
          <p className="muted-copy mt-3 max-w-2xl">
            Use workspaces to group your own profiles with competitors, creators, or campaign references.
          </p>
        </div>
        <div className="rounded-2xl surface-soft px-4 py-3 text-sm text-muted">
          Clean input now, richer analytics structure later.
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-main">Workspace name</span>
          <input
            className="w-full rounded-2xl border border-line bg-[var(--surface-strong)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            placeholder="Beauty brands benchmark"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-main">Description</span>
          <input
            className="w-full rounded-2xl border border-line bg-[var(--surface-strong)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            placeholder="Track competitors, mentions, and momentum"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 rounded-[2rem] border border-line surface-soft p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-main">Profile link</span>
            <input
              className="w-full rounded-2xl border border-line bg-[var(--surface-strong)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              placeholder="https://www.instagram.com/example"
              value={linkInput}
              onChange={(event) => setLinkInput(event.target.value)}
            />
          </label>

          <Button type="button" className="self-end" onClick={addProfile} disabled={!draftDetection}>
            <Plus className="size-4" />
            Add profile
          </Button>
        </div>

        {draftDetection ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-sm text-muted">
            <PlatformPill platform={draftDetection.platform} />
            <span>
              Platform detected as <strong className="font-semibold text-main">{draftDetection.platform}</strong>
            </span>
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--accent)]">
              Handle: {draftDetection.handle || 'Not found yet'}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-[var(--surface-strong)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <PlatformPill platform={profile.platform} />
                  <span className="font-semibold text-main">{profile.handle || 'Detected profile'}</span>
                </div>
                <p className="mt-2 break-all text-sm text-muted">{profile.url}</p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 self-start rounded-2xl border border-line px-3 py-2 text-sm text-muted transition hover:border-rose-300 hover:text-rose-500"
                onClick={() =>
                  setProfiles((current) => current.filter((item) => item.id !== profile.id))
                }
              >
                <Trash2 className="size-4" />
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-[var(--surface-strong)] px-4 py-6 text-sm text-muted">
            Add one or more profile URLs. SocioLyzer can use these for monitoring, competitor analysis, and trend views.
          </div>
        )}
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-rose-500">{error}</p> : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm text-[var(--accent)]">
          <Sparkles className="size-4" />
          Structured for monitoring, benchmarks, trends, and reporting
        </div>

        <Button type="submit" variant="secondary" disabled={isSaving}>
          {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {isSaving ? 'Saving workspace...' : 'Create workspace'}
        </Button>
      </div>
    </form>
  )
}
