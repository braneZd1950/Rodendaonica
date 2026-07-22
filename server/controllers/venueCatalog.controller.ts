import type { Request, Response } from 'express'
import { z } from 'zod'
import * as businessService from '../services/business.service.js'
import * as venueCatalogService from '../services/venueCatalog.service.js'

const packageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  durationHours: z.number().positive(),
  basePriceEur: z.number().min(0),
  maxGuests: z.number().positive().optional(),
  includedItems: z.array(z.string()),
  active: z.boolean(),
  sortOrder: z.number(),
})

const addonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(['food', 'entertainment', 'decor', 'other']),
  priceEur: z.number().min(0),
  active: z.boolean(),
  sortOrder: z.number(),
})

const catalogSchema = z.object({
  description: z.string(),
  images: z.array(z.string()),
  packages: z.array(packageSchema).min(1),
  addons: z.array(addonSchema),
})

export async function listMyVenues(req: Request, res: Response) {
  res.json(await businessService.listVenuesForBusiness(req.auth!.accountId))
}

export async function getMyVenueCatalog(req: Request, res: Response) {
  const catalog = await venueCatalogService.getCatalogForBusiness(
    req.auth!.accountId,
    req.params.slug,
  )
  res.json(catalog)
}

export async function updateMyVenueCatalog(req: Request, res: Response) {
  const input = catalogSchema.parse(req.body)
  const catalog = await venueCatalogService.updateCatalogForBusiness(
    req.auth!.accountId,
    req.params.slug,
    input,
  )
  res.json(catalog)
}

