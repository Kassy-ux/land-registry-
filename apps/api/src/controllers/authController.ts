import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../services/prismaService'

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function walletLogin(req: Request, res: Response) {
  try {
    const { address, message, signature } = req.body
    const { ethers } = await import('ethers')
    const recovered = ethers.verifyMessage(message, signature)
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      res.status(401).json({ error: 'Invalid signature' })
      return
    }
    let user = await prisma.user.findFirst({ where: { walletAddress: address } })
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Landowner', email: address, role: 'landowner', walletAddress: address, password: '' }
      })
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    )
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}
