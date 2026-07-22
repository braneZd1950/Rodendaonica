import type { Review } from '../../types'

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    businessId: 'business-001',
    venueSlug: 'igraonica-sunce',
    parentId: 'parent-001',
    parentName: 'Ana Horvat',
    rating: 5,
    comment: 'Odlična organizacija i animator je bio super.',
    createdAt: '2026-05-10T11:15:00.000Z',
    ownerReply: {
      text: 'Hvala vam puno na povjerenju i lijepim riječima!',
      repliedAt: '2026-05-10T13:10:00.000Z',
    },
  },
  {
    id: 'rev-002',
    businessId: 'business-001',
    venueSlug: 'igraonica-sunce',
    parentId: 'parent-002',
    parentName: 'Marko Kovač',
    rating: 4,
    comment: 'Sve je bilo odlično, samo bi parking mogao biti bolje označen.',
    createdAt: '2026-05-22T09:20:00.000Z',
  },
]
