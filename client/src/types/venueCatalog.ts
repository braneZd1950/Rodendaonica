export type VenueAddonCategory = 'food' | 'entertainment' | 'decor' | 'other'

export interface VenuePackage {
  id: string
  name: string
  description: string
  durationHours: number
  basePriceEur: number
  maxGuests?: number
  includedItems: string[]
  active: boolean
  sortOrder: number
}

export interface VenueAddon {
  id: string
  name: string
  description: string
  category: VenueAddonCategory
  priceEur: number
  active: boolean
  sortOrder: number
}

/** Puni katalog jedne lokacije — za business uređivanje. */
export interface VenueCatalog {
  venueSlug: string
  description: string
  images: string[]
  packages: VenuePackage[]
  addons: VenueAddon[]
}

export type UpdateVenueCatalogInput = VenueCatalog
