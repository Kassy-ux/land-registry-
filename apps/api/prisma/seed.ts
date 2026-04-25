import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!
})

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
  console.log('✓ Seeded officer@land.ke / officer123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

