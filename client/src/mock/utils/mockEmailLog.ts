import { SEED_BUSINESSES } from '../data/businesses.seed'
import { SEED_PARENTS } from '../data/parents.seed'
import { mockBusinessStore } from '../repositories/mockBusinessStore'
import { mockVenueCatalogStore } from '../repositories/mockVenueCatalogStore'
import type { Reservation } from '../../types'

function resolveParentEmail(parentId: string) {
  const parent = SEED_PARENTS.find(item => item.id === parentId)
  return parent?.email ?? null
}

function resolveBusinessEmail(businessId: string) {
  const dynamic = mockBusinessStore.getById(businessId)
  if (dynamic) return dynamic.email
  return SEED_BUSINESSES.find(item => item.id === businessId)?.email ?? null
}

function resolveVenueName(venueSlug: string) {
  const detail = mockVenueCatalogStore.getVenueDetail(venueSlug)
  return detail?.name ?? venueSlug
}

export function logMockBookingEmails(reservation: Reservation) {
  const parentEmail = resolveParentEmail(reservation.parentId)
  const businessEmail = resolveBusinessEmail(reservation.businessId)
  const venueName = resolveVenueName(reservation.venueSlug)

  if (parentEmail) {
    console.log('\n--- MOCK EMAIL: upit rezervacije (roditelj) ---')
    console.log(`To: ${parentEmail}`)
    console.log(`Subject: Upit za rezervaciju — ${venueName}`)
    console.log(
      `${reservation.childName} · ${reservation.date} ${reservation.time} · ${reservation.packageName} · ${reservation.totalPriceEur} €`,
    )
    console.log('---\n')
  }

  if (businessEmail) {
    console.log('\n--- MOCK EMAIL: nova rezervacija (igraonica) ---')
    console.log(`To: ${businessEmail}`)
    console.log(`Subject: Nova rezervacija — ${venueName}`)
    console.log(
      `${reservation.childName} · ${reservation.date} ${reservation.time} · ${reservation.guestCount} gostiju · ${reservation.totalPriceEur} €`,
    )
    console.log('---\n')
  }
}

export function logMockPasswordResetEmail(email: string, resetUrl: string) {
  console.log('\n--- MOCK EMAIL: reset lozinke ---')
  console.log(`To: ${email}`)
  console.log(`Subject: Reset lozinke — Rođendaonica`)
  console.log(`Link: ${resetUrl}`)
  console.log('---\n')
}
