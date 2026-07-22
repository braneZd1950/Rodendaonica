/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE?: 'mock' | 'http'
  /** Puni API path npr. https://rodendaonica-api.onrender.com/api ili /api */
  readonly VITE_API_BASE_URL?: string
  /** Origin backenda bez /api — npr. https://rodendaonica-api.onrender.com */
  readonly VITE_API_URL?: string
  readonly VITE_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
