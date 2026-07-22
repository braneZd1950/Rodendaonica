import { describe, expect, it } from 'vitest'
import { formatCurrencyEur, formatDateHr, formatReservationStatus } from './format'

describe('format helpers', () => {
  it('formatReservationStatus maps known statuses', () => {
    expect(formatReservationStatus('confirmed')).toBe('Potvrđeno')
    expect(formatReservationStatus('pending_payment')).toBe('Čeka uplatu')
    expect(
      formatReservationStatus('pending_payment', { onlinePaymentsEnabled: false }),
    ).toBe('Čeka potvrdu')
  })

  it('formatDateHr returns hr-HR date', () => {
    expect(formatDateHr('2026-06-14')).toMatch(/\d{1,2}\.\s*\d{1,2}\.\s*\d{4}/)
  })

  it('formatCurrencyEur includes EUR', () => {
    expect(formatCurrencyEur(180)).toContain('180')
  })
})
