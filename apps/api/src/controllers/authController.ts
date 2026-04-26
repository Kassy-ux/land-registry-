import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../services/prismaService'

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function registerWallet(req: Request, res: Response) {
  try {
    const { name, walletAddress } = req.body
    const existing = await prisma.user.findUnique({ where: { email: walletAddress.toLowerCase() } })
    if (existing) {
      const token = jwt.sign(
        { userId: existing.id, role: existing.role },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      )
      res.json({ token, user: { id: existing.id, name: existing.name, email: existing.email, role: existing.role } })
      return
    }
    const user = await prisma.user.create({
      data: {
        name,
        email: walletAddress.toLowerCase(),
        password: await bcrypt.hash(walletAddress, 10),
        role: 'landowner'
      }
    })
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function getWalletUser(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(req.params.address).toLowerCase() }
    })
    if (!user) { res.status(404).json({ error: 'Not found' }); return }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}
