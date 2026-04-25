import { Request, Response } from 'express'
import prisma from '../services/prismaService'
import { ownershipContract } from '../services/blockchainService'

export async function initiateTransfer(req: Request, res: Response) {
  try {
    const { landId, buyerId, buyerAddress } = req.body
    const transaction = await prisma.transaction.create({
      data: {
        landId: Number(landId),
        sellerId: (req as any).userId,
        buyerId: Number(buyerId),
        status: 'pending'
      }
    })
    const tx = await ownershipContract.initiateTransfer(landId, buyerAddress)
    await tx.wait()
    res.status(201).json(transaction)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function confirmTransfer(req: Request, res: Response) {
  try {
    const { landId, transactionId } = req.body
    const tx = await ownershipContract.confirmTransfer(landId)
    const receipt = await tx.wait()
    await prisma.transaction.update({
      where: { id: Number(transactionId) },
      data: { status: 'completed' }
    })
    await prisma.ownership.create({
      data: { userId: (req as any).userId, landId: Number(landId) }
    })
    await prisma.blockchainRecord.create({
      data: {
        landId: Number(landId),
        transactionId: Number(transactionId),
        blockHash: receipt.blockHash
      }
    })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
