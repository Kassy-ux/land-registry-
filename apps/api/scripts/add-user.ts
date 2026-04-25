import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function addUser() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log('\n❌ Usage: pnpm add-user <name> <email> <password> <role>');
    console.log('   Roles: OFFICER or LANDOWNER');
    console.log('   Example: pnpm add-user "John Doe" john@example.com password123 LANDOWNER\n');
    process.exit(1);
  }

  const [name, email, password, role] = args;

  // Validate role
  if (!['OFFICER', 'LANDOWNER'].includes(role.toUpperCase())) {
    console.log('❌ Role must be either OFFICER or LANDOWNER');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`❌ User with email ${email} already exists!`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase() as 'OFFICER' | 'LANDOWNER',
      },
    });

    console.log('\n✅ User created successfully!');
    console.log('━'.repeat(50));
    console.log(`👤 Name: ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${user.role}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log('━'.repeat(50));
    console.log(`\n🎉 User can now login with these credentials!\n`);
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
