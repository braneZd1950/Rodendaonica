export type ReservationStatus =
  | 'draft'
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export interface ReservationAddon {
  id: string
  name: string
  priceEur: number
}

export interface Reservation {
  id: string
  parentId: string
  venueSlug: string
  businessId: string
  childName: string
  date: string
  time: string
  packageName: string
  guestCount: number
  totalPriceEur: number
  depositEur: number
  status: ReservationStatus
  addons: ReservationAddon[]
  notes?: string
  createdAt: string
}

export interface CreateReservationInput {
  venueSlug: string
  date: string
  time: string
  guestCount: number
  packageName: string
  childName: string
  notes?: string
  addons?: ReservationAddon[]
}

export interface BookingDraft extends CreateReservationInput {
  savedAt: string
}
