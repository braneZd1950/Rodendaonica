import type { AuthApi } from './authApi'
import type { BusinessesApi } from './businessesApi'
import type { MessagesApi } from './messagesApi'
import type { ParentsApi } from './parentsApi'
import type { PaymentsApi } from './paymentsApi'
import type { ReservationsApi } from './reservationsApi'
import type { ReviewsApi } from './reviewsApi'
import type { VenuesApi } from './venuesApi'

export interface AppApi {
  auth: AuthApi
  venues: VenuesApi
  parents: ParentsApi
  businesses: BusinessesApi
  reservations: ReservationsApi
  payments: PaymentsApi
  messages: MessagesApi
  reviews: ReviewsApi
}

export type { AuthApi, VenuesApi, ParentsApi, BusinessesApi, ReservationsApi, PaymentsApi, MessagesApi, ReviewsApi }
