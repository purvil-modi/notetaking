# Hono.js REST API Backend

This is the backend REST API for the **Secure Note Sharing Application**, built using Hono.js, TypeScript, PostgreSQL, and Prisma ORM.

## Tech Stack
- **Framework**: Hono.js
- **Runtime**: Node.js
- **Database ORM**: Prisma ORM with PostgreSQL
- **Security & Cryptography**: bcryptjs, jsonwebtoken, Node crypto

## Features Implemented
1. **JWT Authentication**: Secure user session tokens.
2. **Repository Pattern**: Clean database querying layer.
3. **Audit Fields**: Tracking creation, soft deletion, and updates.
4. **Rate Limiting**: sliding window brute-force protection (max 5 requests per 15 minutes).
5. **Race Condition Prevention**: Database-level row locking (`SELECT FOR UPDATE` inside transactions) for one-time links.

## Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL 15+

### Installation & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:purvilmodi@localhost:5432/secure_notes?schema=public"
   JWT_SECRET="dev-jwt-secret-key-must-be-long-and-secure"
   CORS_ORIGIN="http://localhost:3000"
   ```

3. Run migrations to setup database tables:
   ```bash
   npx prisma migrate dev
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   The API will be live at `http://localhost:5000/api`.
