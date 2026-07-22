import type { Conversation } from '../../types'

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    parentId: 'parent-001',
    businessId: 'business-001',
    venueSlug: 'igraonica-sunce',
    venueName: 'Igraonica Sunce',
    updatedAt: '2026-05-28T09:15:00.000Z',
    unreadByParent: 1,
    messages: [
      {
        id: 'msg-001',
        sender: 'parent',
        text: 'Pozdrav, možemo li dodati još 2 djece u rezervaciju?',
        sentAt: '2026-05-28T09:04:00.000Z',
        status: 'pogledana',
      },
      {
        id: 'msg-002',
        sender: 'business',
        text: 'Naravno, možemo povećati kapacitet na 20 bez nadoplate.',
        sentAt: '2026-05-28T09:11:00.000Z',
        status: 'pogledana',
      },
      {
        id: 'msg-003',
        sender: 'business',
        text: 'Samo nam potvrdite želite li i dodatni animator sat.',
        sentAt: '2026-05-28T09:15:00.000Z',
        status: 'isporucena',
      },
    ],
  },
  {
    id: 'conv-002',
    parentId: 'parent-001',
    businessId: 'business-002',
    venueSlug: 'party-room-zvjezdica',
    venueName: 'Party Room Zvjezdica',
    updatedAt: '2026-05-27T18:45:00.000Z',
    unreadByParent: 0,
    messages: [
      {
        id: 'msg-004',
        sender: 'business',
        text: 'Potvrđujemo rezervaciju za 12:00. Tema jednorozi je dostupna.',
        sentAt: '2026-05-27T18:45:00.000Z',
        status: 'pogledana',
      },
    ],
  },
]
