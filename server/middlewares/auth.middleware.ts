import type { NextFunction, Request, Response } from 'express'
import { User } from '../models/User.js'
import { resolveAccountIdFromBearer } from '../utils/jwt.js'

export interface AuthContext {
  accountId: string
  role: 'parent' | 'business'
  email: string
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Niste prijavljeni.' })
    return
  }

  const accountId = resolveAccountIdFromBearer(header.slice(7))
  if (!accountId) {
    res.status(401).json({ message: 'Neispravan ili istekao token.' })
    return
  }

  const user = await User.findById(accountId)
  if (!user) {
    res.status(401).json({ message: 'Račun nije pronađen.' })
    return
  }

  req.auth = {
    accountId: user._id,
    role: user.role,
    email: user.email,
  }
  next()
}
