export const usersCollectionPath = 'users'

export function userDocumentPath(userId: string) {
  return `${usersCollectionPath}/${userId}`
}

export function workspacesCollectionPath(userId: string) {
  return `${userDocumentPath(userId)}/workspaces`
}

export function workspaceDocumentPath(userId: string, workspaceId: string) {
  return `${workspacesCollectionPath(userId)}/${workspaceId}`
}

export function workspaceProfilesCollectionPath(userId: string, workspaceId: string) {
  return `${workspaceDocumentPath(userId, workspaceId)}/profiles`
}
