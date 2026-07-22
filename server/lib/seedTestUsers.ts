import { Business } from '../models/Business.js'
import { Parent } from '../models/Parent.js'
import { User } from '../models/User.js'
import { Venue } from '../models/Venue.js'
import { hashPassword } from '../utils/password.js'

export const TEST_USER_PASSWORD = 'Test1234!'

export const TEST_PARENT = {
  id: 'test-parent-001',
  email: 'test.roditelj@rodendaonica.hr',
  firstName: 'Test',
  lastName: 'Roditelj',
}

export const TEST_BUSINESS = {
  id: 'test-business-001',
  email: 'test.igraonica@rodendaonica.hr',
  companyName: 'Test Igraonica d.o.o.',
  contactName: 'Test Vlasnik',
  oib: '12345678903',
  phone: '+385911112233',
  city: 'Zagreb',
  venueSlug: 'igraonica-test-demo',
}

/**
 * Dodaje ili ažurira dva testna računa (roditelj + igraonica).
 * Ne briše ostale podatke u bazi.
 */
export async function seedTestUsers() {
  const passwordHash = await hashPassword(TEST_USER_PASSWORD)

  await User.deleteMany({
    $or: [
      { _id: { $in: [TEST_PARENT.id, TEST_BUSINESS.id] } },
      { email: { $in: [TEST_PARENT.email, TEST_BUSINESS.email] } },
    ],
  })
  await Parent.deleteMany({ $or: [{ _id: TEST_PARENT.id }, { accountId: TEST_PARENT.id }] })
  await Business.deleteMany({ $or: [{ _id: TEST_BUSINESS.id }, { accountId: TEST_BUSINESS.id }] })
  await Venue.deleteMany({ slug: TEST_BUSINESS.venueSlug })

  await User.insertMany([
    {
      _id: TEST_PARENT.id,
      email: TEST_PARENT.email,
      passwordHash,
      role: 'parent',
      displayName: `${TEST_PARENT.firstName} ${TEST_PARENT.lastName}`,
    },
    {
      _id: TEST_BUSINESS.id,
      email: TEST_BUSINESS.email,
      passwordHash,
      role: 'business',
      displayName: TEST_BUSINESS.companyName,
    },
  ])

  await Parent.create({
    _id: TEST_PARENT.id,
    accountId: TEST_PARENT.id,
    firstName: TEST_PARENT.firstName,
    lastName: TEST_PARENT.lastName,
    phone: '+385912223334',
    city: 'Zagreb',
    favoriteVenueSlugs: [TEST_BUSINESS.venueSlug],
    children: [
      { id: 'test-child-001', name: 'Lara', birthYear: 2019, interests: ['Rođendani', 'Ples'] },
    ],
  })

  await Business.create({
    _id: TEST_BUSINESS.id,
    accountId: TEST_BUSINESS.id,
    companyName: TEST_BUSINESS.companyName,
    contactName: TEST_BUSINESS.contactName,
    oib: TEST_BUSINESS.oib,
    phone: TEST_BUSINESS.phone,
    city: TEST_BUSINESS.city,
    venueSlugs: [TEST_BUSINESS.venueSlug],
    plan: 'osnovna',
  })

  await Venue.create({
    _id: 'venue-test-001',
    slug: TEST_BUSINESS.venueSlug,
    name: 'Test Igraonica Demo',
    city: TEST_BUSINESS.city,
    district: 'Centar',
    rating: 4.8,
    reviewCount: 12,
    priceFrom: 150,
    capacity: 20,
    ageFrom: 1,
    ageTo: 12,
    tags: ['Test', 'Rođendani'],
    featured: false,
    privateParty: true,
    businessId: TEST_BUSINESS.id,
  })

  return {
    password: TEST_USER_PASSWORD,
    parent: { email: TEST_PARENT.email, role: 'parent' },
    business: { email: TEST_BUSINESS.email, role: 'business', venueSlug: TEST_BUSINESS.venueSlug },
  }
}
