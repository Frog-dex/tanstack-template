import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'

import type { Message } from '../utils/ai'

const rehypePlugins = [rehypeRaw, rehypeSanitize, rehypeHighlight]

export const ChatMessage = memo(function ChatMessageView({
  message,
}: {
  message: Message
}) {
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={`motion-safe:animate-fade-up py-5 ${
        isAssistant ? 'rounded-2xl bg-accent/[0.04] dark:bg-accent/[0.06]' : ''
      }`}
    >
      <div className="flex w-full items-start gap-3 px-3 sm:gap-4 sm:px-4">
        <div
          className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-semibold ${
            isAssistant ? 'bg-brand text-white' : 'bg-surface-3 text-fg'
          }`}
          aria-hidden
        >
          {isAssistant ? 'AI' : 'Y'}
        </div>
        <div className="prose prose-sm min-w-0 flex-1 dark:prose-invert sm:prose-base">
          <span className="sr-only">{isAssistant ? 'Assistant:' : 'You:'}</span>
          <ReactMarkdown rehypePlugins={rehypePlugins}>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
})
