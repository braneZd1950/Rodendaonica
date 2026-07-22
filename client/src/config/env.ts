/**
 * Centralna konfiguracija okruženja.
 *
 * Produkcija (Render):
 *   VITE_API_MODE=http
 *   VITE_API_URL=https://rodendaonica-api.onrender.com
 *   — ili —
 *   VITE_API_BASE_URL=https://rodendaonica-api.onrender.com/api
 *
 * Lokalni dev uz Vite proxy: VITE_API_BASE_URL=/api
 */
function readApiMode(): 'mock' | 'http' {
  const raw = import.meta.env.VITE_API_MODE
  return raw === 'http' ? 'http' : 'mock'
}

function resolveApiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  const apiUrl = import.meta.env.VITE_API_URL?.trim()
  if (apiUrl) {
    const cleaned = apiUrl.replace(/\/$/, '')
    return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`
  }

  return 'http://localhost:3000/api'
}

export const env = {
  apiMode: readApiMode(),
  apiBaseUrl: resolveApiBaseUrl(),
  isMock: readApiMode() === 'mock',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
