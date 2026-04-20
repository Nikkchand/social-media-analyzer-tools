import { useMemo } from 'react'
import { buildSocioAnalyticsModel } from './mock-social-data'
import { useUserWorkspaces } from '../workspaces/use-user-workspaces'

export function useSocialAnalytics() {
  const { workspaces, isLoading } = useUserWorkspaces()

  const model = useMemo(() => buildSocioAnalyticsModel(workspaces), [workspaces])

  return {
    workspaces,
    isLoading,
    model,
  }
}
