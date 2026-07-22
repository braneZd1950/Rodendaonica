import { createHash, randomBytes } from 'node:crypto'

const TOKEN_BYTES = 32

export function createResetToken() {
  const rawToken = randomBytes(TOKEN_BYTES).toString('hex')
  const tokenHash = hashResetToken(rawToken)
  return { rawToken, tokenHash }
}

export function hashResetToken(rawToken: string) {
  return createHash('sha256').update(rawToken).digest('hex')
}
