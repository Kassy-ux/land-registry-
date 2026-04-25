import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string }
    ;(req as any).userId = decoded.userId
    ;(req as any).userRole = decoded.role
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
