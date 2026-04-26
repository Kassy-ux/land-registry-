import { Request, Response } from 'express'
import prisma from '../services/prismaService'
import bcrypt from 'bcryptjs'

export async function getStats(req: Request, res: Response) {
  try {
    const [totalUsers, totalParcels, totalTransactions, totalDocuments,
      pendingParcels, approvedParcels, rejectedParcels, completedTransactions] = await Promise.all([
      prisma.user.count(),
      prisma.landParcel.count(),
      prisma.transaction.count(),
      prisma.document.count(),
      prisma.landParcel.count({ where: { status: 'pending' } }),
      prisma.landParcel.count({ where: { status: 'approved' } }),
      prisma.landParcel.count({ where: { status: 'rejected' } }),
      prisma.transaction.count({ where: { status: 'completed' } }),
    ])
    res.json({
      totalUsers, totalParcels, totalTransactions, totalDocuments,
      pendingParcels, approvedParcels, rejectedParcels, completedTransactions
    })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(users)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { role } = req.body
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function createOfficer(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'officer' },
      select: { id: true, name: true, email: true, role: true }
    })
    res.status(201).json(user)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function getAllParcels(req: Request, res: Response) {
  try {
    const parcels = await prisma.landParcel.findMany({
      include: {
        ownerships: { include: { user: { select: { name: true, email: true } } } },
        blockchainRecords: true,
        documents: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(parcels)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getAllTransactions(req: Request, res: Response) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        land: { select: { titleNumber: true, location: true } },
        seller: { select: { name: true } },
        buyer: { select: { name: true } }
      },
      orderBy: { transactionDate: 'desc' }
    })
    res.json(transactions)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getBlockchainRecords(req: Request, res: Response) {
  try {
    const records = await prisma.blockchainRecord.findMany({
      include: {
        land: { select: { titleNumber: true, location: true } },
        transaction: { select: { status: true } }
      },
      orderBy: { timestamp: 'desc' },
      take: 50
    })
    res.json(records)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function exportParcels(req: Request, res: Response) {
  try {
    const parcels = await prisma.landParcel.findMany({
      include: { ownerships: { include: { user: { select: { name: true } } } } }
    })
    const csv = [
      'ID,Title Number,Location,Size,Status,Owner,Registered',
      ...parcels.map(p => {
        const owner = p.ownerships[0]?.user?.name || 'Unknown'
        return `${p.id},"${p.titleNumber}","${p.location}",${p.size},${p.status},"${owner}",${new Date(p.createdAt).toLocaleDateString()}`
      })
    ].join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=land-registry.csv')
    res.send(csv)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}
