import { ArrowRight, BarChart3, Link2, Lock, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocioLogo } from '../components/brand/socio-logo'
import { Button } from '../components/common/button'
import { ThemeToggle } from '../components/layout/theme-toggle'
import { useAuth } from '../features/auth/use-auth'
import { signInWithGoogle } from '../lib/firebase/auth'
import { isFirebaseConfigured } from '../lib/firebase/client'

const featureCards = [
  {
    title: 'Profile links first',
    description:
      'Paste creator, brand, or competitor profile links to create a workspace in seconds.',
    icon: <Link2 className="size-5" />,
  },
  {
    title: 'Private by design',
    description:
      'Each user only accesses their own workspaces, which keeps the Firebase setup safer and easier to understand.',
    icon: <Lock className="size-5" />,
  },
  {
    title: 'Useful from day one',
    description:
      'SocioLyzer turns your saved profiles into charts, scores, recommendations, and benchmark-ready views.',
    icon: <BarChart3 className="size-5" />,
  },
]

export function LandingPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState('')

  async function handleGoogleLogin() {
    try {
      setLoginError('')
      await signInWithGoogle()
      navigate('/app')
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : 'Google sign-in failed. Check your Firebase Auth setup and authorized domains.',
      )
    }
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6">
        <header className="panel flex items-center justify-between px-6 py-5">
          <SocioLogo />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Button variant="secondary" onClick={() => navigate('/app')}>
                Open dashboard
                <ArrowRight className="size-4" />
              </Button>
            ) : null}
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="panel relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12">
            <div className="absolute inset-0 bg-grid bg-[size:24px_24px] opacity-40" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-[var(--accent-soft)] px-4 py-2 text-sm text-[var(--accent)]">
                <Sparkles className="size-4" />
                Beginner-friendly analytics workspace
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-main sm:text-6xl">
                Analyze social profiles from the links you already have.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                SocioLyzer helps you sign in, save profile links, compare creator or
                brand workspaces, and turn them into useful growth, engagement, and
                sentiment-oriented insights.
              </p>

              <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  'Executive dashboard',
                  'Monitoring and competitor views',
                  'Light and dark mode ready',
                ].map((item) => (
                  <div key={item} className="rounded-2xl surface-soft px-4 py-3 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="min-w-56"
                  variant="primary"
                  onClick={() => void handleGoogleLogin()}
                  disabled={!isFirebaseConfigured || isLoading}
                >
                  Continue with Google
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="ghost" onClick={() => navigate('/app')} disabled={!user}>
                  Preview dashboard
                </Button>
              </div>

              {!isFirebaseConfigured ? (
                <div className="mt-6 rounded-3xl border border-amber-300/35 bg-[var(--warning-soft)] px-5 py-4 text-sm leading-6 text-main">
                  Add your Firebase values to `.env.local` before Google sign-in will work.
                  I already created `.env.example` so you can copy the exact keys.
                </div>
              ) : null}

              {loginError ? (
                <div className="mt-4 rounded-3xl border border-rose-300/35 bg-[var(--danger-soft)] px-5 py-4 text-sm leading-6 text-main">
                  {loginError}
                </div>
              ) : null}
            </div>
          </section>

          <section className="grid gap-6">
            {featureCards.map((card) => (
              <article key={card.title} className="panel p-6">
                <div className="inline-flex rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                  {card.icon}
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-main">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
              </article>
            ))}

            <article className="panel surface-dark p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-white/60">SocioLyzer stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['React', 'Vite', 'Tailwind CSS', 'Firebase Auth', 'Firestore', 'Recharts'].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white/10 px-3 py-1.5 text-sm"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}
