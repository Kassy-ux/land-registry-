# Land Registry Monorepo

Blockchain-powered land administration system. Monorepo using **pnpm workspaces**.

## Structure
- `apps/web` — React 19 + Vite frontend (TypeScript, TailwindCSS, react-router, ethers).
- `apps/api` — Express 5 backend (TypeScript, Prisma 7 over PostgreSQL, JWT auth, ethers for blockchain).
- `contracts/` — Solidity smart contracts (Hardhat).
- `packages/shared` — Shared utilities.

## Replit Setup

### Database
Uses Replit's built-in PostgreSQL. The `DATABASE_URL` env var is provided by the platform. Migrations live under `apps/api/prisma/migrations` and are applied with `prisma migrate deploy`.

Demo accounts (seeded by `apps/api/prisma/seedAdmin.ts`):
- Admin — `admin@land.ke` / `admin123`
- Officer — `officer@land.ke` / `officer123`
- Landowner — `landowner@land.ke` / `landowner123`
- Buyer — `buyer@land.ke` / `buyer123`

Five sample parcels (`LR/2024/001`–`005`) with mixed approval states are seeded for demos.

## UI Stack
- Icons: **lucide-react** (no emojis anywhere)
- Toasts: **sonner** (via `<Toaster richColors />` in `App.tsx`)
- Charts: **recharts** (Pie + Bar on Admin Overview)
- Layout: collapsible `Sidebar` + mobile drawer + `TopNav` user menu, wrapped by `DashboardLayout`
- Illustrations: undraw-style SVGs from popsy.co in `apps/web/public/illustrations/`

Note: `tsconfig.app.json` has `verbatimModuleSyntax: true`, so type-only imports must use `import type` (e.g. `import { type SidebarItem }`).

### Workflows
- **Start application** — `pnpm --filter web dev` on port 5000 (Vite, host `0.0.0.0`, `allowedHosts: true`). Proxies `/api/*` to the backend.
- **Backend API** — `pnpm --filter api dev` on port 3001 (Express via ts-node-dev).

### Vite Dev Config
`apps/web/vite.config.ts` is configured with:
- `host: 0.0.0.0`, `port: 5000`
- `allowedHosts: true` (required for Replit's iframe proxy)
- `proxy: { '/api': 'http://localhost:3001' }`

The frontend talks to the API via the relative URL `/api` (`VITE_API_URL=/api`), so dev and production both use same-origin requests.

### Backend in Production
In production the Express server also serves the built frontend (`apps/web/dist`) as static assets, so a single port hosts both API and UI. The deployment is configured as VM target running `node apps/api/dist/index.js` on port 5000.

### Required Env Vars
Stored as Replit env vars (shared environment):
- `DATABASE_URL` (Replit-managed)
- `JWT_SECRET`
- `VITE_API_URL=/api`
- `SEPOLIA_RPC_URL`, `PRIVATE_KEY`
- `LAND_REGISTRY_ADDRESS`, `OWNERSHIP_ADDRESS`, `VERIFICATION_ADDRESS`
- `VITE_LAND_REGISTRY_ADDRESS`, `VITE_OWNERSHIP_ADDRESS`, `VITE_VERIFICATION_ADDRESS`
