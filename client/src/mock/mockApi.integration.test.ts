import { beforeEach, describe, expect, it } from 'vitest'
import { createMockApi } from './createMockApi'
import { mockAuthStore } from './auth/mockAuthStore'
import { resetMockRepositories } from './repositories/mockRepositories'

const DEMO_PASSWORD = 'Test1234!'

describe('Mock API (frontend MVP flows)', () => {
  const api = createMockApi()

  beforeEach(() => {
    localStorage.clear()
    mockAuthStore.clearSession()
    resetMockRepositories()
  })

  it('login roditelj i dohvat profila', async () => {
    const result = await api.auth.login({
      email: 'ana.horvat@example.com',
      password: DEMO_PASSWORD,
      rememberMe: false,
    })

    expect(result.session.role).toBe('parent')
    expect(result.account.id).toBe('parent-001')

    const parent = await api.parents.getCurrent()
    expect(parent?.firstName).toBe('Ana')
    expect(parent?.children.length).toBeGreaterThan(0)
  })

  it('login igraonica i KPI overview', async () => {
    await api.auth.login({
      email: 'partner@igraonicasunce.hr',
      password: DEMO_PASSWORD,
      rememberMe: false,
    })

    const business = await api.businesses.getCurrent()
    expect(business?.companyName).toContain('Sunce')

    const overview = await api.businesses.getOverview('business-001')
    expect(overview.kpi?.reservations).toBeGreaterThan(0)
  })

  it('lista igraonica i zauzeti termini', async () => {
    const venues = await api.venues.list()
    expect(venues.length).toBeGreaterThanOrEqual(6)

    const busy = await api.reservations.getBusySlots('igraonica-sunce', '2026-06-14')
    expect(busy).toContain('16:00')
  })

  it('katalog paketa i dodataka — javni detalj i business CRUD', async () => {
    const detail = await api.venues.getBySlug('igraonica-sunce')
    expect(detail?.packages?.length).toBeGreaterThanOrEqual(3)
    expect(detail?.addons?.some(addon => addon.id === 'addon-magician')).toBe(true)

    await api.auth.login({
      email: 'partner@igraonicasunce.hr',
      password: DEMO_PASSWORD,
      rememberMe: false,
    })

    const myVenues = await api.businesses.listMyVenues()
    expect(myVenues.some(venue => venue.slug === 'igraonica-sunce')).toBe(true)

    const catalog = await api.businesses.getVenueCatalog('igraonica-sunce')
    expect(catalog?.packages.length).toBeGreaterThanOrEqual(3)

    const updated = await api.businesses.updateVenueCatalog('igraonica-sunce', {
      ...catalog!,
      addons: [
        ...(catalog?.addons ?? []),
        {
          id: 'addon-test',
          name: 'Test dodatak',
          description: '',
          category: 'other',
          priceEur: 10,
          active: true,
          sortOrder: 100,
        },
      ],
    })

    expect(updated.addons.some(addon => addon.id === 'addon-test')).toBe(true)

    const refreshed = await api.venues.getBySlug('igraonica-sunce')
    expect(refreshed?.addons?.some(addon => addon.id === 'addon-test')).toBe(true)
  })

  it('kreira rezervaciju kao roditelj', async () => {
    await api.auth.login({
      email: 'ana.horvat@example.com',
      password: DEMO_PASSWORD,
      rememberMe: false,
    })

    const created = await api.reservations.create({
      venueSlug: 'igraonica-sunce',
      date: '2026-09-01',
      time: '10:00',
      guestCount: 14,
      packageName: 'Standard (2h)',
      childName: 'Luka',
    })

    expect(created.status).toBe('pending_payment')
    expect(created.parentId).toBe('parent-001')

    const list = await api.reservations.listByParent('parent-001')
    expect(list.some(item => item.id === created.id)).toBe(true)
  })

  it('poruke — lista i slanje', async () => {
    await api.auth.login({
      email: 'ana.horvat@example.com',
      password: DEMO_PASSWORD,
      rememberMe: false,
    })

    const threads = await api.messages.listByParent('parent-001')
    expect(threads.length).toBeGreaterThan(0)

    const sent = await api.messages.sendMessage('conv-001', {
      sender: 'parent',
      text: 'Test poruka iz vitest',
      status: 'pogledana',
    })

    expect(sent.text).toBe('Test poruka iz vitest')
  })

  it('recenzije — lista i odgovor igraonice', async () => {
    await api.auth.login({
      email: 'partner@igraonicasunce.hr',
      password: DEMO_PASSWORD,
      rememberMe: false,
    })

    const reviews = await api.reviews.listByBusiness('business-001')
    expect(reviews.length).toBeGreaterThan(0)

    const withoutReply = reviews.find(item => !item.ownerReply)
    if (!withoutReply) return

    const updated = await api.reviews.replyToReview(withoutReply.id, 'Hvala na recenziji!')
    expect(updated.ownerReply?.text).toBe('Hvala na recenziji!')
  })
})
