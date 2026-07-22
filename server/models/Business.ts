import mongoose, { Schema } from 'mongoose'

export type BusinessPlan = 'osnovna' | 'prosirena' | 'premium'

export interface IBusiness {
  _id: string
  accountId: string
  companyName: string
  contactName: string
  /** OIB za izdavanje R1 računa pri naplati pretplate */
  oib: string
  phone: string
  city: string
  venueSlugs: string[]
  plan: BusinessPlan
  createdAt: Date
}

const businessSchema = new Schema<IBusiness>(
  {
    _id: { type: String, required: true },
    accountId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    oib: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    venueSlugs: { type: [String], default: [] },
    plan: { type: String, enum: ['osnovna', 'prosirena', 'premium'], default: 'osnovna' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

export const Business = mongoose.model<IBusiness>('Business', businessSchema)
