import type { AppApi } from '../../contracts'
import type {
  AuthResult,
  AuthSession,
  BusinessOverview,
  BusinessUser,
  Conversation,
  CreateReservationInput,
  LoginInput,
  ParentUser,
  RegisterInput,
  Reservation,
  Review,
  ThreadMessage,
  UpdateVenueCatalogInput,
  Venue,
  VenueCatalog,
  PaymentConfig,
  DepositPaymentResult,
  RecordPaymentInterestInput,
  RecordPaymentInterestResult,
} from '../../../types'
import { getStoredSession, httpRequest, setStoredSession } from '../../client/httpClient'

export function createHttpApi(): AppApi {
  return {
    auth: {
      async login(input: LoginInput): Promise<AuthResult> {
        const result = await httpRequest<AuthResult>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(input),
        })
        setStoredSession(result.session)
        return result
      },
      async register(input: RegisterInput): Promise<AuthResult> {
        const result = await httpRequest<AuthResult>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(input),
        })
        setStoredSession(result.session)
        return result
      },
      async requestPasswordReset(email: string): Promise<void> {
        await httpRequest('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email }),
        })
      },
      async resetPassword(token: string, password: string): Promise<void> {
        await httpRequest('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, password }),
        })
      },
      logout() {
        setStoredSession(null)
      },
      getSession(): AuthSession | null {
        return getStoredSession()
      },
    },

    venues: {
      list(): Promise<Venue[]> {
        return httpRequest<Venue[]>('/venues')
      },
      getBySlug(slug: string): Promise<Venue | null> {
        return httpRequest<Venue>(`/venues/${slug}`).catch(() => null)
      },
    },

    parents: {
      getCurrent(): Promise<ParentUser | null> {
        return httpRequest<ParentUser>('/parents/me').catch(() => null)
      },
      getById(parentId: string): Promise<ParentUser | null> {
        return httpRequest<ParentUser>(`/parents/${parentId}`).catch(() => null)
      },
    },

    businesses: {
      getCurrent(): Promise<BusinessUser | null> {
        return httpRequest<BusinessUser>('/businesses/me').catch(() => null)
      },
      getOverview(businessId: string): Promise<BusinessOverview> {
        return httpRequest<BusinessOverview>(`/businesses/${businessId}/overview`)
      },
      listMyVenues(): Promise<Venue[]> {
        return httpRequest<Venue[]>('/businesses/me/venues')
      },
      getVenueCatalog(venueSlug: string): Promise<VenueCatalog | null> {
        return httpRequest<VenueCatalog>(`/businesses/me/venues/${venueSlug}/catalog`).catch(
          () => null,
        )
      },
      updateVenueCatalog(venueSlug: string, input: UpdateVenueCatalogInput): Promise<VenueCatalog> {
        return httpRequest<VenueCatalog>(`/businesses/me/venues/${venueSlug}/catalog`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      },
    },

    reservations: {
      listByParent(parentId: string): Promise<Reservation[]> {
        return httpRequest<Reservation[]>(`/parents/${parentId}/reservations`)
      },
      listByBusiness(businessId: string): Promise<Reservation[]> {
        return httpRequest<Reservation[]>(`/businesses/${businessId}/reservations`)
      },
      getById(reservationId: string): Promise<Reservation | null> {
        return httpRequest<Reservation>(`/reservations/${reservationId}`).catch(() => null)
      },
      getBusySlots(venueSlug: string, date: string): Promise<string[]> {
        return httpRequest<string[]>(`/venues/${venueSlug}/busy-slots?date=${encodeURIComponent(date)}`)
      },
      create(input: CreateReservationInput): Promise<Reservation> {
        return httpRequest<Reservation>('/reservations', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      },
    },

    payments: {
      getConfig() {
        return httpRequest<PaymentConfig>('/payments/config')
      },
      createDeposit(bookingId: string) {
        return httpRequest<DepositPaymentResult>('/payments/deposit', {
          method: 'POST',
          body: JSON.stringify({ bookingId }),
        })
      },
      recordInterest(input: RecordPaymentInterestInput) {
        return httpRequest<RecordPaymentInterestResult>('/payments/interest', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      },
    },

    messages: {
      listByParent(parentId: string): Promise<Conversation[]> {
        return httpRequest<Conversation[]>(`/parents/${parentId}/conversations`)
      },
      listByBusiness(businessId: string): Promise<Conversation[]> {
        return httpRequest<Conversation[]>(`/businesses/${businessId}/conversations`)
      },
      sendMessage(conversationId: string, partial: Omit<ThreadMessage, 'id' | 'sentAt'>): Promise<ThreadMessage> {
        return httpRequest<ThreadMessage>(`/conversations/${conversationId}/messages`, {
          method: 'POST',
          body: JSON.stringify(partial),
        })
      },
      markConversationRead(conversationId: string): Promise<Conversation> {
        return httpRequest<Conversation>(`/conversations/${conversationId}/read`, {
          method: 'POST',
        })
      },
    },

    reviews: {
      listByBusiness(businessId: string): Promise<Review[]> {
        return httpRequest<Review[]>(`/businesses/${businessId}/reviews`)
      },
      replyToReview(reviewId: string, text: string): Promise<Review> {
        return httpRequest<Review>(`/reviews/${reviewId}/reply`, {
          method: 'POST',
          body: JSON.stringify({ text }),
        })
      },
    },
  }
}
