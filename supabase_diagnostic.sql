-- ═══════════════════════════════════════════
-- QUERY 1 of 5 — What tables exist?
-- ═══════════════════════════════════════════
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


-- ═══════════════════════════════════════════
-- QUERY 2 of 5 — What columns does leads have?
-- ═══════════════════════════════════════════
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;


-- ═══════════════════════════════════════════
-- QUERY 3 of 5 — Is RLS enabled on each table?
-- ═══════════════════════════════════════════
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';


-- ═══════════════════════════════════════════
-- QUERY 4 of 5 — What RLS policies exist?
-- ═══════════════════════════════════════════
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;


-- ═══════════════════════════════════════════
-- QUERY 5 of 5 — What functions and types exist?
-- ═══════════════════════════════════════════
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';
SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
