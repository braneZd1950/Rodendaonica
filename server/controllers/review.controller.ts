import type { Request, Response } from 'express'
import { z } from 'zod'
import * as reviewService from '../services/review.service.js'

const replySchema = z.object({ text: z.string().min(1) })

export async function listByBusiness(req: Request, res: Response) {
  if (req.auth!.accountId !== req.params.businessId) {
    res.status(403).json({ message: 'Nemate ovlasti.' })
    return
  }
  res.json(await reviewService.listByBusiness(req.params.businessId))
}

export async function reply(req: Request, res: Response) {
  const { text } = replySchema.parse(req.body)
  const updated = await reviewService.reply(req.params.reviewId, req.auth!.accountId, text)
  res.json(updated)
}
