import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashed = await bcrypt.hash('officer123', 10)
  await prisma.user.upsert({
    where: { email: 'officer@land.ke' },
    update: {},
    create: {
      name: 'Registry Officer',
      email: 'officer@land.ke',
      password: hashed,
      role: 'officer'
    }
  })
  console.log('Seeded officer@land.ke / officer123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
