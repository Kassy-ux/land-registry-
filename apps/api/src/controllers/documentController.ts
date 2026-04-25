import { Request, Response } from 'express'
import prisma from '../services/prismaService'
import pinata from '../services/pinataService'

export async function uploadDocument(req: Request, res: Response) {
  try {
    const { landId, documentType } = req.body
    if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return }
    const result = await pinata.pinFileToIPFS(
      require('stream').Readable.from(req.file.buffer),
      { pinataMetadata: { name: req.file.originalname } }
    )
    const doc = await prisma.document.create({
      data: {
        landId: Number(landId),
        fileHash: result.IpfsHash,
        documentType
      }
    })
    res.status(201).json({ ...doc, ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}` })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
