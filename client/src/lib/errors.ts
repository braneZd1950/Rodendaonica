import { ApiError } from '../api/client/httpClient'

export function getErrorMessage(error: unknown, fallback = 'Dogodila se greška. Pokušajte ponovo.') {
  if (error instanceof ApiError) {
    if (typeof error.body === 'object' && error.body && 'message' in error.body) {
      return String((error.body as { message: string }).message)
    }
    if (error.status === 401) return 'Sesija je istekla. Prijavite se ponovo.'
    if (error.status === 403) return 'Nemate ovlasti za ovu radnju.'
    if (error.status === 404) return 'Traženi sadržaj nije pronađen.'
    if (error.status >= 500) return 'Poslužitelj trenutno nije dostupan. Pokušajte kasnije.'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
