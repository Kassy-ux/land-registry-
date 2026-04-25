# Land Registry Monorepo

Blockchain-backed land registry system with a React/Vite web client, an Express + Prisma API, and Solidity smart contracts (Hardhat) deployed to the Sepolia testnet.

## Structure

- `apps/web` — React 19 + Vite 8 frontend (Tailwind, ethers, react-router)
- `apps/api` — Express 5 + Prisma 7 (PostgreSQL via `@prisma/adapter-pg`) + ethers + Pinata
- `contracts` — Hardhat project with `LandRegistry`, `Ownership`, and `Verification` contracts
- `packages/shared` — placeholder for shared code

## Replit Environment

- Package manager: `pnpm` (workspace)
- Node: 20 (Replit `nodejs-20` module)
- Database: Replit-managed PostgreSQL (Helium); `DATABASE_URL` and `PG*` vars are auto-provisioned

### Workflows

- `Start application` (webview, port 5000) — `pnpm --filter web dev`
  - Vite binds to `0.0.0.0:5000`, allows all hosts (proxy-friendly), and proxies `/api` → `http://localhost:3001`
- `API` (console, port 3001) — `pnpm --filter api dev`
  - Express binds to `127.0.0.1:3001`

### Environment variables

Set as shared secrets in Replit:

- `DATABASE_URL` (managed)
- `JWT_SECRET` (auto-generated)
- `PORT=3001`, `FRONTEND_URL=*`
- `SEPOLIA_RPC_URL`, `PRIVATE_KEY`
- `LAND_REGISTRY_ADDRESS`, `OWNERSHIP_ADDRESS`, `VERIFICATION_ADDRESS` (used by API)
- `VITE_API_URL=/api` (relative, served via Vite proxy in dev and same-origin in prod)
- `VITE_LAND_REGISTRY_ADDRESS`, `VITE_OWNERSHIP_ADDRESS`, `VITE_VERIFICATION_ADDRESS`
- Optional: `PINATA_API_KEY`, `PINATA_SECRET_KEY` (only required for document uploads)

### Database

The Prisma schema lives in `apps/api/prisma/schema.prisma`. Migrations have been applied. A seeded officer account exists:

- Email: `officer@land.ke`
- Password: `officer123`

Re-seed manually with:

```bash
cd apps/api && npx ts-node prisma/seed.ts
```

## Production / Deployment

Deployment target is **autoscale**. The build step installs dependencies, runs Prisma migrations, and builds both the web and API. The run step starts the compiled API which also serves the Vite-built static assets from `apps/web/dist`, so the entire app is served from a single port.

- Build: `pnpm install --frozen-lockfile && prisma generate && prisma migrate deploy && build web && build api`
- Run: `HOST=0.0.0.0 PORT=5000 node apps/api/dist/index.js`

## Notable Setup Decisions

- `apps/api/src/services/pinataService.ts` was made lazy so the API boots without Pinata credentials configured; uploading a document throws a clear error if they're missing.
- `apps/api/src/index.ts` serves `apps/web/dist` (when present) and binds to a configurable host/port for prod.
- `apps/web/vite.config.ts` enables `allowedHosts: true` and a `/api` proxy so the iframe-proxied dev preview works without CORS.
- A `Window.ethereum` ambient declaration was added at `apps/web/src/types/window.d.ts` so the TypeScript build succeeds with MetaMask integration code.

## UI / Design System

Brand: **LandLedger** (icon-driven blue/indigo palette).

- Iconography: `react-icons` (Heroicons v2 outline via `react-icons/hi2`, `FaEthereum` & `FaWallet` from `react-icons/fa6`). No emojis anywhere.
- Illustrations: undraw.co SVGs in `apps/web/src/assets/illustrations/` (hero-location, secure-login, verified, empty-data, empty-tasks, analyze, route-planning, collaboration, success, thinking).
- Shared layout components in `apps/web/src/components/`:
  - `Logo.tsx` — gradient shield + word-mark, `sm`/`md`/`lg` sizes.
  - `Sidebar.tsx` — role-based navigation (`landowner` / `officer`), uses `NavLink` for active state.
  - `TopBar.tsx` — page title + search + notifications slot for dashboards.
- Pages redesigned with the AlphaWave-inspired sidebar+topbar shell:
  - `HomePage.tsx`, `LoginPage.tsx`, `VerifyPage.tsx`, `LandownerDashboard.tsx`, `OfficerDashboard.tsx`.
