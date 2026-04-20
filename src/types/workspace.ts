export type SupportedPlatform =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'threads'
  | 'unknown'

export type TrackedProfile = {
  id: string
  url: string
  platform: SupportedPlatform
  handle: string
  status: string
  createdAt: string
}

export type WorkspaceDocument = {
  name: string
  description: string
  status: string
  profileCount: number
  ownerId: string
  createdAt: unknown
  updatedAt: unknown
}

export type WorkspaceWithProfiles = {
  id: string
  name: string
  description: string
  status: string
  profileCount: number
  createdAt: string
  profiles: TrackedProfile[]
}
