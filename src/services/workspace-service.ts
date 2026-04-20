import type { User } from 'firebase/auth'
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase/client'
import {
  userDocumentPath,
  workspaceProfilesCollectionPath,
  workspacesCollectionPath,
} from '../lib/firebase/paths'
import {
  detectPlatformFromLink,
  getHandleFromLink,
  normalizeProfileLink,
} from '../features/workspaces/platform-detection'
import type {
  TrackedProfile,
  WorkspaceDocument,
  WorkspaceWithProfiles,
} from '../types/workspace'

type CreateWorkspacePayload = {
  name: string
  description: string
  links: string[]
}

export async function createWorkspace(user: User, payload: CreateWorkspacePayload) {
  const firestore = db

  if (!firestore) {
    throw new Error('Firestore is not configured yet. Add your Firebase env values.')
  }

  const workspaceRef = doc(collection(firestore, workspacesCollectionPath(user.uid)))
  const normalizedProfiles = payload.links.map<TrackedProfile>((link) => ({
    id: crypto.randomUUID(),
    url: normalizeProfileLink(link),
    platform: detectPlatformFromLink(link),
    handle: getHandleFromLink(link),
    status: 'ready_for_processing',
    createdAt: new Date().toISOString(),
  }))

  await runTransaction(firestore, async (transaction) => {
    transaction.set(doc(firestore, userDocumentPath(user.uid)), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: serverTimestamp(),
    }, { merge: true })

    transaction.set(workspaceRef, {
      name: payload.name,
      description: payload.description,
      status: 'draft',
      profileCount: normalizedProfiles.length,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies WorkspaceDocument)

    for (const profile of normalizedProfiles) {
      const profileRef = doc(
        firestore,
        workspaceProfilesCollectionPath(user.uid, workspaceRef.id),
        profile.id,
      )
      transaction.set(profileRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
  })
}

export async function deleteWorkspace(userId: string, workspaceId: string) {
  const firestore = db

  if (!firestore) {
    throw new Error('Firestore is not configured yet. Add your Firebase env values.')
  }

  const profilesSnapshot = await getDocs(
    collection(firestore, workspaceProfilesCollectionPath(userId, workspaceId)),
  )

  const batch = writeBatch(firestore)

  profilesSnapshot.docs.forEach((profileDoc) => {
    batch.delete(profileDoc.ref)
  })

  batch.delete(doc(firestore, `${workspacesCollectionPath(userId)}/${workspaceId}`))
  await batch.commit()
}

export function subscribeToUserWorkspaces(
  userId: string,
  onNext: (workspaces: WorkspaceWithProfiles[]) => void,
) {
  const firestore = db

  if (!firestore) {
    onNext([])
    return () => undefined
  }

  const workspaceQuery = query(
    collection(firestore, workspacesCollectionPath(userId)),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(workspaceQuery, async (snapshot) => {
    const workspaces = await Promise.all(
      snapshot.docs.map(async (workspaceDoc) => {
        const profilesSnapshot = await getDocs(
          collection(firestore, workspaceProfilesCollectionPath(userId, workspaceDoc.id)),
        )

        const profiles = profilesSnapshot.docs.map((profileDoc) => {
          const data = profileDoc.data()
          return {
            id: profileDoc.id,
            url: data.url as string,
            platform: data.platform as TrackedProfile['platform'],
            handle: (data.handle as string) || '',
            status: data.status as string,
            createdAt: timestampToIso(data.createdAt),
          }
        })

        const data = workspaceDoc.data()
        return {
          id: workspaceDoc.id,
          name: data.name as string,
          description: (data.description as string) || '',
          status: (data.status as string) || 'draft',
          profileCount: Number(data.profileCount) || profiles.length,
          createdAt: timestampToIso(data.createdAt),
          profiles,
        } satisfies WorkspaceWithProfiles
      }),
    )

    onNext(workspaces)
  })
}

function timestampToIso(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString()
  }

  if (typeof value === 'string') {
    return value
  }

  return new Date().toISOString()
}
