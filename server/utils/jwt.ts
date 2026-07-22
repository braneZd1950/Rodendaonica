import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'

export interface JwtPayload {
  sub: string
  role: 'parent' | 'business'
  email: string
}

export function signAccessToken(payload: JwtPayload) {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] }
  return jwt.sign(payload, env.jwtSecret, options)
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}

export function resolveAccountIdFromBearer(bearer: string): string | null {
  const token = bearer.trim()
  if (!token) return null

  if (token.includes('.')) {
    try {
      return verifyAccessToken(token).sub
    } catch {
      return null
    }
  }

  if (/^(parent|business)-/.test(token)) return token
  return null
}
