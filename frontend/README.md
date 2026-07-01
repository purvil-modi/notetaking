# Next.js 15 Client-Side Frontend

This is the frontend client for the **Secure Note Sharing Application**, built using Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Client-Side only API calls)
- **Library**: React 19
- **HTTP Client**: Axios with interceptors
- **Form Management**: React Hook Form with Zod schemas
- **State & Caching**: TanStack Query (React Query)
- **UI Components**: custom-styled shadcn/ui

## Key Operations
1. **Decoupled Architecture**: Zero direct database connections; communicates exclusively via REST API.
2. **Custom JWT Middleware**: Reads token cookies to restrict client-side navigation inside `/notes/*` routes.
3. **Axios Interceptor**: Injects Bearer token cookie into the headers of all outbound requests automatically.
4. **Suspense Prerendering**: Encapsulates pages using `useSearchParams` in `<Suspense>` boundaries to avoid Next.js static bailout errors.

## Getting Started

### Installation & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (optional - default points to `http://localhost:5000/api`):
   Create a `.env` file:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
