import { Link, createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router'
import { ArrowDownAZ, ExternalLink, Search } from 'lucide-react'

import { PageShell } from '../../components/PageShell'
import {  categoryLabels, stack } from '../../lib/stack'
import type {StackCategory} from '../../lib/stack';

const categories = ['all', ...Object.keys(categoryLabels)] as Array<StackCategory | 'all'>
const sorts = ['name', 'category'] as const

interface CatalogSearch {
  q: string
  category: StackCategory | 'all'
  sort: (typeof sorts)[number]
}

const defaultSearch: CatalogSearch = { q: '', category: 'all', sort: 'name' }

export const Route = createFileRoute('/examples/search-params')({
  // Validate untrusted URL input into a typed object with safe defaults
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === 'string' ? search.q.slice(0, 50) : '',
    category: categories.includes(search.category as CatalogSearch['category'])
      ? (search.category as CatalogSearch['category'])
      : 'all',
    sort: search.sort === 'category' ? 'category' : 'name',
  }),
  // Keep URLs tidy by omitting params that equal their defaults
  search: { middlewares: [stripSearchParams(defaultSearch)] },
  head: () => ({ meta: [{ title: 'Search params · Examples' }] }),
  component: SearchParamsExample,
})

function SearchParamsExample() {
  const { q, category, sort } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const results = stack
    .filter((item) => category === 'all' || item.category === category)
    .filter((item) =>
      `${item.name} ${item.description}`.toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
    )

  return (
    <PageShell
      back
      eyebrow="Example"
      title="Type-safe search params"
      description="Filter and sort the tech stack. Every control writes to the URL, so state survives reloads and can be shared — and Route.useSearch() is fully typed."
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) =>
              navigate({ search: (prev) => ({ ...prev, q: e.target.value }), replace: true })
            }
            placeholder="Search the stack…"
            className="w-full rounded-xl border border-line bg-surface-2 py-2.5 pr-3 pl-9 text-sm focus:ring-2 focus:ring-accent/50 focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Category">
          {categories.map((c) => (
            <Link
              key={c}
              from={Route.fullPath}
              search={(prev) => ({ ...prev, category: c })}
              replace
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? 'bg-brand border-transparent text-white'
                  : 'border-line text-muted hover:text-fg'
              }`}
            >
              {c === 'all' ? 'All' : categoryLabels[c]}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, sort: sort === 'name' ? 'category' : 'name' }), replace: true })
          }
          className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm text-muted hover:text-fg"
        >
          <ArrowDownAZ className="size-4" /> Sort: {sort}
        </button>
      </div>

      <p className="mt-6 font-mono text-xs text-muted">
        ?q={JSON.stringify(q)}&amp;category={category}&amp;sort={sort} → {results.length} result
        {results.length === 1 ? '' : 's'}
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <li key={item.name} className="motion-safe:animate-fade-up rounded-2xl border border-line bg-surface-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{item.name}</h2>
              <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                {categoryLabels[item.category]}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted">{item.description}</p>
            <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline">
              Website <ExternalLink className="size-3" />
            </a>
          </li>
        ))}
        {results.length === 0 && (
          <li className="col-span-full rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            Nothing matches “{q}”. Try another search.
          </li>
        )}
      </ul>
    </PageShell>
  )
}
