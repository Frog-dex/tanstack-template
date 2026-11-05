import { Link } from '@tanstack/react-router'

import { ThemeToggle } from './ThemeToggle'

const nav = [
  { to: '/', label: 'Chat' },
  { to: '/examples', label: 'Examples' },
  { to: '/about', label: 'About' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 shrink-0 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="/logo192.png" alt="" className="size-7 rounded-md" />
          <span className="hidden sm:inline">
            TanStack <span className="text-brand">Chat</span>
          </span>
        </Link>

        <nav className="ml-2 flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              activeProps={{ className: 'bg-surface-2 !text-fg font-medium' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
