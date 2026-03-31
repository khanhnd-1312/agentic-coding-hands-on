-- Master data for Sun* Kudos Live Board
-- This seed runs in ALL environments (dev + production).
-- Only contains reference/config data that must exist before the app is usable.

-- ─── Departments ───────────────────────────────────────────────────────
INSERT INTO departments (id, name) VALUES
  ('dd000001-0000-0000-0000-000000000001', 'Engineering'),
  ('dd000001-0000-0000-0000-000000000002', 'Design'),
  ('dd000001-0000-0000-0000-000000000003', 'Product'),
  ('dd000001-0000-0000-0000-000000000004', 'Marketing'),
  ('dd000001-0000-0000-0000-000000000005', 'HR & Admin'),
  ('dd000001-0000-0000-0000-000000000006', 'QA'),
  ('dd000001-0000-0000-0000-000000000007', 'DevOps'),
  ('dd000001-0000-0000-0000-000000000008', 'Sales')
ON CONFLICT (id) DO NOTHING;

-- ─── Hashtags ──────────────────────────────────────────────────────────
INSERT INTO hashtags (id, name) VALUES
  ('bb000001-0000-0000-0000-000000000001', '#teamwork'),
  ('bb000001-0000-0000-0000-000000000002', '#innovation'),
  ('bb000001-0000-0000-0000-000000000003', '#leadership'),
  ('bb000001-0000-0000-0000-000000000004', '#quality'),
  ('bb000001-0000-0000-0000-000000000005', '#dedication'),
  ('bb000001-0000-0000-0000-000000000006', '#creativity'),
  ('bb000001-0000-0000-0000-000000000007', '#mentorship'),
  ('bb000001-0000-0000-0000-000000000008', '#customer-first'),
  ('bb000001-0000-0000-0000-000000000009', '#growth-mindset'),
  ('bb000001-0000-0000-0000-000000000010', '#sun-spirit')
ON CONFLICT (id) DO NOTHING;
