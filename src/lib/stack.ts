/** Shared data for the About and Examples pages. */
export type StackCategory = 'framework' | 'data' | 'ui' | 'ai' | 'ops'

export interface StackItem {
  name: string
  category: StackCategory
  description: string
  url: string
}

export const stack: Array<StackItem> = [
  { name: 'TanStack Start', category: 'framework', description: 'Full-stack React framework with SSR, streaming and server functions.', url: 'https://tanstack.com/start' },
  { name: 'TanStack Router', category: 'framework', description: 'Fully type-safe file-based routing with search-param validation.', url: 'https://tanstack.com/router' },
  { name: 'TanStack Store', category: 'data', description: 'Tiny framework-agnostic reactive store powering chat and theme state.', url: 'https://tanstack.com/store' },
  { name: 'Convex', category: 'data', description: 'Optional realtime database that persists conversations.', url: 'https://convex.dev' },
  { name: 'React 19', category: 'ui', description: 'Concurrent rendering, transitions and streaming SSR.', url: 'https://react.dev' },
  { name: 'Tailwind CSS 4', category: 'ui', description: 'CSS-first configuration with semantic theme tokens and dark mode.', url: 'https://tailwindcss.com' },
  { name: 'Lucide', category: 'ui', description: 'Clean, consistent open-source icon set.', url: 'https://lucide.dev' },
  { name: 'Claude', category: 'ai', description: 'Anthropic’s models, streamed token-by-token through a server function.', url: 'https://www.anthropic.com/api' },
  { name: 'Vite 8', category: 'ops', description: 'Lightning-fast dev server and production builds.', url: 'https://vite.dev' },
  { name: 'Netlify', category: 'ops', description: 'One-click deploys with full platform emulation in local dev.', url: 'https://netlify.com' },
  { name: 'Sentry', category: 'ops', description: 'Optional error monitoring and session replay.', url: 'https://sentry.io' },
]

export const categoryLabels: Record<StackCategory, string> = {
  framework: 'Framework',
  data: 'Data',
  ui: 'UI',
  ai: 'AI',
  ops: 'Build & Ops',
}
