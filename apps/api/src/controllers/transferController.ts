import { Request, Response } from 'express'
import prisma from '../services/prismaService'
import { ownershipContract } from '../services/blockchainService'

export async function getPendingTransfers(req: Request, res: Response) {
  try {
    const transfers = await prisma.transaction.findMany({
      where: { buyerId: (req as any).userId, status: 'pending' },
      include: {
        land: true,
        seller: { select: { name: true } }
      }
    })
    res.json(transfers)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function initiateTransfer(req: Request, res: Response) {
  try {
    const { landId, buyerAddress } = req.body
    const buyer = await prisma.user.findUnique({
      where: { email: buyerAddress.toLowerCase() }
    })
    if (!buyer) {
      res.status(404).json({ error: 'Buyer wallet address not found in system. They must connect their wallet first.' })
      return
    }
    const transaction = await prisma.transaction.create({
      data: {
        landId: Number(landId),
        sellerId: (req as any).userId,
        buyerId: buyer.id,
        status: 'pending'
      }
    })
    const tx = await ownershipContract.initiateTransfer(landId, buyerAddress)
    await tx.wait()
    res.status(201).json({ transaction, buyerName: buyer.name })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function confirmTransfer(req: Request, res: Response) {
  try {
    const { landId, transactionId } = req.body
    await prisma.transaction.update({
      where: { id: Number(transactionId) },
      data: { status: 'completed' }
    })
    await prisma.ownership.create({
      data: { userId: (req as any).userId, landId: Number(landId) }
    })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
