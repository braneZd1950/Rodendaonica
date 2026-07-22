import { Business } from '../models/Business.js'
import { Parent } from '../models/Parent.js'
import { PasswordResetToken } from '../models/PasswordResetToken.js'
import { User } from '../models/User.js'
import { createVenueForBusiness } from '../lib/createBusinessVenue.js'
import { env } from '../config/env.js'
import { sendPasswordResetNotification } from './notification.service.js'
import { buildAuthResult } from '../utils/mappers.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { createResetToken, hashResetToken } from '../utils/resetToken.js'
import { signAccessToken } from '../utils/jwt.js'
import { isValidOib, normalizeOib } from '../utils/validateOib.js'

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

export async function login(email: string, password: string, rememberMe: boolean) {
  const normalized = email.trim().toLowerCase()
  const user = await User.findOne({ email: normalized })
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw Object.assign(new Error('Neispravan email ili lozinka.'), { status: 401 })
  }

  const accessToken = signAccessToken({
    sub: user._id,
    role: user.role,
    email: user.email,
  })

  return buildAuthResult(user, rememberMe, accessToken)
}

export async function register(input: {
  role: 'parent' | 'business'
  email: string
  password: string
  firstName?: string
  lastName?: string
  businessName?: string
  oib?: string
  phone?: string
  city?: string
}) {
  const normalized = input.email.trim().toLowerCase()
  const existing = await User.findOne({ email: normalized })
  if (existing) {
    throw Object.assign(new Error('Račun s tim emailom već postoji.'), { status: 409 })
  }

  const id = `${input.role}-${Date.now()}`
  const displayName =
    input.role === 'business'
      ? (input.businessName?.trim() || 'Nova igraonica')
      : `${input.firstName?.trim() || 'Korisnik'} ${input.lastName?.trim() || ''}`.trim()

  const passwordHash = await hashPassword(input.password)

  await User.create({
    _id: id,
    email: normalized,
    passwordHash,
    role: input.role,
    displayName,
  })

  if (input.role === 'parent') {
    await Parent.create({
      _id: id,
      accountId: id,
      firstName: input.firstName?.trim() || 'Korisnik',
      lastName: input.lastName?.trim() || '',
      phone: '',
      city: '',
      favoriteVenueSlugs: [],
      children: [],
    })
  } else {
    const oib = normalizeOib(input.oib ?? '')
    if (!oib || !isValidOib(oib)) {
      throw Object.assign(new Error('OIB nije ispravan.'), { status: 400 })
    }
    const existingOib = await Business.findOne({ oib })
    if (existingOib) {
      throw Object.assign(new Error('OIB je već registriran.'), { status: 409 })
    }

    const contactName =
      `${input.firstName?.trim() || ''} ${input.lastName?.trim() || ''}`.trim() || displayName

    await Business.create({
      _id: id,
      accountId: id,
      companyName: displayName,
      contactName,
      oib,
      phone: input.phone?.trim() || '',
      city: input.city?.trim() || '',
      venueSlugs: [],
      plan: 'osnovna',
    })

    await createVenueForBusiness(id, displayName, input.city?.trim() || '')
  }

  const accessToken = signAccessToken({
    sub: id,
    role: input.role,
    email: normalized,
  })

  const user = await User.findById(id)
  if (!user) throw new Error('Greška pri kreiranju računa.')

  return buildAuthResult(user, false, accessToken)
}

export async function requestPasswordReset(email: string) {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return { ok: true }

  const user = await User.findOne({ email: normalized })
  if (!user) return { ok: true }

  const { rawToken, tokenHash } = createResetToken()
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await PasswordResetToken.deleteMany({ userId: user._id })
  await PasswordResetToken.create({
    _id: `prt-${Date.now()}`,
    userId: user._id,
    tokenHash,
    expiresAt,
  })

  const resetUrl = `${env.appUrl}/reset-lozinke?token=${rawToken}`
  try {
    await sendPasswordResetNotification(user.email, resetUrl)
  } catch (error) {
    console.error('[auth] password reset email failed:', error)
  }

  return { ok: true }
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const tokenHash = hashResetToken(rawToken.trim())
  const record = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  })

  if (!record) {
    throw Object.assign(new Error('Link za reset je nevažeći ili je istekao.'), { status: 400 })
  }

  const passwordHash = await hashPassword(newPassword)
  await User.updateOne({ _id: record.userId }, { passwordHash })
  await PasswordResetToken.deleteMany({ userId: record.userId })

  return { ok: true }
}
