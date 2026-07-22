import mongoose, { Schema } from 'mongoose'



export type VenueAddonCategory = 'food' | 'entertainment' | 'decor' | 'other'



export interface IVenuePackage {

  id: string

  name: string

  description: string

  durationHours: number

  basePriceEur: number

  maxGuests?: number

  includedItems: string[]

  active: boolean

  sortOrder: number

}



export interface IVenueAddon {

  id: string

  name: string

  description: string

  category: VenueAddonCategory

  priceEur: number

  active: boolean

  sortOrder: number

}



export interface IVenue {

  _id: string

  slug: string

  name: string

  city: string

  district: string

  rating: number

  reviewCount: number

  priceFrom: number

  capacity: number

  ageFrom: number

  ageTo: number

  tags: string[]

  featured: boolean

  privateParty: boolean

  businessId?: string | null

  description: string

  images: string[]

  packages: IVenuePackage[]

  addons: IVenueAddon[]

}



const packageSchema = new Schema<IVenuePackage>(

  {

    id: { type: String, required: true },

    name: { type: String, required: true },

    description: { type: String, default: '' },

    durationHours: { type: Number, required: true },

    basePriceEur: { type: Number, required: true },

    maxGuests: { type: Number },

    includedItems: { type: [String], default: [] },

    active: { type: Boolean, default: true },

    sortOrder: { type: Number, default: 0 },

  },

  { _id: false },

)



const addonSchema = new Schema<IVenueAddon>(

  {

    id: { type: String, required: true },

    name: { type: String, required: true },

    description: { type: String, default: '' },

    category: {

      type: String,

      enum: ['food', 'entertainment', 'decor', 'other'],

      required: true,

    },

    priceEur: { type: Number, required: true },

    active: { type: Boolean, default: true },

    sortOrder: { type: Number, default: 0 },

  },

  { _id: false },

)



const venueSchema = new Schema<IVenue>(

  {

    _id: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    name: { type: String, required: true },

    city: { type: String, required: true },

    district: { type: String, required: true },

    rating: { type: Number, required: true },

    reviewCount: { type: Number, required: true },

    priceFrom: { type: Number, required: true },

    capacity: { type: Number, required: true },

    ageFrom: { type: Number, required: true },

    ageTo: { type: Number, required: true },

    tags: { type: [String], default: [] },

    featured: { type: Boolean, default: false },

    privateParty: { type: Boolean, default: true },

    businessId: { type: String, default: null },

    description: { type: String, default: '' },

    images: { type: [String], default: [] },

    packages: { type: [packageSchema], default: [] },

    addons: { type: [addonSchema], default: [] },

  },

  { _id: false },

)



venueSchema.index({ city: 1 })

venueSchema.index({ businessId: 1 })



export const Venue = mongoose.model<IVenue>('Venue', venueSchema)


