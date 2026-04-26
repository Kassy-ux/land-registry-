import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function upsertUser(name: string, email: string, password: string, role: string) {
  const hashed = await bcrypt.hash(password, 10)
  return prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: { name, email, password: hashed, role },
  })
}

async function main() {
  const admin = await upsertUser('System Admin', 'admin@land.ke', 'admin123', 'admin')
  const officer = await upsertUser('Jane Officer', 'officer@land.ke', 'officer123', 'officer')
  const landowner = await upsertUser('John Kamau', 'landowner@land.ke', 'landowner123', 'landowner')
  const buyer = await upsertUser('Mary Wanjiru', 'buyer@land.ke', 'buyer123', 'landowner')

  const sampleParcels = [
    { titleNumber: 'LR/2024/001', location: 'Nairobi, Karen', size: 3.5, status: 'approved' },
    { titleNumber: 'LR/2024/002', location: 'Kiambu, Ruiru', size: 1.2, status: 'approved' },
    { titleNumber: 'LR/2024/003', location: 'Nakuru, Naivasha', size: 5.0, status: 'pending' },
    { titleNumber: 'LR/2024/004', location: 'Mombasa, Nyali', size: 0.75, status: 'pending' },
    { titleNumber: 'LR/2024/005', location: 'Kisumu, Milimani', size: 2.0, status: 'rejected' },
  ]

  for (const p of sampleParcels) {
    const existing = await prisma.landParcel.findUnique({ where: { titleNumber: p.titleNumber } })
    if (existing) continue
    const parcel = await prisma.landParcel.create({ data: p })
    await prisma.ownership.create({ data: { userId: landowner.id, landId: parcel.id } })
    if (p.status === 'approved') {
      await prisma.blockchainRecord.create({
        data: {
          landId: parcel.id,
          blockHash: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0').slice(0, 64),
        },
      })
    }
  }

  const approvedParcel = await prisma.landParcel.findUnique({ where: { titleNumber: 'LR/2024/002' } })
  if (approvedParcel) {
    const txExists = await prisma.transaction.findFirst({ where: { landId: approvedParcel.id } })
    if (!txExists) {
      const tx = await prisma.transaction.create({
        data: {
          landId: approvedParcel.id,
          sellerId: landowner.id,
          buyerId: buyer.id,
          status: 'completed',
        },
      })
      await prisma.blockchainRecord.create({
        data: {
          landId: approvedParcel.id,
          transactionId: tx.id,
          blockHash: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0').slice(0, 64),
        },
      })
    }
  }

  console.log('Seeded demo data:')
  console.log('  Admin:     admin@land.ke / admin123')
  console.log('  Officer:   officer@land.ke / officer123')
  console.log('  Landowner: landowner@land.ke / landowner123')
  console.log('  Buyer:     buyer@land.ke / buyer123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
