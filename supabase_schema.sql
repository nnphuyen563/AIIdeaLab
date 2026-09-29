-- ==============================================================================
-- SUPABASE SCHEMA FOR AI IDEA LAB (POCTYPE & STITCH CANVAS STUDIO)
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/pdvnclyhfvvejhcoalcq/sql
-- 2. Go to the "SQL Editor" in the left sidebar
-- 3. Click "+ New query"
-- 4. Paste the SQL statements below and click "Run" (or Ctrl + Enter)
-- 5. Return to the "Table Editor" — the table "user_designs" will appear immediately!
-- ==============================================================================

-- 1. Create table for user designs & interactive canvas prototypes
CREATE TABLE IF NOT EXISTS public.user_designs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  design_md TEXT,
  design_system JSONB DEFAULT '{}'::jsonb,
  preset_id TEXT DEFAULT 'alexandria',
  screens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at BIGINT,
  updated_at BIGINT
);

-- 2. Performance indexes for fast querying by user and recency
CREATE INDEX IF NOT EXISTS idx_user_designs_user_id ON public.user_designs (user_id);
CREATE INDEX IF NOT EXISTS idx_user_designs_updated_at ON public.user_designs (updated_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_designs ENABLE ROW LEVEL SECURITY;

-- 4. Permissive policy for read/write access using the project's publishable / secret keys
DROP POLICY IF EXISTS "Allow full access to user_designs" ON public.user_designs;
CREATE POLICY "Allow full access to user_designs"
ON public.user_designs
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. (Optional) User profiles table for custom lockers & handles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  email TEXT,
  created_at BIGINT
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full access to user_profiles" ON public.user_profiles;
CREATE POLICY "Allow full access to user_profiles"
ON public.user_profiles
FOR ALL
USING (true)
WITH CHECK (true);

-- Confirmation query to verify tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public';
