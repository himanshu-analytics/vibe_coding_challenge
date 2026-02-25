# TribeTask

A household chore management SaaS — built with Next.js 16, Supabase, Stripe, and Resend.

## Demo - Loom Video link
[Demo Video](https://www.loom.com/share/90c17419e9594f169c7c8605d96050a7)

## Local Development

```bash
cd landing_page_v2
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Required Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_TRIBE_PRICE_ID=        # Must be price_xxx, not prod_xxx
STRIPE_COMMUNITY_PRICE_ID=    # Must be price_xxx, not prod_xxx

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Route Index

See [`routes.md`](./routes.md) for a full map of all public, protected, and API routes.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Auth + DB | Supabase (magic link, RLS) |
| Email | Resend + React Email |
| Payments | Stripe Checkout |
| Styling | Tailwind CSS v4 |
| Hosting | Vercel |
