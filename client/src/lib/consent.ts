export const CONSENT_STORAGE_KEY = 'rodendaonica_consent_v1'
export const CONSENT_OPEN_EVENT = 'rodendaonica:open-consent'
export const CONSENT_UPDATED_EVENT = 'rodendaonica:consent-updated'

export interface ConsentState {
  acceptedAt: string
  terms: boolean
  privacy: boolean
  cookies: {
    necessary: true
    analytics: boolean
    marketing: boolean
  }
}

export function readConsent(): ConsentState | null {
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as ConsentState
  } catch {
    return null
  }
}

export function openConsentPreferences() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))
}
