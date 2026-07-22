import type { IVenueAddon, IVenuePackage } from '../models/Venue.js'

export const STANDARD_PACKAGES: IVenuePackage[] = [
  {
    id: 'pkg-standard',
    name: 'Standard (2h)',
    description: 'Dvosatni rođendan s osnovnim programom i korištenjem prostora.',
    durationHours: 2,
    basePriceEur: 180,
    maxGuests: 20,
    includedItems: ['Prostor za slavlje', 'Osnovni dekor', 'Pozivnica (digitalna)'],
    active: true,
    sortOrder: 1,
  },
  {
    id: 'pkg-premium',
    name: 'Premium (2h + animator)',
    description: 'Dva sata zabave s animatorom i tematskim programom.',
    durationHours: 2,
    basePriceEur: 280,
    maxGuests: 25,
    includedItems: ['Animator 2h', 'Tematski program', 'Dekoracije', 'Rođendanska pjesma'],
    active: true,
    sortOrder: 2,
  },
  {
    id: 'pkg-vip',
    name: 'VIP (3h + animator + dekor)',
    description: 'Kompletno iskustvo s produženim vremenom i premium dekorom.',
    durationHours: 3,
    basePriceEur: 360,
    maxGuests: 30,
    includedItems: ['Animator 3h', 'Premium dekor', 'Poklon za slavljenika', 'Foto kutak'],
    active: true,
    sortOrder: 3,
  },
]

export const COMMON_ADDONS: IVenueAddon[] = [
  {
    id: 'addon-cake',
    name: 'Torta po izboru',
    description: 'Rođendanska torta (do 20 komada).',
    category: 'food',
    priceEur: 35,
    active: true,
    sortOrder: 1,
  },
  {
    id: 'addon-magician',
    name: 'Mađioničar (45 min)',
    description: 'Interaktivni mađioničarski show za djecu.',
    category: 'entertainment',
    priceEur: 55,
    active: true,
    sortOrder: 2,
  },
  {
    id: 'addon-pinata',
    name: 'Pinata',
    description: 'Tematska pinata s slatkišima.',
    category: 'decor',
    priceEur: 25,
    active: true,
    sortOrder: 3,
  },
  {
    id: 'addon-photo',
    name: 'Fotograf (1h)',
    description: 'Profesionalno fotografiranje slavlja.',
    category: 'other',
    priceEur: 45,
    active: true,
    sortOrder: 4,
  },
  {
    id: 'addon-face',
    name: 'Face painting',
    description: 'Bojanje lica za djecu (do 15 djece).',
    category: 'entertainment',
    priceEur: 40,
    active: true,
    sortOrder: 5,
  },
  {
    id: 'addon-catering',
    name: 'Catering mini',
    description: 'Selekcija slanih i slatkih zalogaja.',
    category: 'food',
    priceEur: 75,
    active: true,
    sortOrder: 6,
  },
]

export function minActivePackagePrice(packages: IVenuePackage[]): number {
  const active = packages.filter(pkg => pkg.active)
  if (!active.length) return 0
  return Math.min(...active.map(pkg => pkg.basePriceEur))
}

export function buildVenueCatalogFields(options?: {
  description?: string
  images?: string[]
  packages?: IVenuePackage[]
  addons?: IVenueAddon[]
}) {
  const packages = options?.packages ?? STANDARD_PACKAGES
  const addons = options?.addons ?? COMMON_ADDONS
  return {
    description: options?.description ?? 'Prostor za nezaboravne dječje rođendane s animatorima i tematskim programima.',
    images: options?.images ?? [],
    packages,
    addons,
    priceFrom: minActivePackagePrice(packages),
  }
}
