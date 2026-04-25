import { Request, Response } from 'express'
import { verificationContract } from '../services/blockchainService'
import prisma from '../services/prismaService'

export async function verifyParcel(req: Request, res: Response) {
  try {
    const query = String(req.params.parcelId)
    const isNumeric = !isNaN(Number(query)) && query.trim() !== ''

    const dbParcel = await prisma.landParcel.findFirst({
      where: isNumeric ? { id: Number(query) } : { titleNumber: query },
    })

    if (!dbParcel) {
      res.status(404).json({ error: 'Parcel not found' })
      return
    }

    const documents = await prisma.document.findMany({ where: { landId: dbParcel.id } })

    let onChain = null
    try {
      const [parcelDetails, history] = await Promise.all([
        verificationContract.getParcelDetails(dbParcel.id),
        verificationContract.getTransferHistory(dbParcel.id)
      ])
      onChain = {
        titleNumber: parcelDetails.parcel.titleNumber,
        location: parcelDetails.parcel.location,
        ipfsHash: parcelDetails.parcel.ipfsHash,
        status: Number(parcelDetails.parcel.status),
        currentOwner: parcelDetails.owner,
        transferHistory: history
      }
    } catch {
      // Not on chain yet
    }

    res.json({
      parcelId: dbParcel.id,
      titleNumber: dbParcel.titleNumber,
      location: dbParcel.location,
      size: dbParcel.size,
      status: dbParcel.status,
      onChain,
      documents
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
