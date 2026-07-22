import type { AppApi } from '../api/contracts'
import type { ThreadMessage } from '../types'
import { mockAuthStore } from './auth/mockAuthStore'
import { mockBusinessStore } from './repositories/mockBusinessStore'
import { SEED_BUSINESS_KPI, SEED_BUSINESSES } from './data/businesses.seed'
import { SEED_PARENTS } from './data/parents.seed'
import { mockConversationsRepo, mockReservationsRepo, mockReviewsRepo } from './repositories/mockRepositories'
import { mockPaymentsStore } from './repositories/mockPaymentsStore'
import { mockVenueCatalogStore } from './repositories/mockVenueCatalogStore'
import { buildReservationFromInput } from './utils/reservationHelpers'
import { logMockBookingEmails } from './utils/mockEmailLog'
import { mockDelay } from './utils/delay'
import type { CreateReservationInput } from '../types'

export function createMockApi(): AppApi {
  return {
    auth: {
      login: input => mockAuthStore.login(input),
      register: input => mockAuthStore.register(input),
      requestPasswordReset: email => mockAuthStore.requestPasswordReset(email),
      resetPassword: (token, password) => mockAuthStore.resetPassword(token, password),
      logout: () => mockAuthStore.clearSession(),
      getSession: () => mockAuthStore.getSession(),
      getDemoCredentials: () => mockAuthStore.getDemoCredentials(),
    },

    venues: {
      async list() {
        await mockDelay()
        return mockVenueCatalogStore.getAllVenues().map(venue => {
          const detail = mockVenueCatalogStore.getVenueDetail(venue.slug)
          return detail ?? venue
        })
      },
      async getBySlug(slug) {
        await mockDelay()
        return mockVenueCatalogStore.getVenueDetail(slug)
      },
    },

    parents: {
      async getCurrent() {
        await mockDelay()
        const session = mockAuthStore.getSession()
        if (!session || session.role !== 'parent') return null
        return SEED_PARENTS.find(parent => parent.id === session.accountId) ?? null
      },
      async getById(parentId) {
        await mockDelay()
        return SEED_PARENTS.find(parent => parent.id === parentId) ?? null
      },
    },

    businesses: {
      async getCurrent() {
        await mockDelay()
        const session = mockAuthStore.getSession()
        if (!session || session.role !== 'business') return null
        return (
          mockBusinessStore.getById(session.accountId) ??
          SEED_BUSINESSES.find(business => business.id === session.accountId) ??
          null
        )
      },
      async getOverview(businessId) {
        await mockDelay()
        const business =
          mockBusinessStore.getById(businessId) ??
          SEED_BUSINESSES.find(item => item.id === businessId) ??
          null
        return {
          business,
          kpi: SEED_BUSINESS_KPI[businessId] ?? null,
        }
      },
      async listMyVenues() {
        await mockDelay()
        const session = mockAuthStore.getSession()
        if (!session || session.role !== 'business') return []
        return mockVenueCatalogStore.listVenuesForBusiness(session.accountId)
      },
      async getVenueCatalog(venueSlug) {
        await mockDelay()
        const session = mockAuthStore.getSession()
        if (!session || session.role !== 'business') return null
        const owned = mockVenueCatalogStore.listVenuesForBusiness(session.accountId)
        if (!owned.some(venue => venue.slug === venueSlug)) return null
        return mockVenueCatalogStore.getCatalog(venueSlug)
      },
      async updateVenueCatalog(venueSlug, input) {
        await mockDelay(200)
        const session = mockAuthStore.getSession()
        if (!session || session.role !== 'business') {
          throw new Error('Nemate ovlasti.')
        }
        const owned = mockVenueCatalogStore.listVenuesForBusiness(session.accountId)
        if (!owned.some(venue => venue.slug === venueSlug)) {
          throw new Error('Nemate ovlasti za ovu lokaciju.')
        }
        return mockVenueCatalogStore.updateCatalog(venueSlug, input)
      },
    },

    reservations: {
      async listByParent(parentId) {
        await mockDelay()
        return mockReservationsRepo.getAll().filter(item => item.parentId === parentId)
      },
      async listByBusiness(businessId) {
        await mockDelay()
        return mockReservationsRepo.getAll().filter(item => item.businessId === businessId)
      },
      async getById(reservationId) {
        await mockDelay()
        return mockReservationsRepo.getAll().find(item => item.id === reservationId) ?? null
      },
      async getBusySlots(venueSlug, date) {
        await mockDelay(80)
        return mockReservationsRepo
          .getAll()
          .filter(
            item =>
              item.venueSlug === venueSlug &&
              item.date === date &&
              item.status !== 'cancelled' &&
              item.status !== 'draft',
          )
          .map(item => item.time)
      },
      async create(input: CreateReservationInput) {
        await mockDelay(400)
        const session = mockAuthStore.getSession()
        if (!session || session.role !== 'parent') {
          throw new Error('Morate biti prijavljeni kao roditelj.')
        }

        const busy = await this.getBusySlots(input.venueSlug, input.date)
        if (busy.includes(input.time)) {
          throw new Error('Odabrani termin je već zauzet. Odaberite drugo vrijeme.')
        }

        const reservation = buildReservationFromInput(session.accountId, input)
        const all = [...mockReservationsRepo.getAll(), reservation]
        mockReservationsRepo.saveAll(all)
        logMockBookingEmails(reservation)
        return reservation
      },
    },

    messages: {
      async listByParent(parentId) {
        await mockDelay()
        return mockConversationsRepo.getAll().filter(item => item.parentId === parentId)
      },
      async listByBusiness(businessId) {
        await mockDelay()
        return mockConversationsRepo.getAll().filter(item => item.businessId === businessId)
      },
      async sendMessage(conversationId, partial) {
        await mockDelay(120)
        const conversations = mockConversationsRepo.getAll()
        const index = conversations.findIndex(item => item.id === conversationId)
        if (index < 0) throw new Error('Razgovor nije pronađen')

        const message: ThreadMessage = {
          id: `msg-${Date.now()}`,
          sentAt: new Date().toISOString(),
          ...partial,
          status: partial.status ?? 'isporucena',
        }

        const current = conversations[index]
        const updated = [...conversations]
        updated[index] = {
          ...current,
          updatedAt: message.sentAt,
          unreadByParent:
            message.sender === 'business' ? current.unreadByParent + 1 : current.unreadByParent,
          messages: [...current.messages, message],
        }
        mockConversationsRepo.saveAll(updated)
        return message
      },
      async markConversationRead(conversationId) {
        await mockDelay(80)
        const conversations = mockConversationsRepo.getAll()
        const index = conversations.findIndex(item => item.id === conversationId)
        if (index < 0) throw new Error('Razgovor nije pronađen')

        const session = mockAuthStore.getSession()
        if (!session) throw new Error('Niste prijavljeni.')

        const current = conversations[index]
        const senderToMark = session.role === 'parent' ? 'business' : 'parent'
        const allowed =
          (session.role === 'parent' && current.parentId === session.accountId) ||
          (session.role === 'business' && current.businessId === session.accountId)
        if (!allowed) throw new Error('Nemate ovlasti.')

        const updated = [...conversations]
        updated[index] = {
          ...current,
          unreadByParent: session.role === 'parent' ? 0 : current.unreadByParent,
          messages: current.messages.map(message =>
            message.sender === senderToMark ? { ...message, status: 'pogledana' } : message,
          ),
        }
        mockConversationsRepo.saveAll(updated)
        return updated[index]
      },
    },

    payments: {
      async getConfig() {
        await mockDelay(40)
        return mockPaymentsStore.getConfig()
      },
      async createDeposit(bookingId) {
        await mockDelay(120)
        return mockPaymentsStore.createDeposit(bookingId)
      },
      async recordInterest(input) {
        await mockDelay(80)
        const session = mockAuthStore.getSession()
        if (!session || session.role !== 'parent') {
          throw new Error('Morate biti prijavljeni kao roditelj.')
        }
        return mockPaymentsStore.recordInterest(session.accountId, input)
      },
    },

    reviews: {
      async listByBusiness(businessId) {
        await mockDelay()
        return mockReviewsRepo.getAll().filter(item => item.businessId === businessId)
      },
      async replyToReview(reviewId, text) {
        await mockDelay(120)
        const reviews = mockReviewsRepo.getAll()
        const index = reviews.findIndex(item => item.id === reviewId)
        if (index < 0) throw new Error('Recenzija nije pronađena')

        const updated = [...reviews]
        updated[index] = {
          ...updated[index],
          ownerReply: { text, repliedAt: new Date().toISOString() },
        }
        mockReviewsRepo.saveAll(updated)
        return updated[index]
      },
    },
  }
}
