import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

/** Consistent page frame for the content pages (About, Examples). */
export function PageShell({
  eyebrow,
  title,
  description,
  back,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  back?: boolean
  children: ReactNode
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
      {back && (
        <Link
          to="/examples"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" /> All examples
        </Link>
      )}
      <header className="mb-10 max-w-3xl motion-safe:animate-fade-up">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-widest text-accent uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-lg text-muted">{description}</p>}
      </header>
      {children}
    </main>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface-2 p-5 ${className}`}>
      {children}
    </div>
  )
}
