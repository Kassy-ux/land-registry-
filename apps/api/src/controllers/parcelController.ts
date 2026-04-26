import { Request, Response } from 'express'
import prisma from '../services/prismaService'
import { landRegistryContract } from '../services/blockchainService'

export async function getParcels(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const parcels = await prisma.landParcel.findMany({
      where: {
        ownerships: { some: { userId } }
      },
      include: { ownerships: { include: { user: true } } }
    })
    res.json(parcels)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getParcel(req: Request, res: Response) {
  try {
    const parcel = await prisma.landParcel.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        ownerships: { include: { user: true } },
        documents: true,
        blockchainRecords: true
      }
    })
    if (!parcel) { res.status(404).json({ error: 'Not found' }); return }
    res.json(parcel)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function submitParcel(req: Request, res: Response) {
  try {
    const { titleNumber, location, size, ipfsHash, ownerAddress } = req.body
    const userId = (req as any).userId
    const parcel = await prisma.landParcel.create({
      data: { titleNumber, location, size: Number(size), status: 'pending' }
    })
    await prisma.ownership.create({
      data: { userId, landId: parcel.id }
    })
    try {
      const tx = await landRegistryContract.submitParcel(titleNumber, location, ipfsHash || '')
      const receipt = await tx.wait()
      await prisma.blockchainRecord.create({
        data: { landId: parcel.id, blockHash: receipt.blockHash }
      })
    } catch (blockchainErr) {
      console.error('Blockchain submit failed:', blockchainErr)
    }
    res.status(201).json(parcel)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function approveParcel(req: Request, res: Response) {
  try {
    const parcelId = Number(req.params.id)
    const parcel = await prisma.landParcel.findUnique({ where: { id: parcelId } })
    if (!parcel) { res.status(404).json({ error: 'Not found' }); return }
    if (parcel.status !== 'pending') {
      res.status(400).json({ error: 'Parcel is not pending' }); return
    }
    await prisma.landParcel.update({ where: { id: parcelId }, data: { status: 'approved' } })
    try {
      const tx = await landRegistryContract.approveParcel(parcelId)
      await tx.wait()
    } catch (blockchainErr) {
      console.error('Blockchain approve failed:', blockchainErr)
    }
    res.json({ success: true, message: 'Parcel approved' })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function rejectParcel(req: Request, res: Response) {
  try {
    const parcelId = Number(req.params.id)
    const parcel = await prisma.landParcel.findUnique({ where: { id: parcelId } })
    if (!parcel) { res.status(404).json({ error: 'Not found' }); return }
    if (parcel.status !== 'pending') {
      res.status(400).json({ error: 'Parcel is not pending' }); return
    }
    await prisma.landParcel.update({ where: { id: parcelId }, data: { status: 'rejected' } })
    try {
      const tx = await landRegistryContract.rejectParcel(parcelId)
      await tx.wait()
    } catch (blockchainErr) {
      console.error('Blockchain reject failed:', blockchainErr)
    }
    res.json({ success: true, message: 'Parcel rejected' })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function getAllParcels(req: Request, res: Response) {
  try {
    const parcels = await prisma.landParcel.findMany({
      include: { ownerships: { include: { user: true } } }
    })
    res.json(parcels)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}
