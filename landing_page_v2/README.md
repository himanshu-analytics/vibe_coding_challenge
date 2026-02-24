# TribeTask

A household chore management SaaS — built with Next.js 16, Supabase, Stripe, and Resend.

---

## 🎬 Demo Walkthrough

A full end-to-end flow from tribe creation to plan upgrade:

### 1. Sign Up / Log In
- Visit the app and enter your email on the login page.
- Click the magic link in your inbox.
- First-time users land on **Onboarding**.

### 2. Create a Tribe
- On Onboarding, choose **"Create a new tribe"**, enter a tribe name, and submit.
- You're now the tribe admin and land on the **Dashboard**.
- A welcome email is sent to your inbox via Resend.

### 3. Invite a Teammate
- Go to **Settings → Tribe Settings**.
- Copy the **Invite Code**.
- Share it with a teammate — they sign up, choose **"Join a tribe"** on Onboarding, and enter the code.

### 4. Add Tasks
- On the Dashboard, click **"+ New Task"**.
- Fill in the task title, optional description, due date, and assign it to a tribe member.
- The task appears in the **Tribe View** board for all members.

### 5. Reassign / Grab a Task
- Any member can click **"Grab"** on an unassigned task to self-assign it.
- Admins can reassign tasks using the assignee dropdown on any task card.

### 6. Send a Nudge
- On a task assigned to someone else, click **"Nudge"**.
- The assignee receives an email notification (rate-limited to 1 nudge per task per hour).
- A nudge badge appears in the top nav when you have unread nudges.

### 7. Mark Nudge as Read
- Click the nudge bell icon in the navbar.
- View incoming nudges and click **"Mark all read"** to clear the badge.

### 8. Upgrade Your Plan
- Go to **Settings → Billing**.
- Click **"Upgrade to Tribe"** ($6/mo) or **"Upgrade to Community"** ($15/mo).
- You're redirected to Stripe Checkout — complete payment.
- On success, your plan updates automatically in the Settings page.

---

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

# Optional: Demo mode (no email needed for login)
NEXT_PUBLIC_DEMO_MODE=true
DEMO_USER_EMAIL=demo@yourdomain.com
DEMO_USER_PASSWORD=your-demo-password
```

### Demo Mode Setup

When `NEXT_PUBLIC_DEMO_MODE=true`, a **"🎬 Try Demo"** button appears on the login page — reviewers can access the full app without needing a real email inbox.

**One-time Supabase setup:**
1. In Supabase Dashboard → **Authentication → Users**, click **"Add user"**
2. Enter `DEMO_USER_EMAIL` + `DEMO_USER_PASSWORD` (use a strong password)
3. Under **Authentication → Providers**, ensure **Email** provider has **"Confirm email"** disabled (or confirm the user manually)
4. Optionally pre-seed the demo user with a tribe so they land on `/dashboard` instead of `/onboarding`

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
