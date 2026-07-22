import type { Venue } from '../../types'

export interface VenuesApi {
  list(): Promise<Venue[]>
  getBySlug(slug: string): Promise<Venue | null>
}
