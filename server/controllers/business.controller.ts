import type { Request, Response } from 'express'
import { z } from 'zod'
import * as businessService from '../services/business.service.js'

const messageSchema = z.object({
  sender: z.enum(['parent', 'business']),
  text: z.string().min(1),
  status: z.enum(['primljena', 'isporucena', 'pogledana']).optional(),
})

export async function listVenues(_req: Request, res: Response) {
  res.json(await businessService.listVenues())
}

export async function getVenue(req: Request, res: Response) {
  const venue = await businessService.getVenueBySlug(req.params.slug)
  if (!venue) {
    res.status(404).json({ message: 'Igraonica nije pronađena.' })
    return
  }
  res.json(venue)
}

export async function getMe(req: Request, res: Response) {
  const business = await businessService.getCurrentBusiness(req.auth!.accountId)
  if (!business) {
    res.status(404).json({ message: 'Profil nije pronađen.' })
    return
  }
  res.json(business)
}

export async function getOverview(req: Request, res: Response) {
  if (req.auth!.accountId !== req.params.businessId) {
    res.status(403).json({ message: 'Nemate ovlasti.' })
    return
  }
  res.json(await businessService.getOverview(req.params.businessId))
}

export async function getCurrentParent(req: Request, res: Response) {
  const parent = await businessService.getCurrentParent(req.auth!.accountId)
  if (!parent) {
    res.status(404).json({ message: 'Profil nije pronađen.' })
    return
  }
  res.json(parent)
}

export async function getParentById(req: Request, res: Response) {
  if (req.auth!.role === 'parent' && req.auth!.accountId !== req.params.parentId) {
    res.status(403).json({ message: 'Nemate ovlasti.' })
    return
  }
  const parent = await businessService.getParentById(req.params.parentId)
  if (!parent) {
    res.status(404).json({ message: 'Roditelj nije pronađen.' })
    return
  }
  res.json(parent)
}

export async function listParentConversations(req: Request, res: Response) {
  if (req.auth!.role === 'parent' && req.auth!.accountId !== req.params.parentId) {
    res.status(403).json({ message: 'Nemate ovlasti.' })
    return
  }
  res.json(await businessService.listConversationsByParent(req.params.parentId))
}

export async function listBusinessConversations(req: Request, res: Response) {
  if (req.auth!.accountId !== req.params.businessId) {
    res.status(403).json({ message: 'Nemate ovlasti.' })
    return
  }
  res.json(await businessService.listConversationsByBusiness(req.params.businessId))
}

export async function sendMessage(req: Request, res: Response) {
  const input = messageSchema.parse(req.body)

  if (req.auth!.role !== input.sender) {
    res.status(403).json({ message: 'Neispravan pošiljatelj poruke.' })
    return
  }

  const message = await businessService.sendMessage(
    req.params.conversationId,
    req.auth!.accountId,
    input.sender,
    input.text,
    input.status,
  )
  res.status(201).json(message)
}

export async function markConversationRead(req: Request, res: Response) {
  const role = req.auth!.role
  if (role !== 'parent' && role !== 'business') {
    res.status(403).json({ message: 'Nemate ovlasti.' })
    return
  }

  const conversation = await businessService.markConversationRead(
    req.params.conversationId,
    req.auth!.accountId,
    role,
  )
  res.json(conversation)
}
