import { Link, createFileRoute } from '@tanstack/react-router'
import { Bot, Database, ExternalLink, MonitorSmartphone, Moon, Rocket, ShieldCheck } from 'lucide-react'

import { Card, PageShell } from '../components/PageShell'
import { categoryLabels, stack } from '../lib/stack'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'About · TanStack Chat Starter' }] }),
  component: About,
})

const features = [
  { Icon: Bot, title: 'Streaming Claude chat', body: 'Replies stream token-by-token from a type-safe server function. Your API key never leaves the server.' },
  { Icon: Database, title: 'Optional persistence', body: 'Works in-memory out of the box. Add a Convex URL and conversations sync in realtime.' },
  { Icon: Moon, title: 'Light & dark themes', body: 'Semantic Tailwind tokens, a system-aware toggle and no flash of the wrong theme.' },
  { Icon: MonitorSmartphone, title: 'Responsive layout', body: 'Collapsible conversation drawer on phones, full sidebar on desktop.' },
  { Icon: ShieldCheck, title: 'Sanitized markdown', body: 'Rich formatting and syntax highlighting with rehype-sanitize keeping output safe.' },
  { Icon: Rocket, title: 'Deploy in a click', body: 'The Netlify Vite plugin builds for production and emulates the platform locally.' },
]

function About() {
  return (
    <PageShell
      eyebrow="About this template"
      title={
        <>
          A modern AI chat starter, built on <span className="text-brand">TanStack</span>
        </>
      }
      description="Everything you need for a production-ready, full-stack chat app: routing, server functions, state, styling and deployment — wired together and ready to extend."
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
        <figure className="overflow-hidden rounded-2xl border border-line shadow-xl shadow-accent/5">
          <img
            src="/images/tanstack-starter-preview.jpg"
            alt="Screenshot of the TanStack Chat welcome screen"
            className="w-full"
            loading="lazy"
          />
        </figure>
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <img src="/logo512.png" alt="TanStack logo" className="size-28 rounded-3xl shadow-lg" />
          <p className="text-muted">
            Start chatting right away, or explore the examples to see how
            routes, loaders, search params and server routes fit together.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="bg-brand rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Open the chat
            </Link>
            <Link to="/examples" className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-surface-2">
              Browse examples
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, body }) => (
            <Card key={title}>
              <div className="bg-brand mb-3 grid size-10 place-items-center rounded-xl text-white">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">Tech stack</h2>
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Tool</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Area</th>
                <th className="px-4 py-3 font-medium">What it does here</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {stack.map((item) => (
                <tr key={item.name} className="hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                      {item.name} <ExternalLink className="size-3 opacity-50" />
                    </a>
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">{categoryLabels[item.category]}</td>
                  <td className="px-4 py-3 text-muted">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  )
}
