# proNose

Post-rhinectomy rehabilitation tracker. Full-stack app:

- **`/client`** — React 19 + Vite + Tailwind (brand teal `#33E4DB` / white).
- **`/server`** — Node.js + Express + Sequelize, MySQL, JWT auth, image uploads (multer, 10 MB cap).

## Prerequisites

- Node.js 18+
- MySQL running locally

## Setup

1. **Install dependencies**

   ```bash
   npm run install:all     # installs both server and client
   # or individually:
   #   cd server && npm install
   #   cd client && npm install
   ```

2. **Configure the server**

   ```bash
   cd server
   cp .env.example .env     # then edit DB_USER / DB_PASS / JWT_SECRET as needed
   ```

3. **Create the database** (once)

   ```bash
   mysql -u root -e "CREATE DATABASE pronose CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

   Tables are created automatically by Sequelize on server boot.

4. **Seed demo data** (optional but recommended)

   ```bash
   npm run seed            # from repo root, or: cd server && npm run seed
   ```

   Demo accounts (password `password123`):

   | Role        | Email                     |
   |-------------|---------------------------|
   | super_admin | `admin@pronose.com`       |
   | doctor      | `lena.hart@pronose.com`   |
   | patient     | `amelia.rose@example.com` |

## Running

From the repo root (runs both, requires `npm install` at root for `concurrently`):

```bash
npm install     # root, for concurrently
npm run dev
```

Or in two terminals:

```bash
cd server && npm run dev    # http://localhost:4000
cd client && npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend on port 4000.

## API

| Method | Route                               | Notes                                  |
|--------|-------------------------------------|----------------------------------------|
| POST   | `/api/auth/register`                | Self-registers a patient, returns JWT  |
| POST   | `/api/auth/login`                   | Returns JWT + user                     |
| GET    | `/api/auth/me`                      | Rehydrate current user                 |
| GET    | `/api/consultations/:patientId`     | Role-scoped consultation history       |
| POST   | `/api/consultations`                | Patient submit (multipart, image ≤10MB)|
| PATCH  | `/api/consultations/:id`            | Doctor/admin: notes + mark reviewed    |
| GET    | `/api/messages/:userId/:doctorId`   | Conversation thread                    |
| POST   | `/api/messages`                     | Send a message                         |
| GET    | `/api/users`                        | Admin: all; doctor: assigned patients  |
| PATCH  | `/api/users/:id`                    | Self: contact info; admin: role/doctor |

Uploaded photos are stored in `server/uploads/` and served at `/uploads/<file>`.
