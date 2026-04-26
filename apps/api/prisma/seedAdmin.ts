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
  const hashed = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@land.ke' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@land.ke',
      password: hashed,
      role: 'admin'
    }
  })
  console.log('Seeded admin@land.ke / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
