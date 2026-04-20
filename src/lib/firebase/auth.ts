import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth, isFirebaseConfigured } from './client'

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export async function signInWithGoogle() {
  if (!auth || !isFirebaseConfigured) {
    throw new Error('Firebase config is missing. Add your Vite env values first.')
  }

  return signInWithPopup(auth, provider)
}

export async function signOutUser() {
  if (!auth) {
    return
  }

  return signOut(auth)
}
