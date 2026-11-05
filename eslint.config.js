// @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: [
      '.output/**',
      'dist/**',
      '.netlify/**',
      '.tanstack/**',
      'src/routeTree.gen.ts',
      'convex/_generated/**',
      'eslint.config.js',
    ],
  },
  ...tanstackConfig,
]
