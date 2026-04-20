import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { primaryNavigation } from '../../app/navigation'
import { useAuth } from '../../features/auth/use-auth'
import { signOutUser } from '../../lib/firebase/auth'
import { SocioLogo } from '../brand/socio-logo'
import { Button } from '../common/button'
import { SidebarNav } from './sidebar-nav'
import { ThemeToggle } from './theme-toggle'

export function AppLayout() {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <button
          type="button"
          className="fixed right-4 top-4 z-40 inline-flex items-center gap-2 rounded-2xl border border-line panel px-4 py-3 text-sm font-semibold text-main lg:hidden"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
        >
          {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          Menu
        </button>

        <aside
          className={`fixed inset-y-4 left-4 z-30 w-[290px] overflow-hidden rounded-[2rem] border border-line shadow-2xl transition duration-300 lg:static lg:block lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%]'
          }`}
          style={{ background: 'var(--sidebar-bg)' }}
        >
          <div className="app-scrollbar flex h-full flex-col overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <SocioLogo />
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-2xl surface-soft text-main"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-line surface-soft p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-soft">Workspace</p>
              <p className="mt-3 text-lg font-semibold text-main">SocioLyzer.web Console</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Calm, focused social intelligence across monitoring, benchmarking, trends, and reporting.
              </p>
            </div>

            <div className="mt-6">
              <SidebarNav
                items={primaryNavigation}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-line p-4 surface-soft">
              <p className="text-xs uppercase tracking-[0.22em] text-soft">Signed in as</p>
              <p className="mt-3 font-semibold text-main">{user?.displayName}</p>
              <p className="text-sm text-muted">{user?.email}</p>
            </div>

            <div className="mt-auto space-y-3 pt-6">
              <ThemeToggle />
              <Button fullWidth variant="ghost" onClick={() => void signOutUser()}>
                <LogOut className="size-4" />
                Sign out
              </Button>
              <p className="px-1 text-center text-xs text-soft">
                Built with love by Rahul Chand
              </p>
            </div>
          </div>
        </aside>

        {isMobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-20 bg-slate-950/35 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}

        <main className="min-w-0 flex-1 pl-0 lg:pl-0">
          <div className="space-y-6 pt-16 lg:pt-0">
            <Outlet />
            <footer className="px-1 pb-2 text-center text-xs text-soft">
              Built with love by Rahul Chand
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
