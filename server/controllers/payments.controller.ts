import type { Request, Response } from 'express'
import { z } from 'zod'
import * as paymentService from '../services/payment.service.js'

export async function getConfig(_req: Request, res: Response) {
  res.json(paymentService.getPublicConfig())
}

const depositSchema = z.object({
  bookingId: z.string().min(1),
})

export async function createDeposit(req: Request, res: Response) {
  const input = depositSchema.parse(req.body)
  const result = await paymentService.createDepositIntent(req.auth!.accountId, input.bookingId)
  res.status(result.enabled ? 201 : 200).json(result)
}

const interestSchema = z.object({
  reservationId: z.string().optional(),
  interest: z.enum(['yes', 'maybe', 'no']),
  comment: z.string().max(500).optional(),
})

export async function recordInterest(req: Request, res: Response) {
  if (req.auth!.role !== 'parent') {
    res.status(403).json({ message: 'Samo roditelji mogu poslati povratnu informaciju.' })
    return
  }
  const input = interestSchema.parse(req.body)
  const result = await paymentService.recordPaymentInterest(req.auth!.accountId, input)
  res.json(result)
}

export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature']
  const result = await paymentService.handleStripeWebhook(
    req.body as Buffer,
    typeof signature === 'string' ? signature : undefined,
  )
  res.json(result)
}
