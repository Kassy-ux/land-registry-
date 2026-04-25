import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        walletAddress: true,
        createdAt: true,
      },
    });

    console.log('\n📋 Users in Database:\n');
    console.log('ID\tName\t\t\tEmail\t\t\tRole\t\tWallet\t\t\tCreated');
    console.log('='.repeat(120));
    
    users.forEach(user => {
      console.log(
        `${user.id}\t${user.name.padEnd(20)}\t${(user.email || 'N/A').padEnd(20)}\t${user.role.padEnd(10)}\t${(user.walletAddress?.slice(0, 10) || 'N/A')}...\t${user.createdAt.toLocaleDateString()}`
      );
    });

    console.log(`\n✅ Total users: ${users.length}\n`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
