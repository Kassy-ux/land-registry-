# 🏛️ LandLedger - Blockchain Land Registry System

A modern, secure land registry system built on blockchain technology, providing immutable proof of land ownership and transparent transaction history.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🌟 Overview

LandLedger is a full-stack blockchain-based land registry application that digitizes and secures land ownership records. The system combines modern web technologies with Ethereum smart contracts to provide:

- **Immutable Records**: All land registrations are recorded on the blockchain
- **Transparent Verification**: Anyone can verify land ownership publicly
- **Secure Authentication**: MetaMask wallet integration for landowners, JWT for officers
- **Document Management**: IPFS-based document storage with cryptographic verification
- **Officer Workflow**: Registry officers can review and approve registrations

## ✨ Features

### For Landowners
- 🔐 **MetaMask Authentication**: Sign in securely with your Ethereum wallet
- 📝 **Land Registration**: Submit new land parcels with supporting documents
- 📊 **Dashboard**: View all your registered parcels and their status
- 🔍 **Transfer Ownership**: Initiate blockchain-based ownership transfers
- 📄 **Document Upload**: Attach title deeds, surveys, and identification documents

### For Registry Officers
- 👨‍💼 **Email/Password Login**: Secure officer portal access
- ✅ **Review Queue**: Approve or reject pending registrations
- 📋 **Application History**: Track all reviewed applications
- 🔍 **Verification Tools**: Verify submitted documents and blockchain records

### Public Features
- 🌐 **Public Verification**: Anyone can verify land parcel ownership
- 📖 **Transaction History**: View complete ownership history
- 🔗 **Blockchain Explorer**: Link to Sepolia testnet records

## 🛠️ Technology Stack

### Frontend
- **React 19.2.5** - UI library
- **TypeScript 6.0.3** - Type-safe development
- **Vite 8.0.10** - Fast build tool
- **React Router 7.14.2** - Client-side routing
- **Tailwind CSS 4.2.4** - Utility-first styling
- **ethers.js 6.16.0** - Ethereum wallet integration
- **react-hot-toast** - Notifications
- **react-icons** - Icon library

### Backend
- **Node.js** with **Express 5.2.1**
- **TypeScript 6.0.3**
- **Prisma 7.8.0** - Database ORM
- **SQLite** - Development database (via LibSQL adapter)
- **JWT** - Officer authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Blockchain
- **Solidity** - Smart contract language
- **Hardhat** - Ethereum development environment
- **Sepolia Testnet** - Test network deployment
- **3 Smart Contracts**:
  - `LandRegistry.sol` - Core land parcel registration
  - `Ownership.sol` - Ownership tracking and transfers
  - `Verification.sol` - Document and parcel verification

### Infrastructure
- **pnpm** - Fast, disk-efficient package manager
- **Monorepo** - Organized workspace structure
- **IPFS/Pinata** - Decentralized document storage

## 📁 Project Structure

```
land-registry/
├── apps/
│   ├── api/                          # Backend API server
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   ├── migrations/          # Database migrations
│   │   │   └── seed.ts              # Database seeding
│   │   ├── src/
│   │   │   ├── controllers/         # Request handlers
│   │   │   │   ├── authController.ts
│   │   │   │   ├── parcelController.ts
│   │   │   │   ├── transferController.ts
│   │   │   │   ├── documentController.ts
│   │   │   │   └── verifyController.ts
│   │   │   ├── middleware/          # Auth middleware
│   │   │   ├── routes/              # API routes
│   │   │   ├── services/            # Business logic
│   │   │   │   ├── prismaService.ts
│   │   │   │   ├── blockchainService.ts
│   │   │   │   └── pinataService.ts
│   │   │   ├── abis/                # Smart contract ABIs
│   │   │   ├── types/               # TypeScript types
│   │   │   └── index.ts             # Server entry point
│   │   ├── .env                     # Environment variables
│   │   └── package.json
│   │
│   └── web/                          # Frontend React app
│       ├── src/
│       │   ├── components/          # Reusable UI components
│       │   │   ├── DashboardLayout.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── TopBar.tsx
│       │   │   ├── ProtectedRoute.tsx
│       │   │   ├── StatCard.tsx
│       │   │   ├── StatusBadge.tsx
│       │   │   └── ...
│       │   ├── context/             # React Context
│       │   │   └── AuthContext.tsx  # Authentication state
│       │   ├── pages/               # Page components
│       │   │   ├── HomePage.tsx
│       │   │   ├── LoginPage.tsx
│       │   │   ├── LandownerDashboard.tsx
│       │   │   ├── OfficerDashboard.tsx
│       │   │   ├── MyParcelsPage.tsx
│       │   │   ├── VerifyPage.tsx
│       │   │   ├── HelpPage.tsx
│       │   │   └── ...
│       │   ├── services/            # API clients
│       │   │   └── api.ts
│       │   ├── types/               # TypeScript interfaces
│       │   ├── App.tsx              # Root component
│       │   └── main.tsx             # App entry point
│       └── package.json
│
├── contracts/                        # Smart contracts
│   ├── contracts/
│   │   ├── LandRegistry.sol
│   │   ├── Ownership.sol
│   │   └── Verification.sol
│   ├── scripts/
│   │   └── deploy.ts                # Deployment script
│   ├── test/                        # Contract tests
│   ├── deployments.json             # Deployed contract addresses
│   └── hardhat.config.ts
│
├── .gitignore
├── pnpm-workspace.yaml              # Monorepo configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm** (v8+): `npm install -g pnpm`
- **MetaMask** browser extension
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kassy-ux/land-registry-.git
   cd land-registry-
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # API environment
   cp apps/api/.env.example apps/api/.env
   
   # Edit apps/api/.env with your values
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your-secret-key"
   SEPOLIA_RPC_URL="your-alchemy-or-infura-url"
   PRIVATE_KEY="0x..."
   LAND_REGISTRY_ADDRESS="0x7F5c027Ff6747d6a127861Df9108F5ee2f392da3"
   OWNERSHIP_ADDRESS="0x002f17B92Cb30Bc7e324A4F82e226e5b99c55C72"
   VERIFICATION_ADDRESS="0x1123194a6785E78a5d3Dc2FA8772214172a846D6"
   PINATA_JWT="your-pinata-jwt"
   ```

4. **Initialize the database**
   ```bash
   cd apps/api
   pnpm prisma db push
   pnpm seed
   cd ../..
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - API server
   cd apps/api
   pnpm dev
   
   # Terminal 2 - Web app
   cd apps/web
   pnpm dev
   ```

6. **Access the application**
   - Web App: http://localhost:5000 (or 5001 if 5000 is in use)
   - API: http://localhost:3001

### Default Credentials

**Registry Officer:**
- Email: `officer@land.ke`
- Password: `officer123`

**Landowner:** Use MetaMask wallet connection

## 📚 Documentation

For detailed documentation, see:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design decisions
- **[SETUP.md](docs/SETUP.md)** - Detailed setup and configuration guide
- **[API.md](docs/API.md)** - API endpoints and usage
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Version history and changes

## 🔧 Development

### Available Scripts

**Root-level:**
```bash
pnpm dev         # Start all development servers
pnpm build       # Build all apps
pnpm clean       # Clean all build artifacts
```

**API (apps/api):**
```bash
pnpm dev         # Start API server with hot reload
pnpm build       # Build for production
pnpm start       # Start production server
pnpm seed        # Seed database with initial data
```

**Web (apps/web):**
```bash
pnpm dev         # Start Vite dev server
pnpm build       # Build for production
pnpm preview     # Preview production build
```

**Contracts:**
```bash
pnpm compile     # Compile smart contracts
pnpm test        # Run contract tests
pnpm deploy      # Deploy to Sepolia testnet
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- Pinata for IPFS hosting
- The open-source community

---

**Built with ❤️ by the LandLedger Team**