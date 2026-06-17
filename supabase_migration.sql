-- ═════════════════════════════════════════════════════════════════════════════
-- Saeed Furniture: Safe Migration Script
-- Run this in Supabase SQL Editor.
-- Every statement is idempotent — safe to run even if parts already exist.
-- ═════════════════════════════════════════════════════════════════════════════


-- ─── STEP 1: Create app_role enum (skip if already exists) ───────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('client', 'admin');
  END IF;
END$$;


-- ─── STEP 2: Create profiles table (skip if already exists) ─────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id        uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role      public.app_role DEFAULT 'client'::public.app_role NOT NULL,
    full_name text,
    phone     text,
    created_at timestamp with time zone DEFAULT now()
);


-- ─── STEP 3: Add user_id column to existing leads table (safe) ──────────────
-- Links a lead to an authenticated Supabase Auth user.
-- Guests remain NULL — this is intentional.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;


-- ─── STEP 4: Enable RLS on profiles (leads already has it) ──────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- ─── STEP 5: Drop and recreate all RLS policies (safe — drops first) ─────────

-- Leads policies
DROP POLICY IF EXISTS "Clients can view own leads"   ON public.leads;
DROP POLICY IF EXISTS "Clients can insert own leads"  ON public.leads;
DROP POLICY IF EXISTS "Clients can update own leads"  ON public.leads;
DROP POLICY IF EXISTS "Admins have full access"       ON public.leads;

CREATE POLICY "Clients can view own leads"
    ON public.leads FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Clients can insert own leads"
    ON public.leads FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Clients can update own leads"
    ON public.leads FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Admins have full access"
    ON public.leads FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"    ON public.profiles;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING ( auth.uid() = id );

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- ─── STEP 6: Auto-create profile on user signup ──────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'client'
  )
  ON CONFLICT (id) DO NOTHING; -- Safe if profile already exists
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ─── STEP 7: Stats RPC (CREATE OR REPLACE is always safe) ────────────────────
CREATE OR REPLACE FUNCTION public.get_leads_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_leads       int;
  final_submissions int;
  with_phone        int;
  new_count         int;
  is_admin          boolean;
BEGIN
  -- Enforce admin-only access
  SELECT (role = 'admin') INTO is_admin
  FROM public.profiles WHERE id = auth.uid();

  IF NOT COALESCE(is_admin, false) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  SELECT count(*) INTO total_leads       FROM public.leads;
  SELECT count(*) INTO final_submissions FROM public.leads WHERE status = 'final';
  SELECT count(*) INTO with_phone        FROM public.leads WHERE phone != '';
  SELECT count(*) INTO new_count         FROM public.leads WHERE lead_status = 'new';

  RETURN json_build_object(
    'total',       total_leads,
    'final_count', final_submissions,
    'with_phone',  with_phone,
    'new_count',   new_count
  );
END;
$$;


-- ─── STEP 8: Verify everything is in place ───────────────────────────────────
-- Run this after the script completes to confirm success.
SELECT
  (SELECT count(*) FROM information_schema.tables      WHERE table_schema='public' AND table_name='profiles')   AS profiles_table,
  (SELECT count(*) FROM information_schema.columns     WHERE table_schema='public' AND table_name='leads' AND column_name='user_id') AS user_id_col,
  (SELECT count(*) FROM pg_policies                    WHERE schemaname='public')                               AS total_policies,
  (SELECT count(*) FROM information_schema.routines    WHERE routine_schema='public' AND routine_name='get_leads_stats') AS stats_rpc,
  (SELECT rowsecurity FROM pg_tables                   WHERE schemaname='public' AND tablename='leads')         AS leads_rls,
  (SELECT rowsecurity FROM pg_tables                   WHERE schemaname='public' AND tablename='profiles')      AS profiles_rls;
