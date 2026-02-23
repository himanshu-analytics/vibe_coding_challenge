-- TribeTask Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- TABLES
-- =====================

CREATE TABLE IF NOT EXISTS tribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tribe_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tribe_id UUID NOT NULL REFERENCES tribes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#6EE7B7',
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tribe_id, user_id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tribe_id UUID NOT NULL REFERENCES tribes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done', 'skipped')),
  skip_reason TEXT,
  estimated_minutes INTEGER,
  due_date DATE,
  template_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tribe_id UUID NOT NULL REFERENCES tribes(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tribe_id UUID NOT NULL REFERENCES tribes(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'tribe', 'community')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================

CREATE INDEX IF NOT EXISTS idx_tribe_members_user_id ON tribe_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tribe_members_tribe_id ON tribe_members(tribe_id);
CREATE INDEX IF NOT EXISTS idx_tasks_tribe_id ON tasks(tribe_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_nudges_to_user_id ON nudges(to_user_id);
CREATE INDEX IF NOT EXISTS idx_nudges_task_id ON nudges(task_id);

-- =====================
-- UPDATED_AT TRIGGERS
-- =====================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tribes_updated_at BEFORE UPDATE ON tribes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- HELPER FUNCTIONS
-- =====================

CREATE OR REPLACE FUNCTION is_tribe_member(p_tribe_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM tribe_members
    WHERE tribe_id = p_tribe_id AND user_id = p_user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_tribe_owner(p_tribe_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM tribe_members
    WHERE tribe_id = p_tribe_id AND user_id = p_user_id AND role = 'owner'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE tribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribe_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Tribes: members can read; owners can update; anyone can create (insert triggers ownership)
CREATE POLICY "Tribe members can view their tribe"
  ON tribes FOR SELECT
  USING (is_tribe_member(id, auth.uid()));

CREATE POLICY "Tribe owners can update their tribe"
  ON tribes FOR UPDATE
  USING (is_tribe_owner(id, auth.uid()));

CREATE POLICY "Authenticated users can create tribes"
  ON tribes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- Tribe members: members can view their tribe's roster; owners can delete members
CREATE POLICY "Tribe members can view the roster"
  ON tribe_members FOR SELECT
  USING (is_tribe_member(tribe_id, auth.uid()));

CREATE POLICY "Authenticated users can join tribes"
  ON tribe_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tribe owners can remove members"
  ON tribe_members FOR DELETE
  USING (is_tribe_owner(tribe_id, auth.uid()) OR user_id = auth.uid());

-- Tasks: tribe members can CRUD tasks in their tribe; owners can delete any task
CREATE POLICY "Tribe members can view tasks"
  ON tasks FOR SELECT
  USING (is_tribe_member(tribe_id, auth.uid()));

CREATE POLICY "Tribe members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (is_tribe_member(tribe_id, auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Tribe members can update tasks"
  ON tasks FOR UPDATE
  USING (is_tribe_member(tribe_id, auth.uid()));

CREATE POLICY "Owners or creator can delete tasks"
  ON tasks FOR DELETE
  USING (created_by = auth.uid() OR is_tribe_owner(tribe_id, auth.uid()));

-- Nudges: tribe members can view nudges; auth users can insert nudges to others
CREATE POLICY "Users can view their nudges"
  ON nudges FOR SELECT
  USING (to_user_id = auth.uid() OR from_user_id = auth.uid());

CREATE POLICY "Tribe members can send nudges"
  ON nudges FOR INSERT
  WITH CHECK (is_tribe_member(tribe_id, auth.uid()) AND from_user_id = auth.uid());

CREATE POLICY "Users can mark their nudges read"
  ON nudges FOR UPDATE
  USING (to_user_id = auth.uid());

-- Subscriptions: tribe members can read; only system (service role) can write
CREATE POLICY "Tribe members can view subscription"
  ON subscriptions FOR SELECT
  USING (is_tribe_member(tribe_id, auth.uid()));

-- =====================
-- REALTIME
-- =====================

ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE nudges;
