import { createFileRoute } from '@tanstack/react-router'

const startedAt = Date.now()

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          {
            status: 'ok',
            time: new Date().toISOString(),
            uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
            node: process.version,
            chatConfigured: Boolean(
              process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY,
            ),
            convexConfigured: Boolean(process.env.VITE_CONVEX_URL),
          },
          { headers: { 'Cache-Control': 'no-store' } },
        ),
    },
  },
})
