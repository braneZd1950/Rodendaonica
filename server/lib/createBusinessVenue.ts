import { Business } from '../models/Business.js'
import { Venue } from '../models/Venue.js'
import { slugify } from '../utils/slugify.js'
import { buildVenueCatalogFields } from './venueCatalogDefaults.js'

async function uniqueSlug(base: string) {
  let slug = base
  let suffix = 0
  while (await Venue.exists({ slug })) {
    suffix += 1
    slug = `${base}-${suffix}`
  }
  return slug
}

export async function createVenueForBusiness(
  businessId: string,
  companyName: string,
  city: string,
) {
  const baseSlug = slugify(companyName)
  const slug = await uniqueSlug(baseSlug)
  const catalogFields = buildVenueCatalogFields()

  const venue = await Venue.create({
    _id: `venue-${Date.now()}`,
    slug,
    name: companyName.trim() || 'Nova igraonica',
    city: city.trim() || 'Zagreb',
    district: 'Centar',
    rating: 0,
    reviewCount: 0,
    capacity: 25,
    ageFrom: 1,
    ageTo: 12,
    tags: ['Rođendani'],
    featured: false,
    privateParty: true,
    businessId,
    ...catalogFields,
  })

  await Business.updateOne({ _id: businessId }, { $addToSet: { venueSlugs: slug } })

  return venue
}
