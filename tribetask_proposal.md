# TribeTask — Full-Stack Build Proposal

## 🎯 Objective
Transition from the landing page to a fully functional full-stack web application. We will build **TribeTask** — a real-time chore and task management platform for families, roommates, and any shared household. The app allows tribe members to assign tasks, grab each other's work, nudge each other, and track shared progress — all updating live without a page refresh.

This class focuses on full-stack engineering: real-time database subscriptions, server-side API routes with rate limiting, and email delivery via Resend.

---

## 🏗️ 1. Architecture Design

The architecture follows a modern, real-time full-stack pattern:

- **Frontend (Next.js 14 App Router + Tailwind + shadcn/ui):** Server and client components for the dashboard, task views, and invite flows. All task mutations reflect instantly via Supabase Realtime.
- **Auth (Supabase Auth):** Magic link (passwordless) email authentication. Session management handled by Supabase SSR helpers.
- **Database (Supabase PostgreSQL + Row Level Security):** All data stored in Supabase. RLS policies enforce that users can only read/write data belonging to their own tribe.
- **Realtime (Supabase Realtime):** Task table subscribed to on the client — any INSERT, UPDATE, or DELETE broadcasts instantly to all tribe members viewing the dashboard.
- **Email (Resend API):** Nudge notifications and weekly tribe summaries delivered via Resend with branded HTML templates.
- **Payments (Stripe):** Optional premium plan unlocking recurring task scheduler, load analytics, and tribe streaks. Manage subscription via Stripe Customer Portal.

---

## ✨ 2. Feature Design

### Core Features to Build:

#### 1. Auth & Tribe Workspace
- Magic link sign-in via Supabase Auth (no passwords)
- `/onboarding` page: user either creates a new tribe (generates a unique 6-character invite code) or joins an existing one via invite code
- Each tribe has a name, invite code, and list of members with display names and avatar colors
- Tribe owner role vs. member role (owners can delete tasks and remove members)
- When a user successfully creates a new tribe, an automated welcome email is sent to their registered email address containing the tribe name, the 6-character invite code, and a pre-filled invite link they can copy and share directly with tribe members

#### 2. Task Management
- Create tasks with: title, description, estimated time (minutes), due date, assigned member
- Task statuses: `pending → in_progress → done → skipped`
- Skip requires a reason (text field shown on skip action)
- Edit and delete tasks (owner only, enforced via RLS)
- **My Tasks View:** Personal dashboard showing tasks assigned to the current user, grouped by Today and This Week
- **Tribe View:** All tribe tasks grouped by member — shows each member as a section with their tasks and current load

#### 3. Real-time Task Grabbing
- In Tribe View, any `pending` task not assigned to the current user shows a **"⚡ Grab"** button
- Clicking Grab reassigns the task to the current user in Supabase — updates broadcast instantly to all open sessions
- Optimistic UI update so the grab feels immediate before server confirms
- Grabbed tasks are moved out of original assignee's list in real time

#### 4. Nudge System
- A **"👋 Nudge"** button appears on tasks in Tribe View that belong to other members
- Nudge sends an email to the assigned member via Resend notifying them of the pending task
- **Rate limit:** Maximum 1 nudge per task per sender per hour (enforced in API route)
- In-app notification bell in the navbar showing unread nudge count
- Notification dropdown listing recent nudges received with task name and sender

#### 5. Load Balancer View
- Visual display per tribe member showing how many tasks they have today and this week
- Simple progress bar or pill indicator per member showing relative load
- Helps tribe members voluntarily redistribute work without conflict

#### 6. Author / Admin Controls
- Tribe owner can: rename the tribe, remove members, regenerate the invite code, and archive the tribe
- All sensitive actions require confirmation dialog
- Settings page at `/settings` for tribe management and template configuration

---

## 🔒 3. Security Design

- All Supabase tables protected by **Row Level Security (RLS)** — users can only access rows where their `user_id` matches a record in `tribe_members` for that `tribe_id`
- All secret keys like Stripe, Resend, Supabase, etc stored in `.env.local` and **never exposed to the frontend**
- Nudge API route validates session server-side before inserting — no unauthenticated nudges possible
- Email bodies sanitized before rendering to prevent XSS injection in notification emails
- Stripe webhook verified using Stripe signature header before processing any subscription events
- Invite codes are randomly generated UUIDs truncated to 6 characters — not guessable

---

## 🗄️ 4. Database Design

All tables managed in Supabase PostgreSQL. RLS enabled on all tables.

### `tribes` Table
Represents a shared household workspace.
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `name` (String)
- `invite_code` (String, Unique, 6 characters)
- `created_by` (UUID, Foreign Key → `auth.users`)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### `tribe_members` Table
Junction table linking users to tribes.
- `id` (UUID, Primary Key)
- `tribe_id` (UUID, Foreign Key → `tribes`)
- `user_id` (UUID, Foreign Key → `auth.users`)
- `display_name` (String)
- `avatar_color` (String, hex code)
- `role` (Enum: `owner`, `member`)
- `joined_at` (DateTime)

### `tasks` Table
Core task records.
- `id` (UUID, Primary Key)
- `tribe_id` (UUID, Foreign Key → `tribes`)
- `title` (String)
- `description` (String, nullable)
- `assigned_to` (UUID, Foreign Key → `auth.users`, nullable)
- `created_by` (UUID, Foreign Key → `auth.users`)
- `status` (Enum: `pending`, `in_progress`, `done`, `skipped`)
- `skip_reason` (String, nullable)
- `estimated_minutes` (Integer, nullable)
- `due_date` (Date, nullable)
- `template_id` (UUID, Foreign Key → `task_templates`, nullable — set if generated by cron)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### `nudges` Table
Tracks nudge events for rate limiting and notification display.
- `id` (UUID, Primary Key)
- `tribe_id` (UUID, Foreign Key → `tribes`)
- `from_user_id` (UUID, Foreign Key → `auth.users`)
- `to_user_id` (UUID, Foreign Key → `auth.users`)
- `task_id` (UUID, Foreign Key → `tasks`)
- `read` (Boolean, default `false`)
- `sent_at` (DateTime)

### `subscriptions` Table
Tracks Stripe subscription state per tribe.
- `id` (UUID, Primary Key)
- `tribe_id` (UUID, Foreign Key → `tribes`)
- `stripe_customer_id` (String)
- `stripe_subscription_id` (String)
- `plan` (Enum: `free`, `tribe`, `community`)
- `status` (Enum: `active`, `canceled`, `past_due`)
- `current_period_end` (DateTime)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## 📧 5. Email Design

Two transactional email templates built with **React Email** and sent via **Resend**.

### Nudge Email
Triggered when a tribe member nudges another. Contains:
- Sender's display name and avatar color
- Task title and description
- Due date if set
- A CTA button: "View Task →" linking to `/dashboard`
- Unsubscribe link in footer

### Tribe Created — Invite Email
Triggered immediately when a new tribe is created. Contains:
- Tribe name and creation date
- The 6-character invite code displayed prominently
- A ready-to-share invite link
- Instructions: "Share this link or code with anyone you want to add to your tribe"
- CTA button: "Go to your dashboard →"

---

## 💳 6. Stripe Pricing Plans
Stripe webhook handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` — all update the `subscriptions` table.

---

## 🚀 7. Deployment

- **Platform:** Vercel (zero-config Next.js deployment)
- **Database:** Supabase (managed PostgreSQL + Auth + Realtime)
- **Email:** Resend (transactional email API)
- **Payments:** Stripe (subscription billing)
- **Domain:** Custom domain configured in Vercel dashboard.
