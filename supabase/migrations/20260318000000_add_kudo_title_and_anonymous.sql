-- Migration: add title, is_anonymous to kudos; content TEXT→JSONB; search index; hashtag policy; storage bucket

-- ─── Kudos table changes ──────────────────────────────────────────
ALTER TABLE kudos ADD COLUMN title VARCHAR(50) NOT NULL DEFAULT '';
ALTER TABLE kudos ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;

-- Change content column to JSONB for Tiptap JSON storage
-- Existing plain-text content is migrated to a Tiptap-compatible JSON wrapper
ALTER TABLE kudos ALTER COLUMN content TYPE JSONB USING
  jsonb_build_object('type', 'doc', 'content',
    jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content',
      jsonb_build_array(jsonb_build_object('type', 'text', 'text', content))
    ))
  );

-- ─── Index for user search by name ────────────────────────────────
CREATE INDEX idx_profiles_name_search ON profiles (lower(name) text_pattern_ops);

-- ─── Allow authenticated users to insert hashtags ─────────────────
CREATE POLICY "Authenticated users can create hashtags"
  ON hashtags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ─── Supabase Storage bucket for kudo images ──────────────────────
INSERT INTO storage.buckets (id, name, public)
  VALUES ('kudo-images', 'kudo-images', true);

CREATE POLICY "Anyone can upload kudo images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'kudo-images');

CREATE POLICY "Public read kudo images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'kudo-images');
