import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { DEMO_PASSWORD, seedDatabase } from '../lib/seedDatabase.js'

let mongod: MongoMemoryServer
let app: Express

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

describe('Rođendaonica API (MVP)', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    process.env.MONGO_URI = mongod.getUri('rodendaonica_test')
    process.env.JWT_SECRET = 'test-jwt-secret'
    process.env.CORS_ORIGIN = 'http://localhost:5173'

    const { connectDatabase } = await import('../config/db.js')
    await connectDatabase()

    const { createApp } = await import('../app.js')
    app = createApp()
  })

  beforeEach(async () => {
    await seedDatabase()
  })

  afterAll(async () => {
    const { disconnectDatabase } = await import('../config/db.js')
    await disconnectDatabase()
    await mongod.stop()
  })

  it('GET /api/health', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('POST /api/auth/login — roditelj', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana.horvat@example.com', password: DEMO_PASSWORD, rememberMe: false })

    expect(res.status).toBe(200)
    expect(res.body.session.accessToken).toBeTruthy()
    expect(res.body.session.role).toBe('parent')
    expect(res.body.account.id).toBe('parent-001')
  })

  it('POST /api/auth/login — igraonica', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'partner@igraonicasunce.hr', password: DEMO_PASSWORD, rememberMe: false })

    expect(res.status).toBe(200)
    expect(res.body.session.role).toBe('business')
  })

  it('POST /api/auth/register — novi roditelj', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        role: 'parent',
        email: 'novi.roditelj@example.com',
        password: 'Test1234!@',
        firstName: 'Novi',
        lastName: 'Korisnik',
      })

    expect(res.status).toBe(201)
    expect(res.body.session.accessToken).toBeTruthy()

    const me = await request(app)
      .get('/api/parents/me')
      .set(authHeader(res.body.session.accessToken))

    expect(me.status).toBe(200)
    expect(me.body.firstName).toBe('Novi')
  })

  it('POST /api/auth/register — nova igraonica s OIB-om', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        role: 'business',
        email: 'nova.igraonica@example.com',
        password: 'Test1234!@',
        firstName: 'Marko',
        lastName: 'Igrač',
        businessName: 'Test Igraonica',
        oib: '12345678903',
        phone: '+385911112233',
        city: 'Zagreb',
      })

    expect(res.status).toBe(201)

    const me = await request(app)
      .get('/api/businesses/me')
      .set(authHeader(res.body.session.accessToken))

    expect(me.status).toBe(200)
    expect(me.body.oib).toBe('12345678903')
    expect(me.body.companyName).toBe('Test Igraonica')
    expect(me.body.city).toBe('Zagreb')
  })

  it('GET /api/venues — javna lista', async () => {
    const res = await request(app).get('/api/venues')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(6)
    expect(res.body.some((v: { slug: string }) => v.slug === 'igraonica-sunce')).toBe(true)
  })

  it('GET /api/venues/:slug — detalj s katalogom paketa i dodataka', async () => {
    const res = await request(app).get('/api/venues/igraonica-sunce')
    expect(res.status).toBe(200)
    expect(res.body.packages.length).toBeGreaterThanOrEqual(3)
    expect(res.body.addons.some((a: { id: string }) => a.id === 'addon-cake')).toBe(true)
    expect(res.body.packages[0].basePriceEur).toBeGreaterThan(0)
  })

  it('GET/PUT /api/businesses/me/venues/:slug/catalog — katalog igraonice', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'partner@igraonicasunce.hr', password: DEMO_PASSWORD, rememberMe: false })

    const token = login.body.session.accessToken as string

    const list = await request(app)
      .get('/api/businesses/me/venues')
      .set(authHeader(token))

    expect(list.status).toBe(200)
    expect(list.body.some((v: { slug: string }) => v.slug === 'igraonica-sunce')).toBe(true)

    const catalog = await request(app)
      .get('/api/businesses/me/venues/igraonica-sunce/catalog')
      .set(authHeader(token))

    expect(catalog.status).toBe(200)
    expect(catalog.body.packages.length).toBeGreaterThanOrEqual(3)
    expect(catalog.body.addons.some((a: { id: string }) => a.id === 'addon-magician')).toBe(true)

    const updated = await request(app)
      .put('/api/businesses/me/venues/igraonica-sunce/catalog')
      .set(authHeader(token))
      .send({
        ...catalog.body,
        addons: [
          ...catalog.body.addons,
          {
            id: 'addon-balloons',
            name: 'Balon luk',
            description: 'Dekorativni balon luk pri ulazu.',
            category: 'decor',
            priceEur: 50,
            active: true,
            sortOrder: 99,
          },
        ],
      })

    expect(updated.status).toBe(200)
    expect(updated.body.addons.some((a: { id: string }) => a.id === 'addon-balloons')).toBe(true)

    const publicDetail = await request(app).get('/api/venues/igraonica-sunce')
    expect(publicDetail.body.addons.some((a: { id: string }) => a.id === 'addon-balloons')).toBe(
      true,
    )
  })

  it('GET /api/businesses/me/venues/:slug/catalog — 403 za tuđu lokaciju', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'partner@igraonicasunce.hr', password: DEMO_PASSWORD, rememberMe: false })

    const res = await request(app)
      .get('/api/businesses/me/venues/party-room-zvjezdica/catalog')
      .set(authHeader(login.body.session.accessToken))

    expect(res.status).toBe(403)
  })

  it('GET /api/venues/:slug/busy-slots', async () => {
    const res = await request(app)
      .get('/api/venues/igraonica-sunce/busy-slots')
      .query({ date: '2026-06-14' })

    expect(res.status).toBe(200)
    expect(res.body).toContain('14:00')
    expect(res.body).toContain('16:00')
  })

  it('POST /api/reservations — kreiranje rezervacije', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana.horvat@example.com', password: DEMO_PASSWORD, rememberMe: false })

    const token = login.body.session.accessToken as string

    const create = await request(app)
      .post('/api/reservations')
      .set(authHeader(token))
      .send({
        venueSlug: 'igraonica-sunce',
        date: '2026-08-10',
        time: '10:00',
        guestCount: 12,
        packageName: 'Standard (2h)',
        childName: 'Luka',
      })

    expect(create.status).toBe(201)
    expect(create.body.status).toBe('pending_payment')
    expect(create.body.parentId).toBe('parent-001')

    const list = await request(app)
      .get('/api/parents/parent-001/reservations')
      .set(authHeader(token))

    expect(list.status).toBe(200)
    expect(list.body.some((r: { id: string }) => r.id === create.body.id)).toBe(true)
  })

  it('POST /api/reservations — odbija zauzet termin', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana.horvat@example.com', password: DEMO_PASSWORD, rememberMe: false })

    const token = login.body.session.accessToken as string

    const conflict = await request(app)
      .post('/api/reservations')
      .set(authHeader(token))
      .send({
        venueSlug: 'igraonica-sunce',
        date: '2026-06-14',
        time: '16:00',
        guestCount: 10,
        packageName: 'Standard (2h)',
        childName: 'Test',
      })

    expect(conflict.status).toBe(409)
  })

  it('GET /api/parents/:id/conversations + POST poruka', async () => {
    const parentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana.horvat@example.com', password: DEMO_PASSWORD, rememberMe: false })
    const parentToken = parentLogin.body.session.accessToken as string

    const conversations = await request(app)
      .get('/api/parents/parent-001/conversations')
      .set(authHeader(parentToken))

    expect(conversations.status).toBe(200)
    expect(conversations.body.length).toBeGreaterThan(0)

    const sent = await request(app)
      .post(`/api/conversations/conv-001/messages`)
      .set(authHeader(parentToken))
      .send({ sender: 'parent', text: 'Hvala na potvrdi!', status: 'pogledana' })

    expect(sent.status).toBe(201)
    expect(sent.body.text).toBe('Hvala na potvrdi!')

    const businessLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'partner@igraonicasunce.hr', password: DEMO_PASSWORD, rememberMe: false })
    const businessToken = businessLogin.body.session.accessToken as string

    const read = await request(app)
      .post('/api/conversations/conv-001/read')
      .set(authHeader(businessToken))

    expect(read.status).toBe(200)
    const parentMsg = read.body.messages.find((m: { id: string }) => m.id === 'msg-001')
    expect(parentMsg?.status).toBe('pogledana')
  })

  it('GET /api/businesses/:id/overview + reviews + reply', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'partner@igraonicasunce.hr', password: DEMO_PASSWORD, rememberMe: false })

    const token = login.body.session.accessToken as string

    const overview = await request(app)
      .get('/api/businesses/business-001/overview')
      .set(authHeader(token))

    expect(overview.status).toBe(200)
    expect(overview.body.business.id).toBe('business-001')
    expect(overview.body.kpi).toBeTruthy()

    const reviews = await request(app)
      .get('/api/businesses/business-001/reviews')
      .set(authHeader(token))

    expect(reviews.status).toBe(200)
    expect(reviews.body.length).toBeGreaterThan(0)

    const reply = await request(app)
      .post('/api/reviews/rev-002/reply')
      .set(authHeader(token))
      .send({ text: 'Hvala na feedbacku, poboljšat ćemo oznake.' })

    expect(reply.status).toBe(200)
    expect(reply.body.ownerReply?.text).toContain('Hvala')
  })

  it('GET /api/businesses/:id/reservations', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'partner@igraonicasunce.hr', password: DEMO_PASSWORD, rememberMe: false })

    const res = await request(app)
      .get('/api/businesses/business-001/reservations')
      .set(authHeader(login.body.session.accessToken))

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('GET /api/payments/config — isključeno bez STRIPE_ENABLED', async () => {
    const res = await request(app).get('/api/payments/config')
    expect(res.status).toBe(200)
    expect(res.body.onlinePaymentsEnabled).toBe(false)
    expect(res.body.publishableKey).toBeNull()
  })

  it('POST /api/auth/forgot-password — ne otkriva postoji li račun', async () => {
    const known = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'ana.horvat@example.com' })
    const unknown = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nepostoji@example.com' })

    expect(known.status).toBe(200)
    expect(known.body.ok).toBe(true)
    expect(unknown.status).toBe(200)
    expect(unknown.body.ok).toBe(true)
  })

  it('POST /api/auth/reset-password — postavlja novu lozinku', async () => {
    const { createResetToken } = await import('../utils/resetToken.js')
    const { PasswordResetToken } = await import('../models/PasswordResetToken.js')
    const { rawToken, tokenHash } = createResetToken()

    await PasswordResetToken.create({
      _id: 'prt-test',
      userId: 'parent-001',
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })

    const reset = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: rawToken, password: 'NovaLozinka1!' })

    expect(reset.status).toBe(200)
    expect(reset.body.ok).toBe(true)

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana.horvat@example.com', password: 'NovaLozinka1!', rememberMe: false })

    expect(login.status).toBe(200)
  })
})
