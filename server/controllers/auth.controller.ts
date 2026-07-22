import type { Request, Response } from 'express'
import { z } from 'zod'
import * as authService from '../services/auth.service.js'
import { isValidOib, normalizeOib } from '../utils/validateOib.js'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
})

const registerSchema = z
  .object({
    role: z.enum(['parent', 'business']),
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    businessName: z.string().optional(),
    oib: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== 'business') return

    if (!data.businessName?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Naziv igraonice je obavezan.',
        path: ['businessName'],
      })
    }

    const oib = normalizeOib(data.oib ?? '')
    if (!oib) {
      ctx.addIssue({ code: 'custom', message: 'OIB je obavezan.', path: ['oib'] })
    } else if (!isValidOib(oib)) {
      ctx.addIssue({ code: 'custom', message: 'OIB nije ispravan.', path: ['oib'] })
    }
  })

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body)
  const result = await authService.login(input.email, input.password, Boolean(input.rememberMe))
  res.json(result)
}

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body)
  const result = await authService.register(input)
  res.status(201).json(result)
}

export async function forgotPassword(req: Request, res: Response) {
  const email = String(req.body?.email ?? '').trim()
  if (!email) {
    res.status(400).json({ message: 'Email je obavezan.' })
    return
  }
  await authService.requestPasswordReset(email)
  res.json({ ok: true })
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

export async function resetPassword(req: Request, res: Response) {
  const input = resetPasswordSchema.parse(req.body)
  await authService.resetPassword(input.token, input.password)
  res.json({ ok: true })
}
