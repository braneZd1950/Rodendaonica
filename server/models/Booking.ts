import mongoose, { Schema } from 'mongoose'

export interface IBookingAddon {
  id: string
  name: string
  priceEur: number
}

export type BookingStatus =
  | 'draft'
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export interface IBooking {
  _id: string
  parentId: string
  businessId: string
  venueSlug: string
  childName: string
  date: string
  time: string
  packageName: string
  guestCount: number
  totalPriceEur: number
  depositEur: number
  status: BookingStatus
  addons: IBookingAddon[]
  notes?: string
  createdAt: Date
}

const addonSchema = new Schema<IBookingAddon>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    priceEur: { type: Number, required: true },
  },
  { _id: false },
)

const bookingSchema = new Schema<IBooking>(
  {
    _id: { type: String, required: true },
    parentId: { type: String, required: true, index: true },
    businessId: { type: String, required: true, index: true },
    venueSlug: { type: String, required: true, index: true },
    childName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    packageName: { type: String, required: true },
    guestCount: { type: Number, required: true },
    totalPriceEur: { type: Number, required: true },
    depositEur: { type: Number, required: true },
    status: { type: String, required: true },
    addons: { type: [addonSchema], default: [] },
    notes: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

bookingSchema.index({ venueSlug: 1, date: 1, time: 1 })

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema)
