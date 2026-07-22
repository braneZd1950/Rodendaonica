import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { asyncHandler } from './middlewares/error.middleware.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import businessRoutes from './routes/business.routes.js'
import messageRoutes from './routes/message.routes.js'
import parentRoutes from './routes/parent.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import reviewRoutes from './routes/review.routes.js'
import venueRoutes from './routes/venue.routes.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigin.split(',').map(value => value.trim()),
      credentials: true,
    }),
  )

  app.post(
    '/api/payments/webhook',
    express.raw({ type: 'application/json' }),
    asyncHandler(async (req, res) => {
      const { stripeWebhook } = await import('./controllers/payments.controller.js')
      await stripeWebhook(req, res)
    }),
  )

  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'rodendaonica-api', database: 'mongodb' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/venues', venueRoutes)
  app.use('/api/parents', parentRoutes)
  app.use('/api/businesses', businessRoutes)
  app.use('/api/reservations', bookingRoutes)
  app.use('/api/conversations', messageRoutes)
  app.use('/api/reviews', reviewRoutes)
  app.use('/api/payments', paymentRoutes)

  app.use(errorMiddleware)

  return app
}
