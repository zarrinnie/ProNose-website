# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**proNose** is a post-rhinectomy rehabilitation tracker. Patients submit consultation photos and notes; doctors review them and exchange messages with patients; a super admin manages users and role assignments.

## Commands

All commands below are run from the **repo root** unless noted.

```bash
# Install all dependencies (server + client)
npm run install:all

# Run both server and client concurrently (dev mode)
npm run dev

# Run server only  →  http://localhost:4000
npm run dev:server    # or: cd server && npm run dev

# Run client only  →  http://localhost:5173
npm run dev:client    # or: cd client && npm run dev

# Seed demo data (requires DB to exist and server deps installed)
npm run seed

# Lint client code
cd client && npm run lint

# Build client for production
cd client && npm run build
```

### One-time database setup
```bash
mysql -u root -e "CREATE DATABASE pronose CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cp server/.env.example server/.env   # then edit DB_USER / DB_PASS / JWT_SECRET
```

Sequelize auto-syncs tables on server boot (`server/src/index.js`). No manual migrations needed.

## Architecture

### Monorepo layout
```
/client   React 19 + Vite + Tailwind SPA
/server   Node.js + Express + Sequelize + MySQL REST API
```

The root `package.json` orchestrates both via `concurrently`. Each subdirectory has its own `package.json`.

### Client (`/client/src`)

- **`api/`** — thin `fetch` wrappers. `client.js` holds `apiFetch` (adds JWT header, parses JSON/errors) and `getToken`/`setToken` (localStorage key `pronose_token`). All other `api/*.js` files call `apiFetch`.
- **`context/AuthContext.jsx`** — single global context. Holds `currentUser`, session rehydration from stored JWT, `consultations` list (patients only), and helpers (`login`, `register`, `logout`, `addConsultation`, `updateUser`). Access via `useAuth()`.
- **`lib/roles.js`** — role-to-route mapping (`homeForRole`), nav tab definitions per role (`navTabs`).
- **`components/`** — shared UI: `AppLayout` (shell with `Sidebar` on desktop / `BottomNav` on mobile), `ProtectedRoute` (redirects unauthenticated users; optionally checks `roles` prop), `AuthLayout`, `TopBar`, reusable `TextField`, `PillButton`.
- **`pages/`** — organized by role: `pages/auth/`, `pages/doctor/`, `pages/admin/`, and patient pages at the top level (`Dashboard`, `Consultation`, `Chat`, `Profile`).

**Routing** (`App.jsx`): All protected pages sit inside a `<ProtectedRoute><AppLayout /></ProtectedRoute>` parent route. Role-gated routes (doctor, admin) wrap their element in a second `<ProtectedRoute roles={[...]}>`.

**Brand colors**: teal `#33E4DB` (primary) on a white background.

### Server (`/server/src`)

- **`config/db.js`** — Sequelize instance connecting to MySQL via env vars.
- **`models/`** — `User`, `Consultation`, `Message`. Associations declared inside each model file; `models/index.js` imports them all so they register before `sequelize.sync()`.
- **`middleware/auth.js`** — `authenticate` (verifies JWT Bearer token, loads `req.user`), `requireRole(...roles)` (403 guard), `signToken(user)`.
- **`middleware/upload.js`** — multer config; stores files in `server/uploads/`, 10 MB cap.
- **`routes/`** → **`controllers/`** — standard Express route/controller split for `auth`, `consultations`, `messages`, `users`.
- **`app.js`** — mounts all routes under `/api/*`; serves `server/uploads/` at `/uploads`.

### Auth flow
1. Client sends credentials → server returns JWT.
2. JWT stored in `localStorage` (`pronose_token`).
3. `AuthContext` rehydrates on mount via `GET /api/auth/me`.
4. Every API call attaches `Authorization: Bearer <token>` via `apiFetch`.

### Roles
Three roles with separate UI views: `patient` (default), `doctor`, `super_admin`. Role determines the post-login landing route and the available nav tabs (see `client/src/lib/roles.js`).

### Dev proxy
Vite's dev server proxies `/api` and `/uploads` to `http://localhost:4000`, so no CORS issues and no absolute URL needed in client code.

## Environment variables (server)

See `server/.env.example`. Key vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT` (default 4000), `CLIENT_ORIGIN`.
