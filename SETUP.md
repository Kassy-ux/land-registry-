# 🛠️ LandLedger Setup Guide

Complete setup instructions for getting LandLedger running on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Development Tips](#development-tips)

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   # Check your version
   node --version  # Should be v18.0.0 or higher
   ```
   Download from: https://nodejs.org/

2. **pnpm** (v8 or higher)
   ```bash
   # Install globally
   npm install -g pnpm
   
   # Verify installation
   pnpm --version
   ```

3. **Git**
   ```bash
   git --version
   ```
   Download from: https://git-scm.com/

4. **MetaMask Browser Extension**
   - Install from: https://metamask.io/
   - Create a wallet if you don't have one
   - Switch to Sepolia testnet

### Optional Tools

- **VS Code** (recommended IDE)
- **Prisma VS Code Extension** (database management)
- **Hardhat VS Code Extension** (smart contract development)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Kassy-ux/land-registry-.git
cd land-registry-
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

This will install dependencies for:
- Root workspace
- `apps/api`
- `apps/web`
- `contracts`

**Expected Output:**
```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded XXX, added XXX
Done in XXXs
```

### 3. Verify Installation

```bash
# Check if all workspaces are recognized
pnpm list --depth=0
```

## Database Setup

### 1. Initialize SQLite Database

```bash
cd apps/api
```

### 2. Push Schema to Database

```bash
pnpm prisma db push
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./prisma/dev.db"

SQLite database dev.db created at file:./prisma/dev.db

🚀  Your database is now in sync with your Prisma schema.
```

### 3. Seed the Database

Create the default registry officer account:

```bash
pnpm seed
```

**Expected Output:**
```
✓ Seeded officer@land.ke / officer123
```

### 4. Verify Database

Optional: Open Prisma Studio to inspect the database:

```bash
pnpm prisma studio
```

This opens a browser-based database GUI at `http://localhost:5555`

## Environment Configuration

### API Environment (.env)

1. **Navigate to API directory**
   ```bash
   cd apps/api
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Or create manually:
   ```bash
   touch .env
   ```

3. **Edit .env file**
   ```env
   # Database
   DATABASE_URL="file:./prisma/dev.db"
   
   # JWT Secret (change in production!)
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   
   # Ethereum Network
   SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
   PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"
   
   # Smart Contract Addresses (Deployed)
   LAND_REGISTRY_ADDRESS="0x7F5c027Ff6747d6a127861Df9108F5ee2f392da3"
   OWNERSHIP_ADDRESS="0x002f17B92Cb30Bc7e324A4F82e226e5b99c55C72"
   VERIFICATION_ADDRESS="0x1123194a6785E78a5d3Dc2FA8772214172a846D6"
   
   # IPFS/Pinata
   PINATA_JWT="YOUR_PINATA_JWT_TOKEN"
   ```

#### Getting Required Values

**Sepolia RPC URL:**
1. Sign up at [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
2. Create a new app
3. Select "Sepolia" network
4. Copy the HTTPS URL

**Private Key:**
1. Open MetaMask
2. Click account menu → Account Details → Export Private Key
3. Enter password
4. **⚠️ NEVER share this key or commit it to git!**
5. Use a test wallet with no real ETH

**Pinata JWT:**
1. Sign up at [Pinata](https://www.pinata.cloud/)
2. Go to API Keys
3. Create new key with pinning permissions
4. Copy the JWT token

### Web Environment (.env)

The web app uses Vite, which looks for `.env` files in `apps/web/`.

1. **Navigate to web directory**
   ```bash
   cd apps/web
   ```

2. **Create .env file** (optional, has defaults)
   ```env
   # API URL (default: http://localhost:3001/api)
   VITE_API_URL="http://localhost:3001/api"
   ```

## Smart Contract Deployment

### Option 1: Use Existing Contracts (Recommended)

The contracts are already deployed on Sepolia testnet. The addresses are configured in the API `.env` file.

### Option 2: Deploy Your Own Contracts

If you want to deploy your own contracts:

1. **Navigate to contracts directory**
   ```bash
   cd contracts
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Hardhat**
   Edit `hardhat.config.ts` with your wallet private key and RPC URL.

4. **Compile contracts**
   ```bash
   pnpm compile
   ```

5. **Deploy to Sepolia**
   ```bash
   pnpm deploy
   ```

6. **Update .env files**
   Copy the deployed contract addresses to `apps/api/.env`:
   ```env
   LAND_REGISTRY_ADDRESS="0xYOUR_DEPLOYED_ADDRESS"
   OWNERSHIP_ADDRESS="0xYOUR_DEPLOYED_ADDRESS"
   VERIFICATION_ADDRESS="0xYOUR_DEPLOYED_ADDRESS"
   ```

### Get Test ETH

You'll need Sepolia test ETH to deploy contracts and register land:

**Faucets:**
- https://sepoliafaucet.com/
- https://sepolia-faucet.pk910.de/
- https://faucet.quicknode.com/ethereum/sepolia

## Running the Application

### Start All Services

#### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - API Server:**
```bash
cd apps/api
pnpm dev
```

**Expected Output:**
```
[INFO] Server running on http://127.0.0.1:3001
```

**Terminal 2 - Web Server:**
```bash
cd apps/web
pnpm dev
```

**Expected Output:**
```
VITE v8.0.10  ready in XXX ms

➜  Local:   http://localhost:5000/
➜  Network: use --host to expose
➜  press h to show help
```

#### Option 2: Single Command (From Root)

```bash
# From project root
pnpm dev
```

This starts both servers concurrently.

### Access the Application

1. **Web App:** http://localhost:5000 (or 5001 if 5000 is in use)
2. **API:** http://localhost:3001
3. **API Health Check:** http://localhost:3001/api/health

### Test the Application

#### 1. Test Officer Login

1. Navigate to http://localhost:5000/login
2. Switch to "Registry Officer" tab
3. Enter credentials:
   - Email: `officer@land.ke`
   - Password: `officer123`
4. Click "Sign in as Officer"
5. Should redirect to Officer Dashboard

#### 2. Test Landowner Login

1. Navigate to http://localhost:5000/login
2. Stay on "Landowner" tab
3. Click "Connect MetaMask"
4. Approve connection in MetaMask popup
5. Sign the authentication message
6. Should redirect to Landowner Dashboard

#### 3. Test Public Verification

1. Navigate to http://localhost:5000/verify
2. Enter a token ID (if you have registered parcels)
3. View ownership information

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

Or change the port in the code.

#### 2. Database Connection Error

**Error:**
```
PrismaClientInitializationError: `PrismaClient` needs valid options
```

**Solution:**
- Ensure `.env` file exists in `apps/api/`
- Verify `DATABASE_URL` is set correctly
- Run `pnpm prisma db push` again

#### 3. MetaMask Not Connecting

**Issues:**
- "MetaMask not detected"
- Connection fails silently

**Solution:**
- Install MetaMask browser extension
- Ensure you're on Sepolia network in MetaMask
- Check browser console for errors
- Try refreshing the page
- Clear MetaMask cache (Settings → Advanced → Reset Account)

#### 4. Module Not Found Errors

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd apps/api
pnpm install
pnpm prisma generate
```

#### 5. Invalid Credentials (Officer Login)

**Error:**
```
Invalid credentials
```

**Solution:**
1. Verify API server is running
2. Check database was seeded:
   ```bash
   cd apps/api
   pnpm seed
   ```
3. Open Prisma Studio and verify user exists:
   ```bash
   pnpm prisma studio
   ```

#### 6. CORS Errors

**Error:**
```
Access to fetch at 'http://localhost:3001' has been blocked by CORS policy
```

**Solution:**
- Verify API server is running
- Check CORS configuration in `apps/api/src/index.ts`
- Ensure web app URL matches CORS origin

#### 7. Smart Contract Interaction Fails

**Error:**
```
Transaction failed: insufficient funds
```

**Solution:**
- Get Sepolia test ETH from faucets
- Ensure you're on Sepolia network in MetaMask
- Check contract addresses in `.env` are correct
- Verify RPC URL is working

## Development Tips

### Prisma Workflows

**Update Database Schema:**
1. Edit `apps/api/prisma/schema.prisma`
2. Run `pnpm prisma db push`
3. Run `pnpm prisma generate` to update types

**Create Migration (For Production):**
```bash
pnpm prisma migrate dev --name description_of_change
```

**Reset Database:**
```bash
pnpm prisma db push --force-reset
pnpm seed
```

### Hot Reload

Both servers support hot reload:
- API: `ts-node-dev` watches for `.ts` file changes
- Web: Vite HMR updates instantly

### Debugging

**API Debugging:**
```typescript
// Add console.log or use VS Code debugger
console.log('Debug info:', variable)
```

**React Debugging:**
```typescript
// Use React DevTools browser extension
// Add debugger statement
debugger
```

**Smart Contract Debugging:**
```bash
# Use Hardhat console
pnpm hardhat console --network sepolia
```

### Database Management

**Prisma Studio:**
```bash
cd apps/api
pnpm prisma studio
```

Visual interface for:
- Viewing records
- Editing data
- Creating test data
- Exploring relationships

### Testing Blockchain Interactions

**Ethers.js REPL:**
```javascript
// In API code or Node REPL
const { ethers } = require('ethers')
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
const balance = await provider.getBalance('0xAddress')
console.log(ethers.formatEther(balance))
```

## Next Steps

Once you have the application running:

1. **Register a Land Parcel** (as Landowner)
2. **Review and Approve** (as Officer)
3. **Verify on Blockchain** (public)
4. **Transfer Ownership** (future feature)

For more information:
- [Architecture Documentation](ARCHITECTURE.md)
- [API Documentation](API.md)
- [Deployment Guide](DEPLOYMENT.md)

---

**Need Help?** Open an issue on GitHub or check the [Help Page](http://localhost:5000/help) in the app.
