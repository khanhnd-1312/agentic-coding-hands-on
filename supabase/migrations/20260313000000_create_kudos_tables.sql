-- Kudos Live Board tables
-- Migration: 20260313000000_create_kudos_tables

-- ─── Departments (if not exists) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

-- ─── Profiles (extends Supabase Auth users) ─────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  department_id UUID REFERENCES departments(id),
  kudos_received_count INT NOT NULL DEFAULT 0,
  tim_points INT NOT NULL DEFAULT 0,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ─── Hashtags ───────────────────────────────────────────────────────
CREATE TABLE hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read hashtags"
  ON hashtags FOR SELECT
  TO authenticated
  USING (true);

-- ─── Kudos ──────────────────────────────────────────────────────────
CREATE TABLE kudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  heart_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sender_not_receiver CHECK (sender_id <> receiver_id)
);

CREATE INDEX idx_kudos_created_at ON kudos(created_at DESC);
CREATE INDEX idx_kudos_heart_count ON kudos(heart_count DESC);
CREATE INDEX idx_kudos_sender_id ON kudos(sender_id);
CREATE INDEX idx_kudos_receiver_id ON kudos(receiver_id);

ALTER TABLE kudos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read kudos"
  ON kudos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create kudos"
  ON kudos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- ─── Kudos–Hashtags join table ──────────────────────────────────────
CREATE TABLE kudos_hashtags (
  kudos_id UUID NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  hashtag_id UUID NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (kudos_id, hashtag_id)
);

ALTER TABLE kudos_hashtags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read kudos_hashtags"
  ON kudos_hashtags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kudos sender can add hashtags"
  ON kudos_hashtags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kudos WHERE kudos.id = kudos_id AND kudos.sender_id = auth.uid()
    )
  );

-- ─── Hearts (likes) ────────────────────────────────────────────────
CREATE TABLE kudos_hearts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  kudos_id UUID NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  is_special_day BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_heart UNIQUE (user_id, kudos_id)
);

CREATE INDEX idx_kudos_hearts_kudos_id ON kudos_hearts(kudos_id);
CREATE INDEX idx_kudos_hearts_user_id ON kudos_hearts(user_id);

ALTER TABLE kudos_hearts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read hearts"
  ON kudos_hearts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own hearts"
  ON kudos_hearts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hearts"
  ON kudos_hearts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── Secret Boxes ───────────────────────────────────────────────────
CREATE TABLE secret_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  is_opened BOOLEAN NOT NULL DEFAULT false,
  reward_content TEXT,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_secret_boxes_user_id ON secret_boxes(user_id);

ALTER TABLE secret_boxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own secret boxes"
  ON secret_boxes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own secret boxes"
  ON secret_boxes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── Special Days ───────────────────────────────────────────────────
CREATE TABLE special_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  multiplier INT NOT NULL DEFAULT 2 CHECK (multiplier >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE special_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read special days"
  ON special_days FOR SELECT
  TO authenticated
  USING (true);
