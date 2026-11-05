import { createServerFn } from '@tanstack/react-start'
import Anthropic from '@anthropic-ai/sdk'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export const DEFAULT_MODEL = 'claude-opus-5-5'

/** Prefix used for locally generated error replies; these are never sent to the API. */
export const ERROR_MESSAGE_PREFIX = 'Sorry, I encountered an error'

const DEFAULT_SYSTEM_PROMPT = `You are TanStack Chat, an AI assistant using Markdown for clear and structured responses. Format your responses following these guidelines:

1. Use headers for sections:
   # For main topics
   ## For subtopics
   ### For subsections

2. For lists and steps:
   - Use bullet points for unordered lists
   - Number steps when sequence matters
   
3. For code:
   - Use inline \`code\` for short snippets
   - Use triple backticks with language for blocks:
   \`\`\`python
   def example():
       return "like this"
   \`\`\`

4. For emphasis:
   - Use **bold** for important points
   - Use *italics* for emphasis
   - Use > for important quotes or callouts

5. For structured data:
   | Use | Tables |
   |-----|---------|
   | When | Needed |

6. Break up long responses with:
   - Clear section headers
   - Appropriate spacing between sections
   - Bullet points for better readability
   - Short, focused paragraphs

7. For technical content:
   - Always specify language for code blocks
   - Use inline \`code\` for technical terms
   - Include example usage where helpful

Keep responses concise and well-structured. Use appropriate Markdown formatting to enhance readability and understanding.`

/** Read the API key on the server only. VITE_ANTHROPIC_API_KEY is kept as a legacy fallback. */
function getApiKey() {
  return process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
}

/** Lets the UI know whether chat is configured, without exposing the key to the browser. */
export const getChatConfig = createServerFn({ method: 'GET' }).handler(() => ({
  hasApiKey: Boolean(getApiKey()),
  model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
}))

/**
 * Streams Claude's reply as plain UTF-8 text chunks.
 * The client reads the body with a TextDecoder and appends each chunk.
 */
export const genAIResponse = createServerFn({ method: 'POST' })
  .validator(
    (d: {
      messages: Array<Message>
      systemPrompt?: { value: string; enabled: boolean }
    }) => d,
  )
  .handler(({ data }) => {
    const apiKey = getApiKey()
    if (!apiKey) {
      return Response.json(
        { error: 'Missing API key: set ANTHROPIC_API_KEY in your environment.' },
        { status: 500 },
      )
    }

    const messages: Array<Anthropic.MessageParam> = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== '' &&
          !msg.content.startsWith(ERROR_MESSAGE_PREFIX),
      )
      .map((msg) => ({ role: msg.role, content: msg.content.trim() }))

    if (messages.length === 0) {
      return Response.json({ error: 'No valid messages to send' }, { status: 400 })
    }

    const system = data.systemPrompt?.enabled
      ? `${DEFAULT_SYSTEM_PROMPT}\n\n${data.systemPrompt.value}`
      : DEFAULT_SYSTEM_PROMPT

    const anthropic = new Anthropic({ apiKey })
    const stream = anthropic.beta.messages.stream({
      model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
      max_tokens: 64000,
      system,
      messages,
      output_config: { effort: 'low' },
      // If the primary model declines, the API retries on a suitable fallback model
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    })

    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (error) {
          console.error('Error streaming from Anthropic:', error)
          controller.error(error)
        }
      },
      cancel() {
        stream.abort()
      },
    })

    return new Response(body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  })
