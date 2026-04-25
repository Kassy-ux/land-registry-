import { Request, Response, NextFunction } from 'express'
import { requireAuth } from './requireAuth'

export function requireOfficer(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if ((req as any).userRole !== 'officer') {
      res.status(403).json({ error: 'Officer access required' })
      return
    }
    next()
  })
}
