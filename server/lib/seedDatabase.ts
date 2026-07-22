import { Booking } from '../models/Booking.js'
import { Business } from '../models/Business.js'
import { Conversation } from '../models/Conversation.js'
import { Parent } from '../models/Parent.js'
import { Review } from '../models/Review.js'
import { User } from '../models/User.js'
import { Venue } from '../models/Venue.js'
import { buildVenueCatalogFields, STANDARD_PACKAGES } from './venueCatalogDefaults.js'
import { hashPassword } from '../utils/password.js'

export const DEMO_PASSWORD = 'Test1234!'

export async function clearDatabase() {
  await Promise.all([
    Conversation.deleteMany({}),
    Review.deleteMany({}),
    Booking.deleteMany({}),
    Parent.deleteMany({}),
    Venue.deleteMany({}),
    Business.deleteMany({}),
    User.deleteMany({}),
  ])
}

export async function seedDatabase() {
  await clearDatabase()

  const passwordHash = await hashPassword(DEMO_PASSWORD)

  const users = [
    { _id: 'parent-001', email: 'ana.horvat@example.com', role: 'parent' as const, displayName: 'Ana Horvat' },
    { _id: 'parent-002', email: 'marko.kovac@example.com', role: 'parent' as const, displayName: 'Marko Kovač' },
    { _id: 'business-001', email: 'partner@igraonicasunce.hr', role: 'business' as const, displayName: 'Sunce Events d.o.o.' },
    { _id: 'business-002', email: 'hello@zvjezdica-party.hr', role: 'business' as const, displayName: 'Zvjezdica Party j.d.o.o.' },
    { _id: 'business-003', email: 'info@radost-split.hr', role: 'business' as const, displayName: 'Radost Split d.o.o.' },
  ]

  for (const user of users) {
    await User.create({ ...user, passwordHash })
  }

  await Parent.insertMany([
    {
      _id: 'parent-001',
      accountId: 'parent-001',
      firstName: 'Ana',
      lastName: 'Horvat',
      phone: '+385912223334',
      city: 'Zagreb',
      favoriteVenueSlugs: ['igraonica-sunce', 'party-room-zvjezdica', 'more-party-zadar'],
      createdAt: new Date('2026-03-11T10:20:00.000Z'),
      children: [
        { id: 'child-001', name: 'Luka', birthYear: 2019, interests: ['Superhero', 'Nogomet'] },
        { id: 'child-002', name: 'Mila', birthYear: 2021, interests: ['Jednorozi', 'Ples'], allergies: ['Kikiriki'] },
      ],
    },
    {
      _id: 'parent-002',
      accountId: 'parent-002',
      firstName: 'Marko',
      lastName: 'Kovač',
      phone: '+385981114445',
      city: 'Split',
      favoriteVenueSlugs: ['rodendaonica-radost', 'igraonica-mali-svijet'],
      createdAt: new Date('2026-02-02T09:00:00.000Z'),
      children: [{ id: 'child-003', name: 'Ivan', birthYear: 2018, interests: ['Dinosauri', 'LEGO'] }],
    },
  ])

  await Business.insertMany([
    {
      _id: 'business-001',
      accountId: 'business-001',
      companyName: 'Sunce Events d.o.o.',
      contactName: 'Ivana Babić',
      oib: '86432129386',
      phone: '+385911234567',
      city: 'Zagreb',
      venueSlugs: ['igraonica-sunce'],
      plan: 'prosirena',
      createdAt: new Date('2026-01-15T08:00:00.000Z'),
    },
    {
      _id: 'business-002',
      accountId: 'business-002',
      companyName: 'Zvjezdica Party j.d.o.o.',
      contactName: 'Tomislav Marić',
      oib: '50791122315',
      phone: '+385981112224',
      city: 'Zagreb',
      venueSlugs: ['party-room-zvjezdica'],
      plan: 'premium',
      createdAt: new Date('2026-02-06T08:00:00.000Z'),
    },
    {
      _id: 'business-003',
      accountId: 'business-003',
      companyName: 'Radost Split d.o.o.',
      contactName: 'Petra Grgić',
      oib: '38192248115',
      phone: '+385951234987',
      city: 'Split',
      venueSlugs: ['rodendaonica-radost'],
      plan: 'osnovna',
      createdAt: new Date('2026-02-18T08:00:00.000Z'),
    },
  ])

  const sunceCatalog = buildVenueCatalogFields({
    description:
      'Sunčana igraonica u srcu Zagreba s animatorima, tematskim rođendanima i prostorom za do 25 djece.',
  })
  const zvjezdicaCatalog = buildVenueCatalogFields({
    description: 'Tematski party room s cateringom i premium dekoracijama za nezaboravne rođendane.',
    packages: STANDARD_PACKAGES.map(pkg => ({ ...pkg, basePriceEur: pkg.basePriceEur + 40 })),
  })
  const radostCatalog = buildVenueCatalogFields({
    description: 'Rođendaonica uz more u Splitu — idealna za obiteljska slavlja s unutarnjim prostorom.',
    packages: STANDARD_PACKAGES.map(pkg => ({ ...pkg, basePriceEur: pkg.basePriceEur + 20 })),
  })
  const basicCatalog = buildVenueCatalogFields({
    description: 'Ugodan prostor za dječje rođendane s fleksibilnim paketima.',
    packages: [STANDARD_PACKAGES[0]],
  })

  await Venue.insertMany([
    {
      _id: '1',
      slug: 'igraonica-sunce',
      name: 'Igraonica Sunce',
      city: 'Zagreb',
      district: 'Trešnjevka',
      rating: 4.9,
      reviewCount: 128,
      capacity: 25,
      ageFrom: 1,
      ageTo: 12,
      tags: ['Rođendani', 'Animator uključen'],
      featured: true,
      privateParty: true,
      businessId: 'business-001',
      ...sunceCatalog,
    },
    {
      _id: '2',
      slug: 'party-room-zvjezdica',
      name: 'Party Room Zvjezdica',
      city: 'Zagreb',
      district: 'Novi Zagreb',
      rating: 4.7,
      reviewCount: 86,
      capacity: 30,
      ageFrom: 3,
      ageTo: 14,
      tags: ['Tematski rođendani', 'Catering'],
      featured: true,
      privateParty: true,
      businessId: 'business-002',
      ...zvjezdicaCatalog,
    },
    {
      _id: '3',
      slug: 'rodendaonica-radost',
      name: 'Rođendaonica Radost',
      city: 'Split',
      district: 'Meje',
      rating: 4.8,
      reviewCount: 64,
      capacity: 22,
      ageFrom: 2,
      ageTo: 10,
      tags: ['Unutarnji prostor', 'Parking'],
      featured: true,
      privateParty: false,
      businessId: 'business-003',
      ...radostCatalog,
    },
    {
      _id: '4',
      slug: 'igraonica-mali-svijet',
      name: 'Igraonica Mali Svijet',
      city: 'Rijeka',
      district: 'Pećine',
      rating: 4.6,
      reviewCount: 41,
      capacity: 18,
      ageFrom: 1,
      ageTo: 8,
      tags: ['Baby rođendani'],
      featured: false,
      privateParty: true,
      businessId: null,
      ...basicCatalog,
    },
    {
      _id: '5',
      slug: 'adventure-play-osijek',
      name: 'Adventure Play Osijek',
      city: 'Osijek',
      district: 'Centar',
      rating: 4.5,
      reviewCount: 29,
      capacity: 35,
      ageFrom: 4,
      ageTo: 14,
      tags: ['Veliki prostor', 'Laser tag'],
      featured: false,
      privateParty: true,
      businessId: null,
      ...basicCatalog,
    },
    {
      _id: '6',
      slug: 'more-party-zadar',
      name: 'More Party Zadar',
      city: 'Zadar',
      district: 'Borik',
      rating: 4.8,
      reviewCount: 52,
      capacity: 28,
      ageFrom: 3,
      ageTo: 12,
      tags: ['Terasa', 'Rođendanski paketi'],
      featured: false,
      privateParty: true,
      businessId: null,
      ...basicCatalog,
    },
  ])

  await Booking.insertMany([
    { _id: 'res-001', parentId: 'parent-001', venueSlug: 'igraonica-sunce', businessId: 'business-001', childName: 'Luka', date: '2026-06-08', time: '16:00', packageName: 'Premium (2h + animator)', guestCount: 18, totalPriceEur: 280, depositEur: 84, status: 'confirmed', addons: [{ id: 'addon-photo', name: 'Fotograf (1h)', priceEur: 45 }], notes: 'Tema: superheroji', createdAt: new Date('2026-05-14T11:22:00.000Z') },
    { _id: 'res-002', parentId: 'parent-001', venueSlug: 'party-room-zvjezdica', businessId: 'business-002', childName: 'Mila', date: '2026-07-12', time: '12:00', packageName: 'VIP (3h + animator + dekor)', guestCount: 22, totalPriceEur: 360, depositEur: 108, status: 'pending_payment', addons: [{ id: 'addon-catering', name: 'Catering mini', priceEur: 75 }, { id: 'addon-cake', name: 'Torta po izboru', priceEur: 35 }], notes: 'Mila je alergična na kikiriki', createdAt: new Date('2026-05-24T14:09:00.000Z') },
    { _id: 'res-003', parentId: 'parent-002', venueSlug: 'rodendaonica-radost', businessId: 'business-003', childName: 'Ivan', date: '2026-05-03', time: '14:00', packageName: 'Standard (2h)', guestCount: 15, totalPriceEur: 220, depositEur: 66, status: 'completed', addons: [], createdAt: new Date('2026-04-09T08:12:00.000Z') },
    { _id: 'res-004', parentId: 'parent-002', venueSlug: 'igraonica-sunce', businessId: 'business-001', childName: 'Petra', date: '2026-06-14', time: '14:00', packageName: 'Standard (2h)', guestCount: 12, totalPriceEur: 180, depositEur: 54, status: 'confirmed', addons: [], createdAt: new Date('2026-05-28T09:00:00.000Z') },
    { _id: 'res-005', parentId: 'parent-002', venueSlug: 'igraonica-sunce', businessId: 'business-001', childName: 'Marko', date: '2026-06-14', time: '16:00', packageName: 'Premium (2h + animator)', guestCount: 16, totalPriceEur: 280, depositEur: 84, status: 'pending_payment', addons: [], createdAt: new Date('2026-05-29T10:15:00.000Z') },
    { _id: 'res-006', parentId: 'parent-001', venueSlug: 'rodendaonica-radost', businessId: 'business-003', childName: 'Ema', date: '2026-06-21', time: '12:00', packageName: 'VIP (3h + animator + dekor)', guestCount: 20, totalPriceEur: 360, depositEur: 108, status: 'confirmed', addons: [{ id: 'addon-face', name: 'Face painting', priceEur: 40 }], notes: 'Tema: princeze', createdAt: new Date('2026-05-30T16:40:00.000Z') },
  ])

  await Conversation.create({
    _id: 'conv-001',
    parentId: 'parent-001',
    businessId: 'business-001',
    venueSlug: 'igraonica-sunce',
    venueName: 'Igraonica Sunce',
    updatedAt: new Date('2026-05-28T09:15:00.000Z'),
    unreadByParent: 1,
    messages: [
      { id: 'msg-001', sender: 'parent', text: 'Pozdrav, možemo li dodati još 2 djece u rezervaciju?', sentAt: new Date('2026-05-28T09:04:00.000Z'), status: 'pogledana' },
      { id: 'msg-002', sender: 'business', text: 'Naravno, možemo povećati kapacitet na 20 bez nadoplate.', sentAt: new Date('2026-05-28T09:11:00.000Z'), status: 'pogledana' },
      { id: 'msg-003', sender: 'business', text: 'Samo nam potvrdite želite li i dodatni animator sat.', sentAt: new Date('2026-05-28T09:15:00.000Z'), status: 'isporucena' },
    ],
  })

  await Conversation.create({
    _id: 'conv-002',
    parentId: 'parent-001',
    businessId: 'business-002',
    venueSlug: 'party-room-zvjezdica',
    venueName: 'Party Room Zvjezdica',
    updatedAt: new Date('2026-05-27T18:45:00.000Z'),
    unreadByParent: 0,
    messages: [
      { id: 'msg-004', sender: 'business', text: 'Potvrđujemo rezervaciju za 12:00. Tema jednorozi je dostupna.', sentAt: new Date('2026-05-27T18:45:00.000Z') },
    ],
  })

  await Review.insertMany([
    { _id: 'rev-001', businessId: 'business-001', venueSlug: 'igraonica-sunce', parentId: 'parent-001', parentName: 'Ana Horvat', rating: 5, comment: 'Odlična organizacija i animator je bio super.', createdAt: new Date('2026-05-10T11:15:00.000Z'), ownerReplyText: 'Hvala vam puno na povjerenju i lijepim riječima!', ownerReplyAt: new Date('2026-05-10T13:10:00.000Z') },
    { _id: 'rev-002', businessId: 'business-001', venueSlug: 'igraonica-sunce', parentId: 'parent-002', parentName: 'Marko Kovač', rating: 4, comment: 'Sve je bilo odlično, samo bi parking mogao biti bolje označen.', createdAt: new Date('2026-05-22T09:20:00.000Z') },
  ])
}
