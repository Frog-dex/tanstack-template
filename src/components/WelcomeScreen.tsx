import { Code2, Lightbulb, Sparkles, Table } from 'lucide-react'

import { ChatInput } from './ChatInput'

interface WelcomeScreenProps {
  input: string
  setInput: (value: string) => void
  handleSubmit: (e?: React.FormEvent, text?: string) => void
  isLoading: boolean
}

const suggestions = [
  { Icon: Code2, text: 'Write a TanStack Router route with a typed loader' },
  { Icon: Table, text: 'Compare TanStack Query and SWR in a table' },
  { Icon: Lightbulb, text: 'Explain server functions like I am five' },
  { Icon: Sparkles, text: 'Give me three fun weekend project ideas' },
]

export function WelcomeScreen({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-10">
      <div className="w-full max-w-2xl motion-safe:animate-fade-up text-center">
        <h1 className="text-5xl font-black tracking-tight uppercase sm:text-6xl">
          <span>TanStack</span> <span className="text-brand">Chat</span>
        </h1>
        <p className="mx-auto mt-4 mb-8 max-w-md text-base text-muted sm:text-lg">
          You can ask me about anything, I might or might not have a good
          answer, but you can still ask.
        </p>
        <div className="mx-auto max-w-xl text-left">
          <ChatInput
            variant="hero"
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            autoFocus
          />
        </div>
        <div className="mx-auto mt-6 grid max-w-xl gap-2 sm:grid-cols-2">
          {suggestions.map(({ Icon, text }) => (
            <button
              key={text}
              type="button"
              disabled={isLoading}
              onClick={() => handleSubmit(undefined, text)}
              className="group flex items-start gap-2.5 rounded-xl border border-line bg-surface-2/60 px-3 py-2.5 text-left text-sm text-muted transition-colors hover:border-accent/40 hover:text-fg disabled:opacity-50"
            >
              <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
