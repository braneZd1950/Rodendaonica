import type { NextFunction, Request, Response } from 'express'
import type { AuthContext } from './auth.middleware.js'

export function requireRole(...roles: AuthContext['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ message: 'Nemate ovlasti za ovu radnju.' })
      return
    }
    next()
  }
}
