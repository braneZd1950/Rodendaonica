import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env.js'

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: 'Neispravni podaci.',
      errors: err.flatten().fieldErrors,
    })
    return
  }

  if (err instanceof Error) {
    const status =
      'status' in err && typeof (err as { status: number }).status === 'number'
        ? (err as { status: number }).status
        : 400
    res.status(status).json({
      message: err.message,
      ...(env.isDev && { stack: err.stack }),
    })
    return
  }

  res.status(500).json({ message: 'Interna greška poslužitelja.' })
}

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next)
  }
}
