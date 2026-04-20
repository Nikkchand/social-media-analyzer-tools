import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

initializeApp()

export const prepareWorkspaceProfile = onDocumentCreated(
  {
    document: 'users/{userId}/workspaces/{workspaceId}/profiles/{profileId}',
    region: 'asia-south1',
  },
  async (event) => {
    const snapshot = event.data

    if (!snapshot) {
      logger.warn('No profile snapshot found for workspace preparation event.')
      return
    }

    const data = snapshot.data()
    const db = getFirestore()

    await snapshot.ref.set(
      {
        normalizedUrl: data.url,
        analyticsState: 'queued',
        processingNotes:
          'Phase 1 placeholder. Future jobs can fetch metrics, sentiment, and trend data here.',
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    await db
      .doc(`users/${event.params.userId}/workspaces/${event.params.workspaceId}`)
      .set(
        {
          lastPreparedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )

    logger.info('Prepared workspace profile for future analytics processing.', {
      userId: event.params.userId,
      workspaceId: event.params.workspaceId,
      profileId: event.params.profileId,
    })
  },
)
