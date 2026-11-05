import { Monitor, Moon, Sun } from 'lucide-react'

import {  setTheme, useTheme } from '../lib/theme'
import type {Theme} from '../lib/theme';

const options: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

export function ThemeToggle() {
  const theme = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center gap-0.5 rounded-full border border-line bg-surface-2 p-0.5"
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={`grid size-7 place-items-center rounded-full transition-colors ${
            theme === value
              ? 'bg-surface text-accent shadow-sm'
              : 'text-muted hover:text-fg'
          }`}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}
