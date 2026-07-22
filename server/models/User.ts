import mongoose, { Schema } from 'mongoose'

export interface IUser {
  _id: string
  email: string
  passwordHash: string
  role: 'parent' | 'business'
  displayName: string
  createdAt: Date
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['parent', 'business'], required: true },
    displayName: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

export const User = mongoose.model<IUser>('User', userSchema)
