import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div>
        <p className="text-brand text-7xl font-black">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          to="/"
          className="bg-brand mt-6 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Back to chat
        </Link>
      </div>
    </main>
  )
}
