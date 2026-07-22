import type { VenueAddon, VenueAddonCategory, VenuePackage } from '../types'

export const ADDON_CATEGORY_LABELS: Record<VenueAddonCategory, string> = {
  food: 'Hrana',
  entertainment: 'Zabava',
  decor: 'Dekor',
  other: 'Ostalo',
}

export function newPackageId() {
  return `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export function newAddonId() {
  return `addon-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export function createEmptyPackage(sortOrder: number): VenuePackage {
  return {
    id: newPackageId(),
    name: '',
    description: '',
    durationHours: 2,
    basePriceEur: 0,
    maxGuests: 20,
    includedItems: [],
    active: true,
    sortOrder,
  }
}

export function createEmptyAddon(sortOrder: number): VenueAddon {
  return {
    id: newAddonId(),
    name: '',
    description: '',
    category: 'other',
    priceEur: 0,
    active: true,
    sortOrder,
  }
}

export function parseIncludedItems(value: string) {
  return value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

export function formatIncludedItems(items: string[]) {
  return items.join('\n')
}
