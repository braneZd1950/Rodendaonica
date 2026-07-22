import mongoose, { Schema } from 'mongoose'

export type OnlinePaymentInterestLevel = 'yes' | 'maybe' | 'no'

export interface IOnlinePaymentInterest {
  _id: string
  parentId: string
  reservationId?: string
  interest: OnlinePaymentInterestLevel
  comment?: string
  createdAt: Date
}

const onlinePaymentInterestSchema = new Schema<IOnlinePaymentInterest>(
  {
    _id: { type: String, required: true },
    parentId: { type: String, required: true, index: true },
    reservationId: { type: String, index: true },
    interest: { type: String, enum: ['yes', 'maybe', 'no'], required: true },
    comment: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

onlinePaymentInterestSchema.index(
  { parentId: 1, reservationId: 1 },
  { unique: true, partialFilterExpression: { reservationId: { $type: 'string' } } },
)

export const OnlinePaymentInterest = mongoose.model<IOnlinePaymentInterest>(
  'OnlinePaymentInterest',
  onlinePaymentInterestSchema,
)
