import { defineConfig } from 'prisma/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrate: {
    async adapter() {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      return new PrismaPg(pool)
    },
    seed: 'ts-node prisma/seed.ts'
  },
  datasource: {
    url: process.env.DATABASE_URL!
  }
})
