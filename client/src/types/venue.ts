import type { VenueAddon, VenuePackage } from './venueCatalog'

export interface Venue {
  id: string
  slug: string
  name: string
  city: string
  district: string
  rating: number
  reviewCount: number
  priceFrom: number
  capacity: number
  ageFrom: number
  ageTo: number
  tags: string[]
  featured: boolean
  privateParty: boolean
  /** Pun opis — na listi može biti izostavljen. */
  description?: string
  images?: string[]
  /** Aktivni paketi — na detalju / u katalogu. */
  packages?: VenuePackage[]
  /** Aktivni dodaci — na detalju / u katalogu. */
  addons?: VenueAddon[]
}

export const VENUE_CITIES = ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar'] as const
export type VenueCity = (typeof VENUE_CITIES)[number]
