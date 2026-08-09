-- spy_auth_migration.sql
-- Run this in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION check_email_exists(lookup_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE email = lookup_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
