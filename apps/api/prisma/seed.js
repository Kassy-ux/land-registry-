"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const hashed = await bcryptjs_1.default.hash('officer123', 10);
    await prisma.user.upsert({
        where: { email: 'officer@land.ke' },
        update: {},
        create: {
            name: 'Registry Officer',
            email: 'officer@land.ke',
            password: hashed,
            role: 'officer'
        }
    });
    console.log('Seeded officer@land.ke / officer123');
}
main().catch(console.error).finally(() => prisma.$disconnect());
