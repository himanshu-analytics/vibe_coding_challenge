# TribeTask — Route Index

> Generated: 2026-02-23  
> Project: `landing_page_v2` (Next.js 16 App Router)  
> Auth: Supabase (middleware-enforced session guard)

---

## TL;DR

| Type | Count | Auth required |
|------|-------|---------------|
| Page routes | 5 | Mix (see below) |
| API routes | 10 | All except webhook |
| Special (callback, redirect) | 2 | N/A |

---

## Page Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | **Public** | Marketing landing page |
| `/auth/login` | **Public** | Magic-link login / sign-up form |
| `/auth/callback` | **Public** | Supabase OAuth/magic-link exchange (redirects to `/dashboard` or `/onboarding`) |
| `/onboarding` | **Protected** | New-user onboarding — create or join a tribe |
| `/dashboard` | **Protected** | Primary app view — tribe task board with nudge controls |
| `/settings` | **Protected** | Account & billing settings; plan upgrade via Stripe |

> **Protected** = redirected to `/auth/login` by `src/middleware.ts` if no active session.

---

## API Routes

### Tasks

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/tasks` | 🔒 Session | List tasks for the caller's tribe (filtered by `tribe_id` query param) |
| `POST` | `/api/tasks` | 🔒 Session | Create a new task in a tribe |
| `PATCH` | `/api/tasks/[id]` | 🔒 Session | Update a task (status, assignee, title, description, due date) |
| `DELETE` | `/api/tasks/[id]` | 🔒 Session | Delete a task by ID |

### Tribes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/tribes` | 🔒 Session | Create a new tribe; generates invite code; sends welcome email via Resend |
| `POST` | `/api/tribes/join` | 🔒 Session | Join an existing tribe using an invite code |
| `GET` | `/api/tribes/settings` | 🔒 Session | Fetch tribe details + member list for the settings page |
| `PATCH` | `/api/tribes/settings` | 🔒 Session | Update tribe name or rotate invite code |

### Nudges

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/nudge` | 🔒 Session | Send a nudge for a task; rate-limited to 1 per task per hour; triggers Resend email |
| `GET` | `/api/nudge` | 🔒 Session | Fetch incoming nudges for the current user (optionally scoped to `tribe_id`) |
| `PATCH` | `/api/nudge` | 🔒 Session | Mark nudge(s) as read (accepts array of `nudgeIds`) |

### Auth (API)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/demo-login` | **Public** | Signs in with pre-seeded demo credentials; only active when `NEXT_PUBLIC_DEMO_MODE=true`; redirects to `/dashboard` or `/onboarding` |

### Stripe / Billing

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/stripe/checkout` | 🔒 Session | Create a Stripe Checkout session for a plan upgrade; returns `{ url }` |
| `GET` | `/api/stripe/sync` | 🔒 Session | Post-checkout success redirect handler; retrieves Stripe session, upserts `subscriptions` table, redirects to `/settings?upgraded=<plan>` |
| `POST` | `/api/stripe/webhook` | **Public (Stripe sig)** | Stripe webhook receiver; verifies `STRIPE_WEBHOOK_SECRET` signature; handles `checkout.session.completed` and `customer.subscription.updated/deleted` events |

---

## Auth Flow

```
User enters email → POST /api/auth magic-link (Resend) → User clicks link
→ /auth/callback (Supabase token exchange)
→ New user? → /onboarding
→ Existing user? → /dashboard
```

---

## Middleware Protection

**File**: `src/middleware.ts`

```
Protected paths: /dashboard/*, /onboarding/*, /settings/*
Unprotected: /, /auth/*, /api/*, static assets
```

The middleware runs on every request (excluding static assets), checks the Supabase session, and redirects unauthenticated users to `/auth/login`.

---

## Environment Variables Required

| Variable | Used by |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | All Supabase clients + middleware |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + middleware |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin client (server-only) |
| `RESEND_API_KEY` | `/api/tribes`, `/api/nudge` |
| `STRIPE_SECRET_KEY` | `/api/stripe/*` |
| `STRIPE_WEBHOOK_SECRET` | `/api/stripe/webhook` |
| `STRIPE_TRIBE_PRICE_ID` | `/api/stripe/checkout` (must be `price_` ID, not `prod_`) |
| `STRIPE_COMMUNITY_PRICE_ID` | `/api/stripe/checkout` (must be `price_` ID, not `prod_`) |
| `NEXT_PUBLIC_APP_URL` | Stripe redirect URLs, nudge email links |
