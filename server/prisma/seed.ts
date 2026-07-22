import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const DEMO_PASSWORD = 'Test1234!'

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.child.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.business.deleteMany()
  await prisma.account.deleteMany()

  const accounts = [
    { id: 'parent-001', email: 'ana.horvat@example.com', role: 'parent', displayName: 'Ana Horvat' },
    { id: 'parent-002', email: 'marko.kovac@example.com', role: 'parent', displayName: 'Marko Kovač' },
    { id: 'business-001', email: 'partner@igraonicasunce.hr', role: 'business', displayName: 'Sunce Events d.o.o.' },
    { id: 'business-002', email: 'hello@zvjezdica-party.hr', role: 'business', displayName: 'Zvjezdica Party j.d.o.o.' },
    { id: 'business-003', email: 'info@radost-split.hr', role: 'business', displayName: 'Radost Split d.o.o.' },
  ]

  for (const account of accounts) {
    await prisma.account.create({
      data: { ...account, passwordHash },
    })
  }

  await prisma.parent.createMany({
    data: [
      {
        id: 'parent-001',
        accountId: 'parent-001',
        firstName: 'Ana',
        lastName: 'Horvat',
        phone: '+385912223334',
        city: 'Zagreb',
        favoriteVenueSlugs: ['igraonica-sunce', 'party-room-zvjezdica', 'more-party-zadar'],
        createdAt: new Date('2026-03-11T10:20:00.000Z'),
      },
      {
        id: 'parent-002',
        accountId: 'parent-002',
        firstName: 'Marko',
        lastName: 'Kovač',
        phone: '+385981114445',
        city: 'Split',
        favoriteVenueSlugs: ['rodendaonica-radost', 'igraonica-mali-svijet'],
        createdAt: new Date('2026-02-02T09:00:00.000Z'),
      },
    ],
  })

  await prisma.child.createMany({
    data: [
      { id: 'child-001', parentId: 'parent-001', name: 'Luka', birthYear: 2019, interests: ['Superhero', 'Nogomet'], allergies: [] },
      { id: 'child-002', parentId: 'parent-001', name: 'Mila', birthYear: 2021, interests: ['Jednorozi', 'Ples'], allergies: ['Kikiriki'] },
      { id: 'child-003', parentId: 'parent-002', name: 'Ivan', birthYear: 2018, interests: ['Dinosauri', 'LEGO'], allergies: [] },
    ],
  })

  await prisma.business.createMany({
    data: [
      {
        id: 'business-001',
        accountId: 'business-001',
        companyName: 'Sunce Events d.o.o.',
        contactName: 'Ivana Babić',
        phone: '+385911234567',
        city: 'Zagreb',
        venueSlugs: ['igraonica-sunce'],
        plan: 'prosirena',
        createdAt: new Date('2026-01-15T08:00:00.000Z'),
      },
      {
        id: 'business-002',
        accountId: 'business-002',
        companyName: 'Zvjezdica Party j.d.o.o.',
        contactName: 'Tomislav Marić',
        phone: '+385981112224',
        city: 'Zagreb',
        venueSlugs: ['party-room-zvjezdica'],
        plan: 'premium',
        createdAt: new Date('2026-02-06T08:00:00.000Z'),
      },
      {
        id: 'business-003',
        accountId: 'business-003',
        companyName: 'Radost Split d.o.o.',
        contactName: 'Petra Grgić',
        phone: '+385951234987',
        city: 'Split',
        venueSlugs: ['rodendaonica-radost'],
        plan: 'osnovna',
        createdAt: new Date('2026-02-18T08:00:00.000Z'),
      },
    ],
  })

  const venues = [
    { id: '1', slug: 'igraonica-sunce', name: 'Igraonica Sunce', city: 'Zagreb', district: 'Trešnjevka', rating: 4.9, reviewCount: 128, priceFrom: 180, capacity: 25, ageFrom: 1, ageTo: 12, tags: ['Rođendani', 'Animator uključen'], featured: true, privateParty: true, businessId: 'business-001' },
    { id: '2', slug: 'party-room-zvjezdica', name: 'Party Room Zvjezdica', city: 'Zagreb', district: 'Novi Zagreb', rating: 4.7, reviewCount: 86, priceFrom: 220, capacity: 30, ageFrom: 3, ageTo: 14, tags: ['Tematski rođendani', 'Catering'], featured: true, privateParty: true, businessId: 'business-002' },
    { id: '3', slug: 'rodendaonica-radost', name: 'Rođendaonica Radost', city: 'Split', district: 'Meje', rating: 4.8, reviewCount: 64, priceFrom: 200, capacity: 22, ageFrom: 2, ageTo: 10, tags: ['Unutarnji prostor', 'Parking'], featured: true, privateParty: false, businessId: 'business-003' },
    { id: '4', slug: 'igraonica-mali-svijet', name: 'Igraonica Mali Svijet', city: 'Rijeka', district: 'Pećine', rating: 4.6, reviewCount: 41, priceFrom: 160, capacity: 18, ageFrom: 1, ageTo: 8, tags: ['Baby rođendani'], featured: false, privateParty: true, businessId: null },
    { id: '5', slug: 'adventure-play-osijek', name: 'Adventure Play Osijek', city: 'Osijek', district: 'Centar', rating: 4.5, reviewCount: 29, priceFrom: 150, capacity: 35, ageFrom: 4, ageTo: 14, tags: ['Veliki prostor', 'Laser tag'], featured: false, privateParty: true, businessId: null },
    { id: '6', slug: 'more-party-zadar', name: 'More Party Zadar', city: 'Zadar', district: 'Borik', rating: 4.8, reviewCount: 52, priceFrom: 190, capacity: 28, ageFrom: 3, ageTo: 12, tags: ['Terasa', 'Rođendanski paketi'], featured: false, privateParty: true, businessId: null },
  ]

  for (const venue of venues) {
    await prisma.venue.create({ data: venue })
  }

  const reservations = [
    { id: 'res-001', parentId: 'parent-001', venueSlug: 'igraonica-sunce', businessId: 'business-001', childName: 'Luka', date: '2026-06-08', time: '16:00', packageName: 'Premium (2h + animator)', guestCount: 18, totalPriceEur: 280, depositEur: 84, status: 'confirmed', addons: [{ id: 'addon-photo', name: 'Fotograf (1h)', priceEur: 45 }], notes: 'Tema: superheroji', createdAt: new Date('2026-05-14T11:22:00.000Z') },
    { id: 'res-002', parentId: 'parent-001', venueSlug: 'party-room-zvjezdica', businessId: 'business-002', childName: 'Mila', date: '2026-07-12', time: '12:00', packageName: 'VIP (3h + animator + dekor)', guestCount: 22, totalPriceEur: 360, depositEur: 108, status: 'pending_payment', addons: [{ id: 'addon-catering', name: 'Catering mini', priceEur: 75 }, { id: 'addon-cake', name: 'Torta po izboru', priceEur: 35 }], notes: 'Mila je alergična na kikiriki', createdAt: new Date('2026-05-24T14:09:00.000Z') },
    { id: 'res-003', parentId: 'parent-002', venueSlug: 'rodendaonica-radost', businessId: 'business-003', childName: 'Ivan', date: '2026-05-03', time: '14:00', packageName: 'Standard (2h)', guestCount: 15, totalPriceEur: 220, depositEur: 66, status: 'completed', addons: [], notes: null, createdAt: new Date('2026-04-09T08:12:00.000Z') },
    { id: 'res-004', parentId: 'parent-002', venueSlug: 'igraonica-sunce', businessId: 'business-001', childName: 'Petra', date: '2026-06-14', time: '14:00', packageName: 'Standard (2h)', guestCount: 12, totalPriceEur: 180, depositEur: 54, status: 'confirmed', addons: [], notes: null, createdAt: new Date('2026-05-28T09:00:00.000Z') },
    { id: 'res-005', parentId: 'parent-002', venueSlug: 'igraonica-sunce', businessId: 'business-001', childName: 'Marko', date: '2026-06-14', time: '16:00', packageName: 'Premium (2h + animator)', guestCount: 16, totalPriceEur: 280, depositEur: 84, status: 'pending_payment', addons: [], notes: null, createdAt: new Date('2026-05-29T10:15:00.000Z') },
    { id: 'res-006', parentId: 'parent-001', venueSlug: 'rodendaonica-radost', businessId: 'business-003', childName: 'Ema', date: '2026-06-21', time: '12:00', packageName: 'VIP (3h + animator + dekor)', guestCount: 20, totalPriceEur: 360, depositEur: 108, status: 'confirmed', addons: [{ id: 'addon-face', name: 'Face painting', priceEur: 40 }], notes: 'Tema: princeze', createdAt: new Date('2026-05-30T16:40:00.000Z') },
  ]

  for (const reservation of reservations) {
    await prisma.reservation.create({ data: reservation })
  }

  await prisma.conversation.create({
    data: {
      id: 'conv-001',
      parentId: 'parent-001',
      businessId: 'business-001',
      venueSlug: 'igraonica-sunce',
      venueName: 'Igraonica Sunce',
      updatedAt: new Date('2026-05-28T09:15:00.000Z'),
      unreadByParent: 1,
      messages: {
        create: [
          { id: 'msg-001', sender: 'parent', text: 'Pozdrav, možemo li dodati još 2 djece u rezervaciju?', sentAt: new Date('2026-05-28T09:04:00.000Z'), status: 'pogledana' },
          { id: 'msg-002', sender: 'business', text: 'Naravno, možemo povećati kapacitet na 20 bez nadoplate.', sentAt: new Date('2026-05-28T09:11:00.000Z') },
          { id: 'msg-003', sender: 'business', text: 'Samo nam potvrdite želite li i dodatni animator sat.', sentAt: new Date('2026-05-28T09:15:00.000Z') },
        ],
      },
    },
  })

  await prisma.conversation.create({
    data: {
      id: 'conv-002',
      parentId: 'parent-001',
      businessId: 'business-002',
      venueSlug: 'party-room-zvjezdica',
      venueName: 'Party Room Zvjezdica',
      updatedAt: new Date('2026-05-27T18:45:00.000Z'),
      unreadByParent: 0,
      messages: {
        create: [
          { id: 'msg-004', sender: 'business', text: 'Potvrđujemo rezervaciju za 12:00. Tema jednorozi je dostupna.', sentAt: new Date('2026-05-27T18:45:00.000Z') },
        ],
      },
    },
  })

  await prisma.review.createMany({
    data: [
      {
        id: 'rev-001',
        businessId: 'business-001',
        venueSlug: 'igraonica-sunce',
        parentId: 'parent-001',
        parentName: 'Ana Horvat',
        rating: 5,
        comment: 'Odlična organizacija i animator je bio super.',
        createdAt: new Date('2026-05-10T11:15:00.000Z'),
        ownerReplyText: 'Hvala vam puno na povjerenju i lijepim riječima!',
        ownerReplyAt: new Date('2026-05-10T13:10:00.000Z'),
      },
      {
        id: 'rev-002',
        businessId: 'business-001',
        venueSlug: 'igraonica-sunce',
        parentId: 'parent-002',
        parentName: 'Marko Kovač',
        rating: 4,
        comment: 'Sve je bilo odlično, samo bi parking mogao biti bolje označen.',
        createdAt: new Date('2026-05-22T09:20:00.000Z'),
      },
    ],
  })

  console.log('Seed completed. Demo password:', DEMO_PASSWORD)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
