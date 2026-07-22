import { AUTH_UNAUTHORIZED_EVENT } from '../../constants/events'
import { env } from '../../config/env'
import { logger } from '../../lib/logger'
import type { AuthSession } from '../../types'

const SESSION_STORAGE_KEY = 'rodendaonica_auth_session'
const REQUEST_TIMEOUT_MS = 30_000

export class ApiError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function getStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function setStoredSession(session: AuthSession | null) {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export async function httpRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const session = getStoredSession()
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (session) {
    const token = session.accessToken ?? session.accountId
    headers.set('Authorization', `Bearer ${token}`)
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Zahtjev je istekao. Provjerite mrežu.', 408)
    }
    logger.error('Mrežna greška', { path, err })
    throw new ApiError('Nema veze s poslužiteljem.', 0)
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = undefined
    }

    if (response.status === 401) {
      setStoredSession(null)
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
    }

    throw new ApiError(`API greška (${response.status})`, response.status, body)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
