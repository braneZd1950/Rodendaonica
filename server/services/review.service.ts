import { Review } from '../models/Review.js'
import { mapReview } from '../utils/mappers.js'

export async function listByBusiness(businessId: string) {
  const rows = await Review.find({ businessId }).sort({ createdAt: -1 })
  return rows.map(mapReview)
}

export async function reply(reviewId: string, businessId: string, text: string) {
  const review = await Review.findById(reviewId)
  if (!review || review.businessId !== businessId) {
    throw Object.assign(new Error('Recenzija nije pronađena.'), { status: 404 })
  }

  review.ownerReplyText = text
  review.ownerReplyAt = new Date()
  await review.save()

  return mapReview(review)
}
