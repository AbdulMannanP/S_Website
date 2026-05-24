-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase Schema for Saeed Furniture Leads
-- Execute this script in the Supabase SQL Editor to provision the leads CRM table.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.leads (
    -- ── Identity ────────────────────────────────────────────────────────────
    order_id text PRIMARY KEY,
    session_id text NOT NULL,

    -- ── Customer Info ───────────────────────────────────────────────────────
    name text DEFAULT '',
    phone text DEFAULT '',
    district_city text DEFAULT '',

    -- ── Journey Selections ──────────────────────────────────────────────────
    selected_model_id text DEFAULT '',
    visit_mode text DEFAULT '',
    preferred_contact_time text DEFAULT '',
    room_size_known boolean DEFAULT false,
    room_length numeric DEFAULT NULL,
    room_width numeric DEFAULT NULL,
    color_preference text DEFAULT '',
    material_preference text DEFAULT '',
    photo_urls jsonb DEFAULT '[]'::jsonb,
    vision_notes text DEFAULT '',

    -- ── Journey Tracking ────────────────────────────────────────────────────
    last_step text DEFAULT 'hero',
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'final')),
    score integer DEFAULT 0,
    time_spent integer DEFAULT 0,

    -- ── Attribution ─────────────────────────────────────────────────────────
    source text DEFAULT 'website',
    user_agent text DEFAULT '',
    referrer text DEFAULT '',
    ip text DEFAULT '',

    -- ── Bot Protection ──────────────────────────────────────────────────────
    company_name text DEFAULT '',

    -- ── CRM Fields (sales team use) ─────────────────────────────────────────
    lead_status text DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'lost', 'won')),
    sales_notes text DEFAULT '',
    contacted_at timestamp with time zone DEFAULT NULL,
    home_visit_completed boolean DEFAULT false,
    assigned_to text DEFAULT NULL,
    email text DEFAULT NULL,

    -- ── Timestamps ──────────────────────────────────────────────────────────
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ── Indexes for Performance ────────────────────────────────────────────────
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_lead_status ON public.leads(lead_status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_phone ON public.leads(phone);

-- ── Trigger for automatic updated_at ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ── RPC for Dashboard Stats ───────────────────────────────────────────────
-- This function computes dashboard stats in a single network request.
CREATE OR REPLACE FUNCTION get_leads_stats()
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  total_leads int;
  final_submissions int;
  with_phone int;
  new_count int;
BEGIN
  SELECT count(*) INTO total_leads FROM public.leads;
  SELECT count(*) INTO final_submissions FROM public.leads WHERE status = 'final';
  SELECT count(*) INTO with_phone FROM public.leads WHERE phone != '';
  SELECT count(*) INTO new_count FROM public.leads WHERE lead_status = 'new';
  
  RETURN json_build_object(
    'total', total_leads,
    'final_count', final_submissions,
    'with_phone', with_phone,
    'new_count', new_count
  );
END;
$$;
