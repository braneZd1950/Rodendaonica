import mongoose, { Schema } from 'mongoose'

export interface IChild {
  id: string
  name: string
  birthYear: number
  interests: string[]
  allergies?: string[]
}

export interface IParent {
  _id: string
  accountId: string
  firstName: string
  lastName: string
  phone: string
  city: string
  favoriteVenueSlugs: string[]
  children: IChild[]
  createdAt: Date
}

const childSchema = new Schema<IChild>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    birthYear: { type: Number, required: true },
    interests: { type: [String], default: [] },
    allergies: { type: [String], default: undefined },
  },
  { _id: false },
)

const parentSchema = new Schema<IParent>(
  {
    _id: { type: String, required: true },
    accountId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    favoriteVenueSlugs: { type: [String], default: [] },
    children: { type: [childSchema], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

export const Parent = mongoose.model<IParent>('Parent', parentSchema)
