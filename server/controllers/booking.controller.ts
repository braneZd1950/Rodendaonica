import type { Request, Response } from 'express'
import { z } from 'zod'
import * as bookingService from '../services/booking.service.js'

const addonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  priceEur: z.coerce.number().nonnegative(),
})

const createSchema = z.object({
  venueSlug: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  guestCount: z.coerce.number().int().positive(),
  packageName: z.string().min(1),
  childName: z.string().min(1),
  notes: z.string().optional(),
  addons: z.array(addonSchema).optional(),
})

export async function getBusySlots(req: Request, res: Response) {
  const date = String(req.query.date ?? '')
  if (!date) {
    res.status(400).json({ message: 'Parametar date je obavezan.' })
    return
  }
  const slots = await bookingService.getBusySlots(req.params.slug, date)
  res.json(slots)
}

export async function listByParent(req: Request, res: Response) {
  const list = await bookingService.listByParent(req.params.parentId)
  res.json(list)
}

export async function listByBusiness(req: Request, res: Response) {
  const list = await bookingService.listByBusiness(req.params.businessId)
  res.json(list)
}

export async function getById(req: Request, res: Response) {
  const booking = await bookingService.getById(req.params.id)
  if (!booking) {
    res.status(404).json({ message: 'Rezervacija nije pronađena.' })
    return
  }

  const isOwner =
    (req.auth!.role === 'parent' && booking.parentId === req.auth!.accountId) ||
    (req.auth!.role === 'business' && booking.businessId === req.auth!.accountId)

  if (!isOwner) {
    res.status(403).json({ message: 'Nemate ovlasti.' })
    return
  }

  res.json(booking)
}

export async function create(req: Request, res: Response) {
  const input = createSchema.parse(req.body)
  const created = await bookingService.create(req.auth!.accountId, input)
  res.status(201).json(created)
}
