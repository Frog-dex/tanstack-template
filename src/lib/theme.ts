import { Store, useStore } from '@tanstack/react-store'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'tanstack-chat-theme'

/**
 * Inline script rendered in <head> so the correct theme class is applied
 * before first paint (prevents a light/dark flash on load).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=t}catch(e){document.documentElement.classList.add('dark')}})()`

export const themeStore = new Store<{ theme: Theme }>({ theme: 'system' })

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function apply(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && prefersDark())
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.dataset.theme = theme
}

export function setTheme(theme: Theme) {
  themeStore.setState(() => ({ theme }))
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // storage may be unavailable (private mode); the theme still applies
  }
  apply(theme)
}

/** Sync the store with what the init script picked, and follow OS changes. */
export function initThemeListener() {
  const stored = (document.documentElement.dataset.theme as Theme | undefined) ?? 'system'
  themeStore.setState(() => ({ theme: stored }))
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (themeStore.state.theme === 'system') apply('system')
  }
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

export function useTheme() {
  return useStore(themeStore, (s) => s.theme)
}
