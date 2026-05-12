-- Migration: 001_create_properties_table.sql
-- Description: Create properties table with RLS policies
-- Date: 2026-05-12
-- Author: PropCheck Phase 2B.1

-- ============================================================================
-- 1. Create properties table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.properties (
    -- Primary key
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign key to auth.users (Supabase auth)
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Property data
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    floorplan_url TEXT,  -- URL to Supabase Storage (Phase 2B.4) or base64 (temporary)
    
    -- Issue counters (denormalized for performance)
    issues_critical INTEGER NOT NULL DEFAULT 0,
    issues_in_progress INTEGER NOT NULL DEFAULT 0,
    issues_resolved INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. Create indexes for performance
-- ============================================================================

-- Index on user_id for fast filtering (most common query)
CREATE INDEX idx_properties_user_id ON public.properties(user_id);

-- Index on created_at for sorting
CREATE INDEX idx_properties_created_at ON public.properties(created_at DESC);

-- ============================================================================
-- 3. Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS Policies
-- ============================================================================

-- Policy: Users can SELECT only their own properties
CREATE POLICY "Users can view their own properties"
    ON public.properties
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can INSERT their own properties
CREATE POLICY "Users can create their own properties"
    ON public.properties
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE only their own properties
CREATE POLICY "Users can update their own properties"
    ON public.properties
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE only their own properties
CREATE POLICY "Users can delete their own properties"
    ON public.properties
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 5. Trigger for automatic updated_at
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on every UPDATE
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 6. Comments (documentation)
-- ============================================================================

COMMENT ON TABLE public.properties IS 'Properties/buildings managed by users. Each property can have multiple issues.';
COMMENT ON COLUMN public.properties.id IS 'Unique property ID (auto-generated)';
COMMENT ON COLUMN public.properties.user_id IS 'Owner of the property (references auth.users)';
COMMENT ON COLUMN public.properties.name IS 'Property name/identifier (e.g., "Apartament Wiśniowa 12/3")';
COMMENT ON COLUMN public.properties.address IS 'Full address (e.g., "ul. Wiśniowa 12/3, Warszawa")';
COMMENT ON COLUMN public.properties.floorplan_url IS 'URL to floorplan image in Supabase Storage or base64 data URI (temporary)';
COMMENT ON COLUMN public.properties.issues_critical IS 'Count of critical issues (denormalized, updated by triggers in Phase 2B.3)';
COMMENT ON COLUMN public.properties.issues_in_progress IS 'Count of in-progress issues (denormalized)';
COMMENT ON COLUMN public.properties.issues_resolved IS 'Count of resolved issues (denormalized)';
COMMENT ON COLUMN public.properties.created_at IS 'Timestamp when property was created';
COMMENT ON COLUMN public.properties.updated_at IS 'Timestamp of last update (auto-updated by trigger)';

-- ============================================================================
-- 7. Grant permissions (public schema)
-- ============================================================================

-- Revoke all permissions from public role (security)
REVOKE ALL ON public.properties FROM PUBLIC;

-- Grant authenticated users ability to use the table (RLS enforces per-user access)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.properties_id_seq TO authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
