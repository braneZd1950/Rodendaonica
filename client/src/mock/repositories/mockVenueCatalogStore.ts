import type { UpdateVenueCatalogInput, Venue, VenueCatalog } from '../../types'
import { DEFAULT_ADDONS, DEFAULT_PACKAGES } from '../data/venueCatalogDefaults'
import { SEED_VENUES } from '../data/venues.seed'
import { SEED_VENUE_CATALOGS } from '../data/venueCatalogs.seed'
import { slugify } from '../../lib/slugify'

function cloneCatalog(catalog: VenueCatalog): VenueCatalog {
  return structuredClone(catalog)
}

const catalogs: Record<string, VenueCatalog> = Object.fromEntries(
  Object.entries(SEED_VENUE_CATALOGS).map(([slug, catalog]) => [slug, cloneCatalog(catalog)]),
)

const businessVenueSlugs: Record<string, string[]> = {
  'business-001': ['igraonica-sunce'],
  'business-002': ['party-room-zvjezdica'],
  'business-003': ['rodendaonica-radost'],
}

const dynamicVenues: Venue[] = []

function minActivePrice(catalog: VenueCatalog) {
  const active = catalog.packages.filter(pkg => pkg.active)
  if (!active.length) return null
  return Math.min(...active.map(pkg => pkg.basePriceEur))
}

function applyCatalogToVenue(venue: Venue, catalog: VenueCatalog | undefined): Venue {
  if (!catalog) return { ...venue }
  return {
    ...venue,
    description: catalog.description,
    images: [...catalog.images],
    packages: catalog.packages.filter(pkg => pkg.active),
    addons: catalog.addons.filter(addon => addon.active),
    priceFrom: minActivePrice(catalog) ?? venue.priceFrom,
  }
}

export const mockVenueCatalogStore = {
  getAllVenues(): Venue[] {
    return [...SEED_VENUES, ...dynamicVenues]
  },

  getVenueDetail(slug: string): Venue | null {
    const venue = this.getAllVenues().find(item => item.slug === slug)
    if (!venue) return null
    return applyCatalogToVenue(venue, catalogs[slug])
  },

  getCatalog(slug: string): VenueCatalog | null {
    const catalog = catalogs[slug]
    return catalog ? cloneCatalog(catalog) : null
  },

  updateCatalog(slug: string, input: UpdateVenueCatalogInput): VenueCatalog {
    const existing = catalogs[slug]
    if (!existing) {
      throw new Error('Katalog nije pronađen.')
    }
    const updated: VenueCatalog = {
      venueSlug: slug,
      description: input.description,
      images: [...input.images],
      packages: structuredClone(input.packages),
      addons: structuredClone(input.addons),
    }
    catalogs[slug] = updated

    const venue = this.getAllVenues().find(item => item.slug === slug)
    if (venue) {
      const minPrice = minActivePrice(updated)
      if (minPrice != null) venue.priceFrom = minPrice
    }

    return cloneCatalog(updated)
  },

  createVenueForBusiness(businessId: string, companyName: string, city: string): Venue {
    const base = slugify(companyName)
    let slug = base
    let suffix = 0
    while (this.getAllVenues().some(venue => venue.slug === slug)) {
      suffix += 1
      slug = `${base}-${suffix}`
    }

    const venue: Venue = {
      id: `venue-${Date.now()}`,
      slug,
      name: companyName.trim() || 'Nova igraonica',
      city: city.trim() || 'Zagreb',
      district: 'Centar',
      rating: 0,
      reviewCount: 0,
      priceFrom: 180,
      capacity: 25,
      ageFrom: 1,
      ageTo: 12,
      tags: ['Rođendani'],
      featured: false,
      privateParty: true,
    }

    dynamicVenues.push(venue)
    businessVenueSlugs[businessId] = [...(businessVenueSlugs[businessId] ?? []), slug]
    catalogs[slug] = {
      venueSlug: slug,
      description: 'Prostor za nezaboravne dječje rođendane. Uredite opis i ponudu u katalogu.',
      images: [],
      packages: structuredClone(DEFAULT_PACKAGES),
      addons: structuredClone(DEFAULT_ADDONS),
    }

    const minPrice = minActivePrice(catalogs[slug])
    if (minPrice != null) venue.priceFrom = minPrice

    return applyCatalogToVenue(venue, catalogs[slug])
  },

  listVenuesForBusiness(businessId: string): Venue[] {
    const slugs = businessVenueSlugs[businessId] ?? []
    return slugs
      .map(slug => this.getAllVenues().find(venue => venue.slug === slug))
      .filter((venue): venue is Venue => Boolean(venue))
      .map(venue => applyCatalogToVenue(venue, catalogs[venue.slug]))
  },
}
