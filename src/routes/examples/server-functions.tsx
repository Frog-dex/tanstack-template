import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { Clock, Cpu, MessageSquarePlus, RefreshCw, Server } from 'lucide-react'

import { Card, PageShell } from '../../components/PageShell'

interface Note {
  id: string
  text: string
  createdAt: string
}

// Lives in server memory for the demo; resets when the server restarts.
const notes: Array<Note> = [
  { id: 'welcome', text: 'Hello from the server! Add a note below.', createdAt: new Date().toISOString() },
]

const getServerSnapshot = createServerFn({ method: 'GET' }).handler(() => ({
  renderedAt: new Date().toISOString(),
  node: process.version,
  platform: `${process.platform} / ${process.arch}`,
  memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
  notes: notes.slice(-8).reverse(),
}))

const addNote = createServerFn({ method: 'POST' })
  .validator((data: { text: string }) => {
    const text = data.text.trim().slice(0, 140)
    if (!text) throw new Error('Note cannot be empty')
    return { text }
  })
  .handler(({ data }) => {
    const note = { id: crypto.randomUUID(), text: data.text, createdAt: new Date().toISOString() }
    notes.push(note)
    return note
  })

export const Route = createFileRoute('/examples/server-functions')({
  loader: () => getServerSnapshot(),
  head: () => ({ meta: [{ title: 'Server functions · Examples' }] }),
  component: ServerFunctionsExample,
})

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function ServerFunctionsExample() {
  const data = Route.useLoaderData()
  const router = useRouter()
  const add = useServerFn(addNote)
  const [text, setText] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = [
    { Icon: Clock, label: 'Loaded at', value: formatTime(data.renderedAt) },
    { Icon: Server, label: 'Runtime', value: data.node },
    { Icon: Cpu, label: 'Platform', value: data.platform },
    { Icon: Cpu, label: 'Memory (RSS)', value: `${data.memoryMb} MB` },
  ]

  return (
    <PageShell
      back
      eyebrow="Example"
      title="Server functions & loaders"
      description={
        <>
          The route <code className="font-mono text-base">loader</code> calls a{' '}
          <code className="font-mono text-base">createServerFn</code> that runs only on the server.
          The form below calls a POST server function, then invalidates the router to reload fresh data.
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ Icon, label, value }) => (
          <Card key={label}>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted uppercase">
              <Icon className="size-3.5 text-accent" /> {label}
            </div>
            <p className="mt-2 truncate font-mono text-lg">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <h2 className="flex items-center gap-2 font-semibold">
            <MessageSquarePlus className="size-4 text-accent" /> Leave a note
          </h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault()
              setPending(true)
              setError(null)
              try {
                await add({ data: { text } })
                setText('')
                await router.invalidate()
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong')
              } finally {
                setPending(false)
              }
            }}
          >
            <label htmlFor="note" className="sr-only">Note</label>
            <input
              id="note"
              value={text}
              maxLength={140}
              onChange={(e) => setText(e.target.value)}
              placeholder="Say something nice…"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-accent/50 focus:outline-none"
            />
            {error && <p className="text-sm text-accent-2">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pending || !text.trim()}
                className="bg-brand rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {pending ? 'Saving…' : 'Add note'}
              </button>
              <button
                type="button"
                onClick={() => router.invalidate()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm hover:bg-surface-3"
              >
                <RefreshCw className="size-3.5" /> Reload loader
              </button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="font-semibold">Recent notes</h2>
          <ul className="mt-4 divide-y divide-line">
            {data.notes.map((note) => (
              <li key={note.id} className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="min-w-0 break-words">{note.text}</span>
                <time className="shrink-0 font-mono text-xs text-muted" dateTime={note.createdAt}>
                  {formatTime(note.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageShell>
  )
}
