import mongoose, { Schema } from 'mongoose'

export type MessageSender = 'parent' | 'business'
export type MessageStatus = 'primljena' | 'isporucena' | 'pogledana'

export interface IThreadMessage {
  id: string
  sender: MessageSender
  text: string
  sentAt: Date
  status?: MessageStatus
}

export interface IConversation {
  _id: string
  parentId: string
  businessId: string
  venueSlug: string
  venueName: string
  updatedAt: Date
  unreadByParent: number
  messages: IThreadMessage[]
}

const messageSchema = new Schema<IThreadMessage>(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ['parent', 'business'], required: true },
    text: { type: String, required: true },
    sentAt: { type: Date, required: true },
    status: { type: String, enum: ['primljena', 'isporucena', 'pogledana'] },
  },
  { _id: false },
)

const conversationSchema = new Schema<IConversation>(
  {
    _id: { type: String, required: true },
    parentId: { type: String, required: true, index: true },
    businessId: { type: String, required: true, index: true },
    venueSlug: { type: String, required: true },
    venueName: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    unreadByParent: { type: Number, default: 0 },
    messages: { type: [messageSchema], default: [] },
  },
  { _id: false },
)

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema)
