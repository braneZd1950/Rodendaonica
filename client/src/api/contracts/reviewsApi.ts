import type { Review } from '../../types'

export interface ReviewsApi {
  listByBusiness(businessId: string): Promise<Review[]>
  replyToReview(reviewId: string, text: string): Promise<Review>
}
