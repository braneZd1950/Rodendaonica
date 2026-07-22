import { describe, expect, it } from 'vitest'
import { getPublicConfig } from '../services/payment.service.js'

describe('payment.service config', () => {
  it('online payments disabled by default in tests', () => {
    const config = getPublicConfig()
    expect(config.onlinePaymentsEnabled).toBe(false)
    expect(config.provider).toBeNull()
    expect(config.publishableKey).toBeNull()
  })
})
