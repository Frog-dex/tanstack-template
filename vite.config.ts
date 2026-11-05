import {  defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import type {PluginOption} from 'vite';

const sentryEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN)

const plugins: Array<PluginOption> = [
  tailwindcss(),
  // tanstackStart() must come before the React plugin
  tanstackStart(),
  netlify(),
  viteReact(),
]

// Upload source maps to Sentry only when an auth token is configured
if (sentryEnabled) {
  plugins.push(
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  )
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins,
  build: {
    sourcemap: sentryEnabled,
  },
})
