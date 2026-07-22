import mongoose, { Schema } from 'mongoose'

export interface IPasswordResetToken {
  _id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
)

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const PasswordResetToken = mongoose.model<IPasswordResetToken>(
  'PasswordResetToken',
  passwordResetTokenSchema,
)
