import type { Conversation, Reservation, Review } from '../../types'
import { SEED_CONVERSATIONS } from '../data/messages.seed'
import { SEED_RESERVATIONS } from '../data/reservations.seed'
import { SEED_REVIEWS } from '../data/reviews.seed'
import { readPersisted, writePersisted } from '../storage/persistedStore'

const RESERVATIONS_KEY = 'rodendaonica_mock_reservations_v1'
const CONVERSATIONS_KEY = 'rodendaonica_mock_conversations_v1'
const REVIEWS_KEY = 'rodendaonica_mock_reviews_v1'

let reservationsCache: Reservation[] | null = null
let conversationsCache: Conversation[] | null = null
let reviewsCache: Review[] | null = null

export const mockReservationsRepo = {
  getAll(): Reservation[] {
    if (!reservationsCache) {
      reservationsCache = readPersisted(RESERVATIONS_KEY, [...SEED_RESERVATIONS])
    }
    return reservationsCache
  },
  saveAll(items: Reservation[]) {
    reservationsCache = items
    writePersisted(RESERVATIONS_KEY, items)
  },
}

export const mockConversationsRepo = {
  getAll(): Conversation[] {
    if (!conversationsCache) {
      conversationsCache = readPersisted(CONVERSATIONS_KEY, structuredClone(SEED_CONVERSATIONS))
    }
    return conversationsCache
  },
  saveAll(items: Conversation[]) {
    conversationsCache = items
    writePersisted(CONVERSATIONS_KEY, items)
  },
}

export const mockReviewsRepo = {
  getAll(): Review[] {
    if (!reviewsCache) {
      reviewsCache = readPersisted(REVIEWS_KEY, structuredClone(SEED_REVIEWS))
    }
    return reviewsCache
  },
  saveAll(items: Review[]) {
    reviewsCache = items
    writePersisted(REVIEWS_KEY, items)
  },
}

/** Reset in-memory cache (npr. između vitest testova). */
export function resetMockRepositories() {
  reservationsCache = null
  conversationsCache = null
  reviewsCache = null
}
