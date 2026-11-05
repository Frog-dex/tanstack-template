import { ErrorComponent, Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  console.error(error)

  return (
    <main className="grid flex-1 place-items-center px-4 py-24">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-surface-2 p-6">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <div className="mt-3 text-sm text-muted">
          <ErrorComponent error={error} />
        </div>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="bg-brand rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-surface-3"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}
