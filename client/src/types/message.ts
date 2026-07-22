export type MessageSender = 'parent' | 'business'
export type MessageDeliveryStatus = 'primljena' | 'isporucena' | 'pogledana'

export interface ThreadMessage {
  id: string
  sender: MessageSender
  text: string
  sentAt: string
  status?: MessageDeliveryStatus
}

export interface Conversation {
  id: string
  parentId: string
  businessId: string
  venueSlug: string
  venueName: string
  updatedAt: string
  unreadByParent: number
  messages: ThreadMessage[]
}
