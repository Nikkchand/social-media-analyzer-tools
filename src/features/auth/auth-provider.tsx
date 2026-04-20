import { onAuthStateChanged, type User } from 'firebase/auth'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { auth, isFirebaseConfigured } from '../../lib/firebase/client'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(auth && isFirebaseConfigured))

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
