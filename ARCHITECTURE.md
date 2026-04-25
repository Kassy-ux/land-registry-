# 🏗️ LandLedger Architecture

This document explains the system architecture, design decisions, and how different components work together.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Layers](#architecture-layers)
- [Authentication Flow](#authentication-flow)
- [Data Flow](#data-flow)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Database Design](#database-design)
- [Security Model](#security-model)
- [Technology Choices](#technology-choices)

## System Overview

LandLedger follows a **three-tier architecture** with blockchain integration:

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │   MetaMask   │  │  React Router│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                       HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Express    │  │    Prisma    │  │   Ethers.js  │     │
│  │  REST API    │  │     ORM      │  │   Client     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
        │                    │                    │
        │              ┌─────┴─────┐              │
        │              │           │              │
  ┌─────▼─────┐   ┌───▼───┐  ┌───▼───┐    ┌────▼─────┐
  │   IPFS    │   │SQLite │  │ IPFS  │    │ Sepolia  │
  │  (Pinata) │   │  DB   │  │(Docs) │    │Ethereum │
  └───────────┘   └───────┘  └───────┘    └──────────┘
```

## Architecture Layers

### 1. Presentation Layer (React Frontend)

**Location:** `apps/web/src/`

**Responsibilities:**
- User interface rendering
- Client-side routing
- Form validation
- Wallet integration
- State management

**Key Components:**
```
components/
  ├── DashboardLayout.tsx    # Layout wrapper for authenticated pages
  ├── Sidebar.tsx            # Navigation sidebar
  ├── TopBar.tsx             # Top navigation bar
  ├── ProtectedRoute.tsx     # Route guards for authentication
  ├── StatusBadge.tsx        # Parcel status indicators
  ├── StatCard.tsx           # Dashboard statistics cards
  └── WalletBadge.tsx        # Wallet address display

context/
  └── AuthContext.tsx        # Global authentication state

pages/
  ├── HomePage.tsx           # Public landing page
  ├── LoginPage.tsx          # Authentication page
  ├── LandownerDashboard.tsx # Landowner overview
  ├── OfficerDashboard.tsx   # Officer approval queue
  ├── MyParcelsPage.tsx      # Landowner parcels list
  ├── VerifyPage.tsx         # Public verification
  └── HelpPage.tsx           # Help and support
```

**Design Patterns:**
- **Context API** for global state (authentication)
- **Custom Hooks** for reusable logic
- **Component Composition** for UI flexibility
- **Route-based Code Splitting** for performance

### 2. Application Layer (Express API)

**Location:** `apps/api/src/`

**Responsibilities:**
- Business logic execution
- Request validation
- Authentication/authorization
- Database operations
- Blockchain interactions
- File uploads to IPFS

**Structure:**
```
controllers/
  ├── authController.ts       # Authentication logic
  ├── parcelController.ts     # Land parcel CRUD
  ├── transferController.ts   # Ownership transfers
  ├── documentController.ts   # Document uploads
  └── verifyController.ts     # Public verification

middleware/
  ├── requireAuth.ts          # JWT verification
  └── requireOfficer.ts       # Role-based access control

routes/
  ├── auth.ts                 # /api/auth/*
  ├── parcels.ts              # /api/parcels/*
  ├── transfers.ts            # /api/transfers/*
  ├── documents.ts            # /api/documents/*
  └── verify.ts               # /api/verify/*

services/
  ├── prismaService.ts        # Database client
  ├── blockchainService.ts    # Smart contract interactions
  └── pinataService.ts        # IPFS document storage
```

**API Design:**
- **RESTful** endpoints
- **JWT tokens** for stateless authentication
- **Middleware chain** for request processing
- **Error handling** with consistent format

### 3. Data Layer

#### 3.1 SQLite Database (via Prisma)

**Location:** `apps/api/prisma/`

**Purpose:** Store application data, user accounts, and metadata

**Models:**
- `User` - Landowners and officers
- `LandParcel` - Land registration details
- `Ownership` - Ownership history
- `Transaction` - Transfer records
- `Document` - Document metadata
- `BlockchainRecord` - Blockchain reference data

**Why SQLite?**
- Easy setup for development
- No separate database server required
- File-based, portable
- Prisma 7 requires adapters for all databases (using `@prisma/adapter-libsql`)

#### 3.2 Blockchain (Ethereum Sepolia)

**Location:** `contracts/contracts/`

**Purpose:** Immutable record keeping and verification

**Smart Contracts:**

1. **LandRegistry.sol** - Core registry
   - Register new parcels
   - Store parcel metadata hash
   - Emit registration events

2. **Ownership.sol** - Ownership tracking
   - Transfer ownership
   - Query ownership history
   - Multi-owner support

3. **Verification.sol** - Verification system
   - Verify parcel authenticity
   - Check ownership status
   - Public read access

#### 3.3 IPFS (via Pinata)

**Purpose:** Decentralized document storage

**Document Types:**
- Title deeds
- Survey plans
- Identification documents
- Supporting evidence

**Flow:**
1. User uploads document via web form
2. API receives file via multer
3. File uploaded to Pinata IPFS
4. IPFS hash stored in database
5. Smart contract stores hash on-chain

## Authentication Flow

### Landowner (MetaMask)

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │   API    │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │ 1. Click "Connect MetaMask"             │
     ├────────────────────────────────────────►│
     │                                         │
     │ 2. Request MetaMask connection          │
     ├────────────────────────────────────────►│
     │                                         │
     │ 3. MetaMask popup (user approves)       │
     │◄────────────────────────────────────────┤
     │                                         │
     │ 4. POST /api/auth/wallet                │
     │    { address, message, signature }      │
     ├────────────────────────────────────────►│
     │                                         │
     │                   5. Verify signature   │
     │                       (ethers.verifyMessage)
     │                                         │
     │                   6. Create/find user   │
     │                       in database       │
     │                                         │
     │ 7. Return success (no JWT needed)       │
     │◄────────────────────────────────────────┤
     │                                         │
     │ 8. Store wallet address in localStorage │
     │                                         │
```

**Key Points:**
- No JWT issued for wallet users
- Authentication via cryptographic signature
- Wallet address stored in localStorage
- Each API request includes wallet address
- Server verifies wallet ownership

### Registry Officer (JWT)

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │   API    │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │ 1. POST /api/auth/login                 │
     │    { email, password }                  │
     ├────────────────────────────────────────►│
     │                                         │
     │                   2. Find user by email │
     │                                         │
     │                   3. Compare password   │
     │                      (bcrypt.compare)   │
     │                                         │
     │                   4. Generate JWT       │
     │                      (jsonwebtoken)     │
     │                                         │
     │ 5. Return { token, user }               │
     │◄────────────────────────────────────────┤
     │                                         │
     │ 6. Store JWT in localStorage            │
     │                                         │
     │ 7. Include in subsequent requests:      │
     │    Authorization: Bearer <token>        │
     ├────────────────────────────────────────►│
     │                                         │
     │                   8. Verify JWT         │
     │                      (requireAuth)      │
     │                                         │
```

**Key Points:**
- Standard JWT authentication
- Password hashed with bcrypt (10 rounds)
- Token valid for 8 hours
- Middleware validates token on protected routes

## Data Flow

### Land Registration Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│Landowner │     │   Web    │     │   API    │     │Blockchain│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                 │
     │ Fill Form      │                │                 │
     ├───────────────►│                │                 │
     │                │                │                 │
     │ Upload Docs    │                │                 │
     ├───────────────►│                │                 │
     │                │                │                 │
     │                │ POST /api/parcels               │
     │                │ (multipart/form-data)            │
     │                ├───────────────►│                 │
     │                │                │                 │
     │                │                │ Upload to IPFS  │
     │                │                │ (Pinata)        │
     │                │                │                 │
     │                │                │ Store in DB     │
     │                │                │ (status: pending)│
     │                │                │                 │
     │                │ Return parcel  │                 │
     │                │◄───────────────┤                 │
     │                │                │                 │
     │ Show success   │                │                 │
     │◄───────────────┤                │                 │
     │                │                │                 │
                      [Officer Reviews]
     │                │                │                 │
     │                │ POST /api/parcels/:id/approve    │
     │                │                ├────────────────►│
     │                │                │                 │
     │                │                │ Call smart      │
     │                │                │ contract        │
     │                │                ├────────────────►│
     │                │                │                 │
     │                │                │                 │ Tx Mined
     │                │                │                 │ Event Emitted
     │                │                │◄────────────────┤
     │                │                │                 │
     │                │                │ Update DB       │
     │                │                │ (status: approved)│
     │                │                │ (tokenId: 123)  │
     │                │                │                 │
     │ Notification   │◄───────────────┤                 │
     │◄───────────────┤                │                 │
```

### Public Verification Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Public  │     │   Web    │     │   API    │     │Blockchain│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                 │
     │ Enter TokenID  │                │                 │
     ├───────────────►│                │                 │
     │                │                │                 │
     │                │ GET /api/verify/:tokenId         │
     │                ├───────────────►│                 │
     │                │                │                 │
     │                │                │ Query blockchain│
     │                │                ├────────────────►│
     │                │                │                 │
     │                │                │ Get ownership   │
     │                │                │ Get metadata    │
     │                │                │◄────────────────┤
     │                │                │                 │
     │                │                │ Query DB for    │
     │                │                │ additional info │
     │                │                │                 │
     │                │ Return data    │                 │
     │                │◄───────────────┤                 │
     │                │                │                 │
     │ Display Info   │                │                 │
     │◄───────────────┤                │                 │
```

## Smart Contract Architecture

### Contract Hierarchy

```
┌──────────────────────────────────┐
│         LandRegistry             │
│  - registerParcel()              │
│  - getParcel()                   │
│  - totalParcels()                │
└──────────────┬───────────────────┘
               │ uses
               │
┌──────────────▼───────────────────┐
│          Ownership               │
│  - transferOwnership()           │
│  - getOwner()                    │
│  - getOwnershipHistory()         │
└──────────────┬───────────────────┘
               │ uses
               │
┌──────────────▼───────────────────┐
│        Verification              │
│  - verifyParcel()                │
│  - isVerified()                  │
│  - verificationTimestamp()       │
└──────────────────────────────────┘
```

### Contract Deployment

**Network:** Sepolia Testnet

**Deployed Addresses:**
- LandRegistry: `0x7F5c027Ff6747d6a127861Df9108F5ee2f392da3`
- Ownership: `0x002f17B92Cb30Bc7e324A4F82e226e5b99c55C72`
- Verification: `0x1123194a6785E78a5d3Dc2FA8772214172a846D6`

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ name        │
│ email       │───┐
│ password    │   │
│ wallet      │   │ 1
│ role        │   │
└─────────────┘   │
                  │
                  │ N
           ┌──────▼──────┐
           │  Ownership  │
           ├─────────────┤
           │ id (PK)     │
           │ userId (FK) │
           │ landId (FK) │───┐
           │ date        │   │
           └─────────────┘   │
                             │ N
                      ┌──────▼────────┐
                      │  LandParcel   │
                      ├───────────────┤
                      │ id (PK)       │
                      │ titleNumber   │
                      │ location      │
                      │ size          │
                      │ status        │
                      │ tokenId       │
                      └───────┬───────┘
                              │ 1
                              │
                              │ N
                      ┌───────▼───────┐
                      │   Document    │
                      ├───────────────┤
                      │ id (PK)       │
                      │ parcelId (FK) │
                      │ ipfsHash      │
                      │ docType       │
                      │ uploadedAt    │
                      └───────────────┘
```

### Key Relationships

- **User ↔ Ownership**: One user can own multiple parcels (1:N)
- **LandParcel ↔ Ownership**: One parcel can have multiple owners over time (1:N)
- **LandParcel ↔ Document**: One parcel has multiple documents (1:N)
- **User ↔ Transaction**: Users can be buyers or sellers (1:N each)

## Security Model

### 1. Authentication Security

**Wallet Authentication:**
- Cryptographic signature verification
- No password storage for landowners
- Non-repudiation (signatures can't be faked)
- Replay attack prevention (message includes timestamp)

**Officer Authentication:**
- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration (8 hours)
- Token stored in localStorage (HttpOnly not needed for SPA)
- Secure password reset flow (future enhancement)

### 2. Authorization

**Role-Based Access Control (RBAC):**
```typescript
// Middleware stack
router.post('/parcels/:id/approve',
  requireAuth,       // Verify JWT
  requireOfficer,    // Check role === 'officer'
  approveParcel      // Execute action
)
```

**Protected Routes:**
- `/api/parcels` (POST) - Landowners only
- `/api/parcels/:id/approve` - Officers only
- `/api/parcels/:id/reject` - Officers only
- `/api/verify/:id` - Public (no auth)

### 3. API Security

**Headers (Helmet):**
```javascript
helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
})
```

**CORS Configuration:**
```javascript
cors({
  origin: 'http://localhost:5000',
  credentials: true
})
```

**Input Validation:**
- File upload limits (5MB per file)
- Allowed file types (PDF, JPEG, PNG)
- Request body size limits
- SQL injection prevention (Prisma ORM)

### 4. Blockchain Security

**Smart Contract Security:**
- Access control modifiers
- Reentrancy guards
- Integer overflow protection (Solidity 0.8+)
- Event emission for transparency

**Transaction Security:**
- Gas limit protection
- Nonce management
- Signature verification
- Private key never exposed to client

## Technology Choices

### Why React?
- ✅ Component-based architecture
- ✅ Large ecosystem
- ✅ TypeScript support
- ✅ Virtual DOM performance
- ✅ React Router for routing
- ✅ Context API for state management

### Why Express?
- ✅ Minimal, unopinionated
- ✅ Massive middleware ecosystem
- ✅ Great TypeScript support
- ✅ Industry standard
- ✅ Easy to test

### Why Prisma?
- ✅ Type-safe database client
- ✅ Auto-generated types
- ✅ Migration system
- ✅ Query builder with IntelliSense
- ✅ Multi-database support (future scalability)

### Why SQLite (Development)?
- ✅ Zero configuration
- ✅ File-based (easy backup)
- ✅ Perfect for development
- ✅ Can migrate to PostgreSQL/MySQL for production
- ✅ No separate database server

### Why Sepolia Testnet?
- ✅ Ethereum-compatible
- ✅ Free test ETH available
- ✅ Active development
- ✅ Good block explorers
- ✅ Path to mainnet deployment

### Why IPFS/Pinata?
- ✅ Decentralized storage
- ✅ Content addressing (hash-based)
- ✅ Immutable files
- ✅ No single point of failure
- ✅ Pinata provides reliable pinning service

### Why pnpm?
- ✅ Fast installation
- ✅ Efficient disk usage (shared dependencies)
- ✅ Strict dependency management
- ✅ Native monorepo support
- ✅ Compatible with npm packages

## Performance Considerations

### Frontend Optimization
- Code splitting by route
- Lazy loading components
- Memoization for expensive calculations
- Debounced search inputs
- Optimized image formats

### Backend Optimization
- Database indexing on frequently queried fields
- Connection pooling (future)
- Response caching for public endpoints
- Pagination for large datasets
- Batch blockchain queries

### Blockchain Optimization
- Event-based updates instead of polling
- Cached blockchain data in database
- Gas-optimized smart contracts
- Batch transactions when possible

## Future Enhancements

### Scalability
- [ ] Migrate to PostgreSQL for production
- [ ] Redis caching layer
- [ ] Load balancer for API
- [ ] CDN for frontend assets
- [ ] Microservices architecture

### Features
- [ ] Email notifications
- [ ] Real-time updates (WebSockets)
- [ ] Advanced search and filters
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support

### Security
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting
- [ ] API key management
- [ ] Audit logging
- [ ] Penetration testing

---

**Last Updated:** April 26, 2026
