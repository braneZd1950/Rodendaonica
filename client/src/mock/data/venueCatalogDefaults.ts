import type { VenueAddon, VenuePackage } from '../../types'

export const DEFAULT_PACKAGES: VenuePackage[] = [
  {
    id: 'pkg-standard',
    name: 'Standard (2h)',
    description: 'Dvosatni rođendan s osnovnim programom i korištenjem prostora.',
    durationHours: 2,
    basePriceEur: 180,
    maxGuests: 20,
    includedItems: ['Prostor za slavlje', 'Osnovni dekor'],
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
    includedItems: ['Animator 2h', 'Tematski program', 'Dekoracije'],
    active: true,
    sortOrder: 2,
  },
]

export const DEFAULT_ADDONS: VenueAddon[] = [
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
    description: 'Interaktivni show za djecu.',
    category: 'entertainment',
    priceEur: 55,
    active: true,
    sortOrder: 2,
  },
]
