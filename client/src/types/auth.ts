export type AuthRole = 'parent' | 'business'

export interface AuthAccount {
  id: string
  role: AuthRole
  email: string
  displayName: string
}

export interface AuthSession {
  accountId: string
  role: AuthRole
  email: string
  rememberMe: boolean
  loginAt: string
  /** JWT iz backend API-ja (http mod) */
  accessToken?: string
}

export interface AuthResult {
  account: AuthAccount
  session: AuthSession
}

export interface LoginInput {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterInput {
  role: AuthRole
  email: string
  password: string
  firstName?: string
  lastName?: string
  businessName?: string
  /** Obavezno za role === 'business' — R1 računi pretplate */
  oib?: string
  phone?: string
  city?: string
}

export interface DemoCredentials {
  parent: { email: string; password: string }
  business: { email: string; password: string }
}
