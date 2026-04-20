import type { SupportedPlatform } from '../../types/workspace'

const platformMatchers: Array<{ platform: SupportedPlatform; hostnames: string[] }> = [
  { platform: 'instagram', hostnames: ['instagram.com', 'www.instagram.com'] },
  { platform: 'youtube', hostnames: ['youtube.com', 'www.youtube.com', 'youtu.be'] },
  { platform: 'tiktok', hostnames: ['tiktok.com', 'www.tiktok.com'] },
  { platform: 'x', hostnames: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'] },
  { platform: 'linkedin', hostnames: ['linkedin.com', 'www.linkedin.com'] },
  { platform: 'facebook', hostnames: ['facebook.com', 'www.facebook.com'] },
  { platform: 'threads', hostnames: ['threads.net', 'www.threads.net'] },
]

export function normalizeProfileLink(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  const url = new URL(withProtocol)
  return url.toString().replace(/\/$/, '')
}

export function detectPlatformFromLink(value: string): SupportedPlatform {
  try {
    const url = new URL(normalizeProfileLink(value))
    const hostname = url.hostname.toLowerCase()

    return (
      platformMatchers.find((matcher) => matcher.hostnames.includes(hostname))
        ?.platform ?? 'unknown'
    )
  } catch {
    return 'unknown'
  }
}

export function getHandleFromLink(value: string) {
  try {
    const url = new URL(normalizeProfileLink(value))
    const segments = url.pathname.split('/').filter(Boolean)
    return segments[segments.length - 1] ?? ''
  } catch {
    return ''
  }
}
