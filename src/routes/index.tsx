import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { PanelLeft } from 'lucide-react'

import {
  ChatInput,
  ChatMessage,
  LoadingIndicator,
  SettingsDialog,
  Sidebar,
  WelcomeScreen,
} from '../components'
import { actions, store, useAppState, useConversations } from '../store'
import {
  ERROR_MESSAGE_PREFIX,
  
  genAIResponse,
  getChatConfig
} from '../utils'
import type {Message} from '../utils';

export const Route = createFileRoute('/')({
  loader: () => getChatConfig(),
  head: () => ({ meta: [{ title: 'Chat · TanStack Chat Starter' }] }),
  component: Home,
})

function createTitleFromInput(text: string) {
  const words = text.trim().split(/\s+/)
  return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '')
}

function newId() {
  return crypto.randomUUID()
}

function Home() {
  const { hasApiKey, model } = Route.useLoaderData()
  const generate = useServerFn(genAIResponse)

  const {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
  } = useConversations()
  const { isLoading, setLoading, getActivePrompt } = useAppState()

  const messages = currentConversation?.messages ?? []

  const [input, setInput] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Keep the newest content in view while messages stream in
  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, pendingMessage?.content, isLoading])

  const streamAssistantReply = useCallback(
    async (conversationId: string, history: Array<Message>) => {
      const activePrompt = getActivePrompt(store.state)
      const systemPrompt = activePrompt
        ? { value: activePrompt.content, enabled: true }
        : undefined

      let reply: Message = { id: newId(), role: 'assistant', content: '' }

      try {
        const response = await generate({ data: { messages: history, systemPrompt } })
        if (!response.ok || !response.body) {
          const body = await response.json().catch(() => null)
          throw new Error(body?.error ?? `Request failed (${response.status})`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          // `stream: true` keeps multi-byte characters intact across chunk boundaries
          reply = { ...reply, content: reply.content + decoder.decode(value, { stream: true }) }
          setPendingMessage(reply)
        }
        reply = { ...reply, content: reply.content + decoder.decode() }

        if (reply.content.trim()) await addMessage(conversationId, reply)
      } catch (err) {
        console.error('Error in AI response:', err)
        const detail = err instanceof Error ? ` (${err.message})` : ''
        await addMessage(conversationId, {
          id: newId(),
          role: 'assistant',
          content: `${ERROR_MESSAGE_PREFIX} generating a response${detail}. Check that ANTHROPIC_API_KEY is set on the server.`,
        })
      } finally {
        setPendingMessage(null)
      }
    },
    [generate, getActivePrompt, addMessage],
  )

  const handleSubmit = useCallback(
    async (_e?: React.FormEvent, overrideText?: string) => {
      const text = (overrideText ?? input).trim()
      if (!text || isLoading) return

      setInput('')
      setLoading(true)
      setError(null)

      const userMessage: Message = { id: newId(), role: 'user', content: text }

      try {
        let conversationId = currentConversationId
        if (!conversationId) {
          conversationId = await createNewConversation(createTitleFromInput(text))
        }
        // Read the history *before* adding the new message (the store updates synchronously)
        const history = [
          ...(store.state.conversations.find((c) => c.id === conversationId)?.messages ?? []),
          userMessage,
        ]
        await addMessage(conversationId, userMessage)
        await streamAssistantReply(conversationId, history)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred.')
      } finally {
        setLoading(false)
      }
    },
    [input, isLoading, currentConversationId, createNewConversation, addMessage, streamAssistantReply, setLoading],
  )

  const visibleMessages = pendingMessage ? [...messages, pendingMessage] : messages

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem)] overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={() => {
          // Start a fresh welcome screen; the conversation is created on first message
          actions.setCurrentConversationId(null)
          setIsSidebarOpen(false)
        }}
        onSelect={(id) => {
          setCurrentConversationId(id)
          setIsSidebarOpen(false)
        }}
        onDelete={deleteConversation}
        onRename={updateConversationTitle}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open conversations"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
          >
            <PanelLeft className="size-5" />
          </button>
          <span className="truncate text-sm font-medium">
            {currentConversation?.title ?? 'New chat'}
          </span>
        </div>

        {!hasApiKey && (
          <div className="mx-auto mt-4 w-[calc(100%-2rem)] max-w-3xl rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm">
            <p className="font-medium">This app requires an Anthropic API key to chat.</p>
            <p className="text-muted">
              Set <code className="font-mono">ANTHROPIC_API_KEY</code> in your{' '}
              <code className="font-mono">.env</code> file or get a{' '}
              <a href="https://console.anthropic.com/settings/keys" className="text-accent underline">
                new Anthropic key
              </a>
              .
            </p>
          </div>
        )}
        {error && (
          <p role="alert" className="mx-auto w-full max-w-3xl px-4 pt-4 font-semibold text-accent-2">
            {error}
          </p>
        )}

        {currentConversationId ? (
          <>
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-3xl space-y-1 px-2 py-4 sm:px-4">
                {visibleMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && !pendingMessage && <LoadingIndicator />}
              </div>
            </div>
            <div className="border-t border-line bg-surface/80 backdrop-blur-sm">
              <div className="mx-auto w-full max-w-3xl px-4 py-3">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
                <p className="mt-1.5 text-center text-[11px] text-muted">
                  Responses by <span className="font-mono">{model}</span> · Shift+Enter for a new line
                </p>
              </div>
            </div>
          </>
        ) : (
          <WelcomeScreen
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </main>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
