export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel px-8 py-6 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-lagoon">Loading</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">Preparing your workspace</h1>
        <p className="mt-3 text-sm leading-6 text-slate/80">
          Checking authentication and loading your analytics dashboard.
        </p>
      </div>
    </div>
  )
}
