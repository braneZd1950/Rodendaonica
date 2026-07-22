import type { ParentUser } from '../../types'

export const SEED_PARENTS: ParentUser[] = [
  {
    id: 'parent-001',
    role: 'parent',
    firstName: 'Ana',
    lastName: 'Horvat',
    email: 'ana.horvat@example.com',
    phone: '+385912223334',
    city: 'Zagreb',
    createdAt: '2026-03-11T10:20:00.000Z',
    children: [
      { id: 'child-001', name: 'Luka', birthYear: 2019, interests: ['Superhero', 'Nogomet'] },
      { id: 'child-002', name: 'Mila', birthYear: 2021, interests: ['Jednorozi', 'Ples'], allergies: ['Kikiriki'] },
    ],
    favoriteVenueSlugs: ['igraonica-sunce', 'party-room-zvjezdica', 'more-party-zadar'],
  },
  {
    id: 'parent-002',
    role: 'parent',
    firstName: 'Marko',
    lastName: 'Kovač',
    email: 'marko.kovac@example.com',
    phone: '+385981114445',
    city: 'Split',
    createdAt: '2026-02-02T09:00:00.000Z',
    children: [{ id: 'child-003', name: 'Ivan', birthYear: 2018, interests: ['Dinosauri', 'LEGO'] }],
    favoriteVenueSlugs: ['rodendaonica-radost', 'igraonica-mali-svijet'],
  },
]
