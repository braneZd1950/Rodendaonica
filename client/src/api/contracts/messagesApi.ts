import type { Conversation, ThreadMessage } from '../../types'

export interface MessagesApi {
  listByParent(parentId: string): Promise<Conversation[]>
  listByBusiness(businessId: string): Promise<Conversation[]>
  sendMessage(conversationId: string, message: Omit<ThreadMessage, 'id' | 'sentAt'>): Promise<ThreadMessage>
  markConversationRead(conversationId: string): Promise<Conversation>
}