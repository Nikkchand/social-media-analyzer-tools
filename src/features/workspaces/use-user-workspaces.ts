import { useEffect, useState } from 'react'
import { subscribeToUserWorkspaces } from '../../services/workspace-service'
import { useAuth } from '../auth/use-auth'
import type { WorkspaceWithProfiles } from '../../types/workspace'

export function useUserWorkspaces() {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState<WorkspaceWithProfiles[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      return undefined
    }

    const unsubscribe = subscribeToUserWorkspaces(user.uid, (nextWorkspaces) => {
      setWorkspaces(nextWorkspaces)
      setIsLoading(false)
    })

    return unsubscribe
  }, [user])

  return {
    workspaces: user ? workspaces : [],
    isLoading: user ? isLoading : false,
  }
}
