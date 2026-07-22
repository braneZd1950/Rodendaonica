import { Business } from '../models/Business.js'
import { Venue, type IVenueAddon, type IVenuePackage } from '../models/Venue.js'
import { minActivePackagePrice } from '../lib/venueCatalogDefaults.js'
import { mapVenueCatalog } from '../utils/mappers.js'

async function assertVenueOwnedByBusiness(accountId: string, slug: string) {
  const venue = await Venue.findOne({ slug })
  if (!venue) {
    throw Object.assign(new Error('Igraonica nije pronađena.'), { status: 404 })
  }
  if (venue.businessId !== accountId) {
    throw Object.assign(new Error('Nemate ovlasti za ovu lokaciju.'), { status: 403 })
  }
  return venue
}

function normalizePackages(packages: IVenuePackage[]): IVenuePackage[] {
  if (!packages.length) {
    throw Object.assign(new Error('Potreban je barem jedan paket.'), { status: 400 })
  }
  const ids = new Set<string>()
  for (const pkg of packages) {
    if (ids.has(pkg.id)) {
      throw Object.assign(new Error('ID paketa moraju biti jedinstveni.'), { status: 400 })
    }
    ids.add(pkg.id)
    if (pkg.basePriceEur < 0 || pkg.durationHours <= 0) {
      throw Object.assign(new Error('Neispravan paket — cijena ili trajanje.'), { status: 400 })
    }
  }
  return packages
}

function normalizeAddons(addons: IVenueAddon[]): IVenueAddon[] {
  const ids = new Set<string>()
  for (const addon of addons) {
    if (ids.has(addon.id)) {
      throw Object.assign(new Error('ID dodataka moraju biti jedinstveni.'), { status: 400 })
    }
    ids.add(addon.id)
    if (addon.priceEur < 0) {
      throw Object.assign(new Error('Neispravna cijena dodatka.'), { status: 400 })
    }
  }
  return addons
}

export async function getCatalogForBusiness(accountId: string, slug: string) {
  const venue = await assertVenueOwnedByBusiness(accountId, slug)
  return mapVenueCatalog(venue)
}

export async function updateCatalogForBusiness(
  accountId: string,
  slug: string,
  input: {
    description: string
    images: string[]
    packages: IVenuePackage[]
    addons: IVenueAddon[]
  },
) {
  const venue = await assertVenueOwnedByBusiness(accountId, slug)

  const packages = normalizePackages(input.packages)
  const addons = normalizeAddons(input.addons)

  venue.description = input.description.trim()
  venue.images = input.images
  venue.packages = packages
  venue.addons = addons
  venue.priceFrom = minActivePackagePrice(packages) || venue.priceFrom

  await venue.save()

  const business = await Business.findById(accountId)
  if (business && !business.venueSlugs.includes(slug)) {
    business.venueSlugs = [...business.venueSlugs, slug]
    await business.save()
  }

  return mapVenueCatalog(venue)
}
