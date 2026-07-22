import { describe, expect, it } from 'vitest'
import { passwordResetEmail, bookingReceivedParentEmail } from '../lib/email/templates.js'

describe('email templates', () => {
  it('password reset contains reset URL', () => {
    const url = 'http://localhost:5173/reset-lozinke?token=abc'
    const email = passwordResetEmail(url)
    expect(email.subject).toContain('Reset lozinke')
    expect(email.text).toContain(url)
    expect(email.html).toContain(url)
  })

  it('booking parent email contains reservation details', () => {
    const email = bookingReceivedParentEmail({
      parentName: 'Ana',
      venueName: 'Igraonica Sunce',
      childName: 'Luka',
      date: '2026-07-15',
      time: '14:00',
      packageName: 'Standard (2h)',
      totalPriceEur: 180,
      depositEur: 54,
      reservationsUrl: 'http://localhost:5173/rezervacije',
    })
    expect(email.subject).toContain('Igraonica Sunce')
    expect(email.text).toContain('Luka')
    expect(email.html).toContain('180')
  })
})
