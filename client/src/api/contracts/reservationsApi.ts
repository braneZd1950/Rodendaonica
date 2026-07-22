import type { CreateReservationInput, Reservation } from '../../types'

export interface ReservationsApi {
  listByParent(parentId: string): Promise<Reservation[]>
  listByBusiness(businessId: string): Promise<Reservation[]>
  getById(reservationId: string): Promise<Reservation | null>
  getBusySlots(venueSlug: string, date: string): Promise<string[]>
  create(input: CreateReservationInput): Promise<Reservation>
}
