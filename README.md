# 🔐 Secure Note Sharing Application

A production-grade, end-to-end secure note sharing platform built as a monorepo with a **Hono.js** REST API backend and a **Next.js 15** frontend. Create encrypted notes, generate share links with configurable access controls (one-time self-destruct or time-based expiry), and optionally protect them with server-generated passwords.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (Docker Compose)](#quick-start-docker-compose)
  - [Local Development Setup](#local-development-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Architecture & Design Decisions](#-architecture--design-decisions)
- [Scripts Reference](#-scripts-reference)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Self-Destructing Notes** | One-time links that are permanently consumed after a single view |
| **Time-Based Expiry** | Set an exact expiry timestamp after which the link becomes inaccessible |
| **Password Protection** | Optionally secure notes with a server-generated 12-character password |
| **Race Condition Safety** | Atomic `SELECT FOR UPDATE` prevents double reads on one-time links |
| **Brute Force Protection** | Sliding-window rate limiter (5 attempts / 15 min) on password unlock |
| **JWT Authentication** | Secure cookie-based auth with 24-hour token expiry |
| **Security Headers** | CSP, X-Frame-Options, X-XSS-Protection, Referrer-Policy |
| **Dark Theme UI** | Modern dark-mode interface with shadcn/ui components |
| **Full Validation** | Zod schemas on both frontend and backend |
| **Docker Ready** | One-command deployment with Docker Compose |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| [Hono.js](https://hono.dev/) | Lightweight, high-performance web framework |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database client & migrations |
| [PostgreSQL 15](https://www.postgresql.org/) | Relational database |
| [Zod](https://zod.dev/) | Schema validation |
| [JSON Web Tokens](https://jwt.io/) | Authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing (12 rounds) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework with SSR |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible component library (Radix UI primitives) |
| [TanStack React Query](https://tanstack.com/query) | Server state management & caching |
| [React Hook Form](https://react-hook-form.com/) | Performant form handling |
| [Axios](https://axios-http.com/) | HTTP client with interceptors |
| [Sonner](https://sonner.emilkowal.dev/) | Toast notifications |
| [Zod](https://zod.dev/) | Client-side schema validation |

### Infrastructure
| Technology | Purpose |
|---|---|
| [Docker](https://www.docker.com/) | Containerization |
| [Docker Compose](https://docs.docker.com/compose/) | Multi-container orchestration |
| [Node.js 22 Alpine](https://hub.docker.com/_/node) | Runtime environment |

---

## 📁 Project Structure

```
notetaking/
├── docker-compose.yml             # Orchestrates all 3 services
├── .env                           # Root environment variables
├── README.md                      # This file
│
├── backend/                       # Hono.js REST API
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                       # Backend environment config
│   │
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (User, Note, enums)
│   │
│   └── src/
│       ├── server.ts              # Entry point — starts Hono server
│       ├── app.ts                 # App setup — CORS, security headers, routes
│       │
│       ├── config/
│       │   ├── env.ts             # Environment variable loader
│       │   └── database.ts        # Prisma client singleton
│       │
│       ├── routes/
│       │   ├── auth.routes.ts     # POST /register, POST /login
│       │   ├── notes.routes.ts    # CRUD for authenticated users
│       │   └── share.routes.ts    # Public share access & revocation
│       │
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── notes.controller.ts
│       │   └── share.controller.ts
│       │
│       ├── services/
│       │   ├── auth.service.ts    # Register/login logic
│       │   ├── notes.service.ts   # Note creation with token & password gen
│       │   ├── share.service.ts   # Share access validation & view tracking
│       │   ├── password.service.ts# bcrypt hashing & comparison
│       │   └── token.service.ts   # JWT sign & verify
│       │
│       ├── repositories/
│       │   ├── user.repository.ts # User CRUD with soft delete
│       │   └── note.repository.ts # Note CRUD, atomic one-time consumption
│       │
│       ├── middlewares/
│       │   ├── auth.middleware.ts  # JWT Bearer token verification
│       │   ├── error.middleware.ts # Global error handler
│       │   ├── rateLimit.middleware.ts  # Sliding window rate limiter
│       │   └── validate.middleware.ts   # Zod request validation
│       │
│       └── validators/
│           ├── auth.validator.ts  # Register & login schemas
│           └── note.validator.ts  # Create note & unlock schemas
│
└── frontend/                      # Next.js 15 Application
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── middleware.ts              # Edge middleware — auth route protection
    │
    ├── app/
    │   ├── globals.css            # Dark theme CSS variables (shadcn/ui)
    │   ├── layout.tsx             # Root layout — Inter font, providers
    │   ├── page.tsx               # Landing page — hero, features, CTAs
    │   │
    │   ├── (auth)/
    │   │   ├── layout.tsx         # Centered card layout for auth pages
    │   │   ├── login/
    │   │   │   └── page.tsx       # Login form
    │   │   └── register/
    │   │       └── page.tsx       # Registration form
    │   │
    │   ├── (protected)/
    │   │   ├── layout.tsx         # Auth guard + navbar wrapper
    │   │   └── notes/
    │   │       ├── new/
    │   │       │   └── page.tsx   # Create new note form
    │   │       └── [id]/
    │   │           └── page.tsx   # Note detail + share link + revoke
    │   │
    │   └── share/
    │       └── [token]/
    │           └── page.tsx       # Public share view / password unlock
    │
    ├── components/
    │   ├── providers.tsx          # TanStack React Query provider
    │   ├── navbar.tsx             # Navigation bar with auth state
    │   ├── note-form.tsx          # Note creation form (react-hook-form)
    │   ├── note-card.tsx          # Note display with status badges
    │   ├── share-link-display.tsx # Copy-able share URL + password reveal
    │   ├── unlock-form.tsx        # Password entry for protected notes
    │   │
    │   └── ui/                    # shadcn/ui component library
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── skeleton.tsx
    │       ├── sonner.tsx
    │       └── textarea.tsx
    │
    ├── services/
    │   ├── api.ts                 # Axios instance with interceptors
    │   ├── auth.service.ts        # Login/register/logout + cookie mgmt
    │   ├── notes.service.ts       # Note CRUD API calls
    │   └── share.service.ts       # Share/unlock/revoke API calls
    │
    ├── hooks/
    │   ├── use-create-note.ts     # useMutation for note creation
    │   ├── use-note.ts            # useQuery + useRevokeNote mutation
    │   └── use-share.ts           # useSharedNote query + useUnlockNote
    │
    ├── schemas/
    │   ├── auth.ts                # Zod schemas (register, login)
    │   └── note.ts                # Zod schemas (createNote, unlock)
    │
    ├── types/
    │   └── index.ts               # TypeScript interfaces & type aliases
    │
    └── lib/
        └── utils.ts               # cn() helper + formatDate()
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22
- **npm** ≥ 10
- **PostgreSQL** 15+ (or Docker for containerized setup)
- **Docker & Docker Compose** (optional, for one-command setup)

---

### Quick Start (Docker Compose)

The easiest way to run the entire stack — database, backend, and frontend — with a single command:

```bash
# Clone the repository
git clone <repository-url>
cd notetaking

# Start all services
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| PostgreSQL | localhost:5432 |

> **Note:** On first run, you will need to run Prisma migrations against the database:
> ```bash
> docker exec -it secure-notes-backend npx prisma migrate dev --name init
> ```

---

### Local Development Setup

#### 1. Database Setup

Ensure PostgreSQL is running locally and create the database:

```bash
# Using psql
psql -U postgres
CREATE DATABASE secure_notes;
\q
```

Or start only the PostgreSQL container:

```bash
docker-compose up postgres -d
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment (edit .env if needed)
# Default: postgresql://postgres:purvilmodi@localhost:5432/secure_notes

# Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start development server (with hot reload)
npm run dev
```

The Hono API will be running at **http://localhost:5000/api**

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
```

The Next.js app will be running at **http://localhost:3000**

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:purvilmodi@localhost:5432/secure_notes?schema=public` |
| `JWT_SECRET` | Secret key for signing JWTs | `dev-jwt-secret-key-must-be-long-and-secure` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL (for share links) | `http://localhost:3000` |

> ⚠️ **Production:** Change `JWT_SECRET` to a strong random string and update `CORS_ORIGIN` to your production domain.

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register` | ❌ | Create a new user account |
| `POST` | `/api/login` | ❌ | Login and receive JWT token |

**POST /api/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**POST /api/login**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (both):**
```json
{
  "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Notes (Authenticated)

All note endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes` | Create a new encrypted note |
| `GET` | `/api/notes` | List all notes owned by the user |
| `GET` | `/api/notes/:id` | Get a specific note by ID |

**POST /api/notes**
```json
{
  "title": "My Secret Note",
  "content": "This is the secret content...",
  "shareType": "ONE_TIME",
  "accessType": "PASSWORD_PROTECTED",
  "expiryAt": "2026-12-31T23:59:59.000Z"
}
```

| Field | Type | Required | Values |
|---|---|---|---|
| `title` | string | ✅ | 1–200 characters |
| `content` | string | ✅ | Min 1 character |
| `shareType` | enum | ✅ | `ONE_TIME` · `TIME_BASED` |
| `accessType` | enum | ✅ | `PUBLIC` · `PASSWORD_PROTECTED` |
| `expiryAt` | ISO 8601 | ❌ | Must be a future date |

**Response:**
```json
{
  "note": {
    "id": "uuid",
    "title": "My Secret Note",
    "shareToken": "a1b2c3d4...",
    "shareType": "ONE_TIME",
    "accessType": "PASSWORD_PROTECTED",
    "expiryAt": "2026-12-31T23:59:59.000Z",
    "viewCount": 0,
    "isRevoked": false,
    "isUsed": false,
    "createdAt": "2026-07-01T..."
  },
  "password": "aB3dEf7hIj2k"
}
```

> The `password` field is only returned for `PASSWORD_PROTECTED` notes and is **shown only once**.

---

### Share (Public)

| Method | Endpoint | Auth | Rate Limited | Description |
|---|---|---|---|---|
| `GET` | `/api/share/:token` | ❌ | ❌ | Access a shared note |
| `POST` | `/api/share/:token/unlock` | ❌ | ✅ 5/15min | Unlock a password-protected note |
| `DELETE` | `/api/share/revoke/:id` | ✅ | ❌ | Revoke a share link |

**POST /api/share/:token/unlock**
```json
{
  "password": "aB3dEf7hIj2k"
}
```

---

## 🗄 Database Schema

```
┌──────────────────────────┐       ┌──────────────────────────────────┐
│          users           │       │             notes                │
├──────────────────────────┤       ├──────────────────────────────────┤
│ id          UUID (PK)    │──┐    │ id              UUID (PK)        │
│ name        VARCHAR      │  │    │ title           VARCHAR          │
│ email       VARCHAR (UQ) │  │    │ content         TEXT             │
│ password_hash VARCHAR    │  │    │ share_token     VARCHAR (UQ)     │
│ is_active   BOOLEAN      │  │    │ share_type      ShareType (ENUM) │
│ is_delete   BOOLEAN      │  │    │ access_type     AccessType (ENUM)│
│ created_at  TIMESTAMP    │  │    │ hashed_password VARCHAR?         │
│ updated_at  TIMESTAMP    │  │    │ expiry_at       TIMESTAMP?       │
└──────────────────────────┘  │    │ is_revoked      BOOLEAN          │
                              │    │ is_used         BOOLEAN          │
                              │    │ view_count      INTEGER          │
                              │    │ is_active       BOOLEAN          │
                              │    │ is_delete       BOOLEAN          │
                              │    │ created_at      TIMESTAMP        │
                              │    │ updated_at      TIMESTAMP        │
                              └───>│ owner_id        UUID (FK)        │
                                   └──────────────────────────────────┘

Enums:
  ShareType  = ONE_TIME | TIME_BASED
  AccessType = PUBLIC | PASSWORD_PROTECTED
```

---

## 🏗 Architecture & Design Decisions

### 1. Fully Decoupled Monorepo

The frontend and backend are completely independent applications. The frontend does **not** import Prisma, database models, or server-side route handlers. All communication happens via standard JSON HTTP requests through Axios.

### 2. Authentication Flow

```
┌──────────┐     POST /login      ┌──────────┐     Verify         ┌──────────┐
│ Frontend │ ──────────────────> │ Backend  │ ───────────────> │ Database │
│          │ <────────────────── │          │ <─────────────── │          │
│  Stores  │     { token }       │  Issues  │     User data    │          │
│  cookie  │                     │   JWT    │                  │          │
└──────────┘                     └──────────┘                  └──────────┘
```

- **JWT tokens** are signed with a configurable secret and expire after **24 hours**
- Tokens are stored as **secure cookies** (js-cookie: `secure`, `sameSite: strict`, 1-day expiry)
- An **Axios request interceptor** automatically attaches the Bearer token to every API call
- Next.js **edge middleware** protects `/notes/*` routes, redirecting unauthenticated users to login

### 3. Share Link Security

| Share Type | Behavior |
|---|---|
| `ONE_TIME` | Self-destructs after a single view. Uses atomic `SELECT FOR UPDATE` in a database transaction to prevent race conditions where concurrent requests could both consume the link. |
| `TIME_BASED` | Remains accessible until `expiryAt` timestamp. View count is incremented on each access. |

| Access Type | Behavior |
|---|---|
| `PUBLIC` | Anyone with the link can view the note content. |
| `PASSWORD_PROTECTED` | A **server-generated 12-character password** (base64url) is required. Hashed with bcrypt (12 rounds) before storage. Rate limited to **5 unlock attempts per 15 minutes** per IP+token. |

### 4. Layered Backend Architecture

```
Request → Middleware (auth/validate/rateLimit) → Controller → Service → Repository → Prisma → DB
```

Each layer has a clear responsibility:
- **Middlewares** — Cross-cutting concerns (auth, validation, rate limiting, error handling)
- **Controllers** — Extract request data, delegate to services, return responses
- **Services** — Business logic (token generation, password hashing, access validation)
- **Repositories** — Data access layer (Prisma queries, transactions)

### 5. Security Measures

- **Passwords**: bcrypt with 12 salt rounds
- **Race conditions**: `SELECT ... FOR UPDATE` row-level locking in transactions
- **Rate limiting**: In-memory sliding window with automatic cleanup (every 5 min)
- **Input validation**: Zod schemas on both frontend and backend
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Content-Security-Policy`
- **CORS**: Configurable origin with credentials support
- **Soft deletes**: Records are never physically deleted (`isDelete` flag)

---

## 📜 Scripts Reference

### Backend (`cd backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled production build |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:migrate` | Run database migrations |

### Frontend (`cd frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server on port 3000 |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

### Docker

| Command | Description |
|---|---|
| `docker-compose up --build` | Build and start all services |
| `docker-compose up -d` | Start in detached mode |
| `docker-compose down` | Stop all services |
| `docker-compose down -v` | Stop and remove volumes (deletes DB data) |
| `docker-compose logs -f backend` | Follow backend logs |

---

## 📄 License

This project is private and proprietary.
