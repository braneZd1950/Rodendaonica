/**
 * Centralna konfiguracija okruženja.
 * U produkciji postavite VITE_API_MODE=http i VITE_API_BASE_URL na stvarni backend.
 */
function readApiMode(): 'mock' | 'http' {
  const raw = import.meta.env.VITE_API_MODE
  return raw === 'http' ? 'http' : 'mock'
}

export const env = {
  apiMode: readApiMode(),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  isMock: readApiMode() === 'mock',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
