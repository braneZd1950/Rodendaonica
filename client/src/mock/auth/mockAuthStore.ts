import type { AuthAccount, AuthResult, AuthSession, DemoCredentials, LoginInput, RegisterInput } from '../../types'
import { SEED_BUSINESSES } from '../data/businesses.seed'
import { SEED_PARENTS } from '../data/parents.seed'
import { mockBusinessStore } from '../repositories/mockBusinessStore'
import { mockVenueCatalogStore } from '../repositories/mockVenueCatalogStore'
import { logMockPasswordResetEmail } from '../utils/mockEmailLog'

interface MockAuthAccountRecord extends AuthAccount {
  password: string
}

const ACCOUNTS_KEY = 'rodendaonica_mock_accounts_v1'
const SESSION_KEY = 'rodendaonica_mock_session_v1'
const RESET_TOKENS_KEY = 'rodendaonica_mock_reset_tokens_v1'
const DEMO_PASSWORD = 'Test1234!'
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

interface MockResetTokenRecord {
  email: string
  token: string
  expiresAt: string
}

function seedAccounts(): MockAuthAccountRecord[] {
  const parents: MockAuthAccountRecord[] = SEED_PARENTS.map(parent => ({
    id: parent.id,
    role: 'parent',
    email: parent.email.toLowerCase(),
    password: DEMO_PASSWORD,
    displayName: `${parent.firstName} ${parent.lastName}`,
  }))

  const businesses: MockAuthAccountRecord[] = SEED_BUSINESSES.map(business => ({
    id: business.id,
    role: 'business',
    email: business.email.toLowerCase(),
    password: DEMO_PASSWORD,
    displayName: business.companyName,
  }))

  return [...parents, ...businesses]
}

function getAccounts(): MockAuthAccountRecord[] {
  const stored = localStorage.getItem(ACCOUNTS_KEY)
  if (!stored) {
    const seeded = seedAccounts()
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    return JSON.parse(stored) as MockAuthAccountRecord[]
  } catch {
    const seeded = seedAccounts()
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seeded))
    return seeded
  }
}

function saveAccounts(accounts: MockAuthAccountRecord[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function loadResetTokens(): MockResetTokenRecord[] {
  const raw = localStorage.getItem(RESET_TOKENS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as MockResetTokenRecord[]
  } catch {
    return []
  }
}

function saveResetTokens(records: MockResetTokenRecord[]) {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(records))
}

function toPublicAccount(account: MockAuthAccountRecord): AuthAccount {
  return {
    id: account.id,
    role: account.role,
    email: account.email,
    displayName: account.displayName,
  }
}

export const mockAuthStore = {
  getSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthSession
    } catch {
      return null
    }
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY)
  },

  async login(input: LoginInput): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 700))
    const accounts = getAccounts()
    const normalized = input.email.trim().toLowerCase()
    const account = accounts.find(item => item.email === normalized)

    if (!account || account.password !== input.password) {
      throw new Error('Pogrešan email ili lozinka')
    }

    const session: AuthSession = {
      accountId: account.id,
      role: account.role,
      email: account.email,
      rememberMe: input.rememberMe,
      loginAt: new Date().toISOString(),
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { account: toPublicAccount(account), session }
  },

  async register(input: RegisterInput): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 900))
    const accounts = getAccounts()
    const normalized = input.email.trim().toLowerCase()

    if (accounts.some(account => account.email === normalized)) {
      throw new Error('Email je već registriran')
    }

    if (input.role === 'business') {
      const oib = input.oib?.trim() ?? ''
      if (!/^\d{11}$/.test(oib)) {
        throw new Error('OIB mora imati točno 11 znamenki.')
      }
      if (mockBusinessStore.isOibTaken(oib)) {
        throw new Error('OIB je već registriran u sustavu.')
      }
    }

    const displayName =
      input.role === 'parent'
        ? `${input.firstName?.trim() ?? ''} ${input.lastName?.trim() ?? ''}`.trim() || 'Novi roditelj'
        : input.businessName?.trim() || 'Nova igraonica'

    const account: MockAuthAccountRecord = {
      id: `mock-${input.role}-${Date.now()}`,
      role: input.role,
      email: normalized,
      password: input.password,
      displayName,
    }

    saveAccounts([...accounts, account])

    if (input.role === 'business') {
      const contactName =
        [input.firstName, input.lastName].filter(Boolean).join(' ').trim() || displayName
      const venue = mockVenueCatalogStore.createVenueForBusiness(
        account.id,
        displayName,
        input.city?.trim() || 'Zagreb',
      )
      mockBusinessStore.add({
        id: account.id,
        role: 'business',
        companyName: displayName,
        contactName,
        oib: input.oib!.trim(),
        email: normalized,
        phone: input.phone?.trim() || '',
        city: input.city?.trim() || 'Zagreb',
        venueSlugs: [venue.slug],
        plan: 'osnovna',
        createdAt: new Date().toISOString(),
      })
    }

    const session: AuthSession = {
      accountId: account.id,
      role: account.role,
      email: account.email,
      rememberMe: true,
      loginAt: new Date().toISOString(),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))

    return { account: toPublicAccount(account), session }
  },

  async requestPasswordReset(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const normalized = email.trim().toLowerCase()
    const accounts = getAccounts()
    const account = accounts.find(item => item.email === normalized)
    if (!account) return

    const token = `mock-reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString()
    const records = loadResetTokens().filter(item => item.email !== normalized)
    records.push({ email: normalized, token, expiresAt })
    saveResetTokens(records)

    const resetUrl = `${window.location.origin}/reset-lozinke?token=${encodeURIComponent(token)}`
    logMockPasswordResetEmail(normalized, resetUrl)
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const records = loadResetTokens()
    const record = records.find(
      item => item.token === token && new Date(item.expiresAt).getTime() > Date.now(),
    )
    if (!record) {
      throw new Error('Link za reset je nevažeći ili je istekao.')
    }

    const accounts = getAccounts()
    const index = accounts.findIndex(item => item.email === record.email)
    if (index < 0) {
      throw new Error('Link za reset je nevažeći ili je istekao.')
    }

    const updated = [...accounts]
    updated[index] = { ...updated[index], password }
    saveAccounts(updated)
    saveResetTokens(records.filter(item => item.token !== token))
  },

  getDemoCredentials(): DemoCredentials {
    return {
      parent: { email: 'ana.horvat@example.com', password: DEMO_PASSWORD },
      business: { email: 'partner@igraonicasunce.hr', password: DEMO_PASSWORD },
    }
  },
}
