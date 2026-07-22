import mongoose, { Schema } from 'mongoose'

export interface IReview {
  _id: string
  businessId: string
  venueSlug: string
  parentId: string
  parentName: string
  rating: number
  comment: string
  createdAt: Date
  ownerReplyText?: string
  ownerReplyAt?: Date
}

const reviewSchema = new Schema<IReview>(
  {
    _id: { type: String, required: true },
    businessId: { type: String, required: true, index: true },
    venueSlug: { type: String, required: true },
    parentId: { type: String, required: true },
    parentName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    ownerReplyText: { type: String },
    ownerReplyAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

export const Review = mongoose.model<IReview>('Review', reviewSchema)
