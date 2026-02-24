# TribeTask — Demo Guide for Reviewers

> This guide walks an AI reviewer (or human evaluator) through the full end-to-end flow using the live demo account. No email inbox required.

---

## Live App

**URL**: https://tribetask.vercel.app

---

## Step 0: Access the Demo

1. Navigate to **https://tribetask.vercel.app/auth/login**
2. Click **"🎬 Try Demo (no email needed)"**
3. If this is the **first time**, you'll land on **/onboarding** — create a tribe (any name works, e.g. "Review Tribe")
4. Click **"Try Demo"** again — you now land on **/dashboard** with pre-seeded data

> **Why click twice the first time?** The demo bot and tasks are seeded automatically *after* a tribe exists. The second login detects the tribe and injects a second member ("Jamie (Demo)") plus 3 pre-assigned tasks.

---

## What's Pre-Seeded After First Tribe Creation

| Item | Detail |
|------|--------|
| Bot member | **Jamie (Demo)** — purple avatar, tribe member role |
| Task 1 | "Clean the kitchen" — assigned to Jamie |
| Task 2 | "Take out recycling" — assigned to Jamie |
| Task 3 | "Vacuum living room" — assigned to Jamie |

---

## Full Flow Walkthrough

### 1. Dashboard — View Tribe Tasks
- All 3 tasks assigned to Jamie are visible in the **Tribe View**
- You (demo user) appear as the tribe admin

### 2. Create Your Own Task
- Click **"+ New Task"**
- Fill in title, optional description, due date
- Assign to yourself or to **Jamie (Demo)**
- Task appears immediately on the board

### 3. Reassign / Grab a Task
- On any **unassigned** task → click **"Grab"** to self-assign
- Admins (you) can reassign any task using the assignee dropdown on the task card

### 4. Send a Nudge
- On any task **assigned to Jamie (Demo)** → click **"Nudge"**
- Rate limit: 1 nudge per task per hour
- A nudge record is created in the DB (nudge bell in navbar updates)
- Email delivery attempt goes to the bot's internal address (delivery silently fails — that's expected; the API call, DB write, and rate-limit logic are all exercised)

### 5. Mark Nudge as Read
- Click the **bell icon** in the top navigation bar
- Incoming nudges panel slides open
- Click **"Mark all read"** — bell badge clears

### 6. Tribe Settings
- Navigate to **Settings → Tribe Settings**
- Copy the **Invite Code** (this is what a real teammate would use to join)
- Rename the tribe (edit tribe name field)
- Rotate the invite code via the "Regenerate" button

### 7. Upgrade Plan
- Navigate to **Settings → Billing**
- Current plan shown as **Free**
- Click **"Upgrade to Tribe"** ($6/mo) or **"Upgrade to Community"** ($15/mo)
- Redirected to **Stripe Checkout** (use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC)
- After payment → auto-redirected back to Settings with plan updated

> ⚠️ Stripe must be in **Test Mode** on the deployed app for the test card to work. Check with the app owner if the plan doesn't update.

### 8. Sign Out
- Click your avatar / name in the top nav → **"Sign out"**
- Redirected to `/auth/login`

---

## Resetting the Demo

If you want a clean slate (e.g., fresh tribe, fresh tasks):

1. Sign in as demo user → Settings → delete or leave the tribe (if that option is exposed)
2. Or contact the app owner to reset the demo user's tribe membership in Supabase

---

## Known Limitations in Demo Mode

| Limitation | Reason |
|-----------|--------|
| Nudge email doesn't arrive in any inbox | Bot user has an internal-only email address |
| Magic link email flow not testable | By design — use "Try Demo" button instead |
| Stripe webhooks may not fire on free-tier Vercel | Use `/api/stripe/sync` redirect for plan updates (handled automatically on checkout success) |
| Cannot invite a real second member | Use the invite code with a second real account to test this path |
