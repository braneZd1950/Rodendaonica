import { PENDING_BOOKING_KEY } from '../constants/storage'
import type { BookingDraft, CreateReservationInput } from '../types'

export function savePendingBooking(input: CreateReservationInput) {
  const draft: BookingDraft = { ...input, savedAt: new Date().toISOString() }
  localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(draft))
}

export function readPendingBooking(): BookingDraft | null {
  const raw = localStorage.getItem(PENDING_BOOKING_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as BookingDraft
  } catch {
    return null
  }
}

export function clearPendingBooking() {
  localStorage.removeItem(PENDING_BOOKING_KEY)
}
