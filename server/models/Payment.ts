import mongoose, { Schema } from 'mongoose'

export type PaymentStatus = 'pending' | 'captured' | 'refunded' | 'failed'

export interface IPayment {
  _id: string
  bookingId: string
  amountEur: number
  currency: string
  status: PaymentStatus
  provider: 'stripe' | 'corvuspay'
  providerRef?: string
  createdAt: Date
}

const paymentSchema = new Schema<IPayment>(
  {
    _id: { type: String, required: true },
    bookingId: { type: String, required: true, unique: true },
    amountEur: { type: Number, required: true },
    currency: { type: String, default: 'EUR' },
    status: { type: String, enum: ['pending', 'captured', 'refunded', 'failed'], default: 'pending' },
    provider: { type: String, enum: ['stripe', 'corvuspay'], required: true },
    providerRef: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema)
