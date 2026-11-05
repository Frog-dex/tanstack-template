import { useEffect, useRef } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  handleSubmit: (e?: React.FormEvent) => void
  isLoading: boolean
  /** Larger, centered variant used on the welcome screen */
  variant?: 'docked' | 'hero'
  autoFocus?: boolean
}

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  variant = 'docked',
  autoFocus,
}: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Auto-grow the textarea (also shrinks it back after the input is cleared)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [input])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e)
      }}
      className="relative"
    >
      <label htmlFor={`chat-input-${variant}`} className="sr-only">
        Message
      </label>
      <textarea
        id={`chat-input-${variant}`}
        ref={ref}
        value={input}
        autoFocus={autoFocus}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            handleSubmit()
          }
        }}
        placeholder="Type something clever (or don't, we won't judge)..."
        rows={variant === 'hero' ? 3 : 1}
        className={`w-full resize-none overflow-y-auto rounded-xl border border-line bg-surface-2 py-3 pr-12 pl-4 text-sm text-fg shadow-sm placeholder:text-muted focus:border-transparent focus:ring-2 focus:ring-accent/50 focus:outline-none ${
          variant === 'hero' ? 'min-h-[88px]' : 'min-h-[48px]'
        }`}
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={!input.trim() || isLoading}
        className="bg-brand absolute right-2 bottom-2.5 grid size-8 place-items-center rounded-lg text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="size-4" />
      </button>
    </form>
  )
}
