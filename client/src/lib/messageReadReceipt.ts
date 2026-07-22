import type { MessageDeliveryStatus } from '../types'

export function getReadReceiptLabel(status?: MessageDeliveryStatus) {
  if (status === 'pogledana') return 'Pročitano'
  if (status === 'isporucena') return 'Dostavljeno'
  return 'Poslano'
}

export function isMessageRead(status?: MessageDeliveryStatus) {
  return status === 'pogledana'
}

export function isMessageDelivered(status?: MessageDeliveryStatus) {
  return status === 'isporucena' || status === 'pogledana'
}

export function unreadMessagesFromSender(
  messages: { sender: 'parent' | 'business'; status?: MessageDeliveryStatus }[],
  sender: 'parent' | 'business',
) {
  return messages.filter(message => message.sender === sender && message.status !== 'pogledana').length
}
