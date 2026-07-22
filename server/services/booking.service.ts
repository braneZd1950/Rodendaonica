import { Booking } from '../models/Booking.js'
import { Venue } from '../models/Venue.js'
import { notifyBookingCreated } from './notification.service.js'
import { mapBooking } from '../utils/mappers.js'

export async function findBusinessIdByVenueSlug(venueSlug: string) {
  const venue = await Venue.findOne({ slug: venueSlug }).select('businessId')
  return venue?.businessId ?? null
}

function resolvePackagePrice(venue: InstanceType<typeof Venue>, packageName: string) {
  const activePackages = venue.packages.filter(pkg => pkg.active)
  const matched = activePackages.find(pkg => pkg.name === packageName)
  if (matched) return matched.basePriceEur
  return venue.priceFrom
}

function resolveAddons(
  venue: InstanceType<typeof Venue>,
  addons: { id: string; name: string; priceEur: number }[] | undefined,
) {
  if (!addons?.length) return []

  return addons.map(selected => {
    const catalogAddon = venue.addons.find(addon => addon.id === selected.id && addon.active)
    if (catalogAddon) {
      return { id: catalogAddon.id, name: catalogAddon.name, priceEur: catalogAddon.priceEur }
    }
    return selected
  })
}

export async function getBusySlots(venueSlug: string, date: string) {
  const rows = await Booking.find({
    venueSlug,
    date,
    status: { $nin: ['cancelled', 'draft'] },
  }).select('time')
  return rows.map(row => row.time)
}

export async function listByParent(parentId: string) {
  const rows = await Booking.find({ parentId }).sort({ date: -1, time: -1 })
  return rows.map(mapBooking)
}

export async function listByBusiness(businessId: string) {
  const rows = await Booking.find({ businessId }).sort({ date: -1, time: -1 })
  return rows.map(mapBooking)
}

export async function getById(id: string) {
  const row = await Booking.findById(id)
  return row ? mapBooking(row) : null
}

export async function create(
  parentId: string,
  input: {
    venueSlug: string
    date: string
    time: string
    guestCount: number
    packageName: string
    childName: string
    notes?: string
    addons?: { id: string; name: string; priceEur: number }[]
  },
) {
  const businessId = await findBusinessIdByVenueSlug(input.venueSlug)
  if (!businessId) {
    throw Object.assign(new Error('Igraonica nije pronađena u sustavu.'), { status: 404 })
  }

  const busy = await getBusySlots(input.venueSlug, input.date)
  if (busy.includes(input.time)) {
    throw Object.assign(new Error('Odabrani termin je već zauzet. Odaberite drugo vrijeme.'), {
      status: 409,
    })
  }

  const venue = await Venue.findOne({ slug: input.venueSlug })
  if (!venue) {
    throw Object.assign(new Error('Igraonica nije pronađena.'), { status: 404 })
  }

  const packagePrice = resolvePackagePrice(venue, input.packageName)
  const addons = resolveAddons(venue, input.addons)
  const addonTotal = addons.reduce((sum, addon) => sum + addon.priceEur, 0)
  const totalPriceEur = packagePrice + addonTotal

  const created = await Booking.create({
    _id: `res-${Date.now()}`,
    parentId,
    businessId,
    venueSlug: input.venueSlug,
    childName: input.childName,
    date: input.date,
    time: input.time,
    packageName: input.packageName,
    guestCount: input.guestCount,
    totalPriceEur,
    depositEur: Math.round(totalPriceEur * 0.3),
    status: 'pending_payment',
    addons,
    notes: input.notes,
  })

  const mapped = mapBooking(created)
  void notifyBookingCreated(mapped)

  return mapped
}
