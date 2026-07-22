import { SEED_BUSINESSES } from '../data/businesses.seed'
import { mockBusinessStore } from '../repositories/mockBusinessStore'
import { mockVenueCatalogStore } from '../repositories/mockVenueCatalogStore'
import type { CreateReservationInput, Reservation } from '../../types'

export function findBusinessIdByVenueSlug(venueSlug: string) {
  const dynamic = mockBusinessStore.getAll().find(item => item.venueSlugs.includes(venueSlug))
  if (dynamic) return dynamic.id
  const seeded = SEED_BUSINESSES.find(item => item.venueSlugs.includes(venueSlug))
  return seeded?.id ?? null
}

function resolvePackagePrice(venueSlug: string, packageName: string) {
  const detail = mockVenueCatalogStore.getVenueDetail(venueSlug)
  if (!detail) return 180
  const matched = detail.packages?.find(pkg => pkg.active && pkg.name === packageName)
  return matched?.basePriceEur ?? detail.priceFrom
}

function resolveAddons(venueSlug: string, addons: CreateReservationInput['addons']) {
  if (!addons?.length) return []
  const detail = mockVenueCatalogStore.getVenueDetail(venueSlug)
  if (!detail?.addons) return addons

  return addons.map(selected => {
    const catalogAddon = detail.addons?.find(addon => addon.id === selected.id && addon.active)
    if (catalogAddon) {
      return { id: catalogAddon.id, name: catalogAddon.name, priceEur: catalogAddon.priceEur }
    }
    return selected
  })
}

export function buildReservationFromInput(
  parentId: string,
  input: CreateReservationInput,
): Reservation {
  const businessId = findBusinessIdByVenueSlug(input.venueSlug)
  if (!businessId) {
    throw new Error('Igraonica nije pronađena u sustavu.')
  }

  const packagePrice = resolvePackagePrice(input.venueSlug, input.packageName)
  const addons = resolveAddons(input.venueSlug, input.addons)
  const addonTotal = addons.reduce((sum, addon) => sum + addon.priceEur, 0)
  const totalPriceEur = packagePrice + addonTotal

  return {
    id: `res-${Date.now()}`,
    parentId,
    venueSlug: input.venueSlug,
    businessId,
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
    createdAt: new Date().toISOString(),
  }
}
