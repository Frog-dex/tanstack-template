import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Filter, HeartPulse, Server } from 'lucide-react'

import { PageShell } from '../../components/PageShell'

export const Route = createFileRoute('/examples/')({
  head: () => ({ meta: [{ title: 'Examples · TanStack Chat Starter' }] }),
  component: Examples,
})

const examples = [
  {
    to: '/examples/server-functions',
    Icon: Server,
    title: 'Server functions & loaders',
    body: 'Load data on the server during SSR, then call a server mutation from the client with useServerFn.',
    tags: ['createServerFn', 'loader', 'useServerFn'],
  },
  {
    to: '/examples/search-params',
    Icon: Filter,
    title: 'Type-safe search params',
    body: 'A filterable, sortable catalog whose state lives in the URL — validated and fully typed.',
    tags: ['validateSearch', 'useNavigate', 'Link search'],
  },
  {
    to: '/api/health',
    Icon: HeartPulse,
    title: 'Server route (JSON API)',
    body: 'A raw HTTP endpoint defined right next to your pages. Opens the JSON response.',
    tags: ['server.handlers', 'Response.json'],
    external: true,
  },
] as const

function Examples() {
  return (
    <PageShell
      eyebrow="Examples"
      title="See the template in action"
      description="Small, focused pages that demonstrate the core TanStack Start patterns this starter is built on. Each one is a single file in src/routes/examples."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examples.map(({ to, Icon, title, body, tags, ...rest }) => {
          const content = (
            <>
              <div className="flex items-center justify-between">
                <div className="bg-brand grid size-11 place-items-center rounded-xl text-white shadow-lg shadow-accent/20">
                  <Icon className="size-5" />
                </div>
                <ArrowRight className="size-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted">{body}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="rounded-md bg-surface-3 px-2 py-0.5 font-mono text-[11px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )
          const className =
            'group flex flex-col rounded-2xl border border-line bg-surface-2 p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5'
          return 'external' in rest ? (
            <a key={to} href={to} className={className}>
              {content}
            </a>
          ) : (
            <Link key={to} to={to} className={className}>
              {content}
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
