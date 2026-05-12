-- Migration: 002_create_issues_table.sql
-- Description: Create issues table with RLS policies
-- Date: 2026-05-12
-- Author: PropCheck Phase 2B.3

-- ============================================================================
-- 1. Create issues table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.issues (
    -- Primary key
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign keys
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id BIGINT NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    
    -- Issue data
    name TEXT NOT NULL,
    location TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'inProgress' CHECK (status IN ('critical', 'inProgress', 'resolved')),
    
    -- Pin position on floorplan (JSON: {x: number, y: number})
    pin_position JSONB,
    -- Możesz dodać to pod kolumną pin_position
    photos JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. Create indexes for performance
-- ============================================================================

-- Index on user_id for fast filtering
CREATE INDEX idx_issues_user_id ON public.issues(user_id);

-- Index on property_id for fast filtering by property
CREATE INDEX idx_issues_property_id ON public.issues(property_id);

-- Composite index for common query: user + property
CREATE INDEX idx_issues_user_property ON public.issues(user_id, property_id);

-- Index on status for filtering by status
CREATE INDEX idx_issues_status ON public.issues(status);

-- Index on created_at for sorting
CREATE INDEX idx_issues_created_at ON public.issues(created_at DESC);

-- ============================================================================
-- 3. Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS Policies
-- ============================================================================

-- Policy: Users can SELECT only issues for their properties
CREATE POLICY "Users can view issues for their properties"
    ON public.issues
    FOR SELECT
    USING (
        user_id = auth.uid() 
        AND property_id IN (
            SELECT id FROM public.properties WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can INSERT issues only to their properties
CREATE POLICY "Users can create issues in their properties"
    ON public.issues
    FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND property_id IN (
            SELECT id FROM public.properties WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can UPDATE only their issues
CREATE POLICY "Users can update their issues"
    ON public.issues
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Policy: Users can DELETE only their issues
CREATE POLICY "Users can delete their issues"
    ON public.issues
    FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- 5. Trigger for automatic updated_at
-- ============================================================================

CREATE TRIGGER update_issues_updated_at
    BEFORE UPDATE ON public.issues
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 6. Trigger to update property issue counts
-- ============================================================================

-- Function to update property issue counters
CREATE OR REPLACE FUNCTION public.update_property_issue_counts()
RETURNS trigger AS $$
DECLARE
    prop_id BIGINT;
BEGIN
    -- Ustalenie property_id na podstawie typu operacji
    IF TG_OP = 'DELETE' THEN
        prop_id := OLD.property_id;
    ELSE
        prop_id := NEW.property_id;
    END IF;

    UPDATE public.properties
    SET 
        issues_critical = (SELECT COUNT(*) FROM public.issues WHERE property_id = prop_id AND status = 'critical'),
        issues_in_progress = (SELECT COUNT(*) FROM public.issues WHERE property_id = prop_id AND status = 'inProgress'),
        issues_resolved = (SELECT COUNT(*) FROM public.issues WHERE property_id = prop_id AND status = 'resolved')
    WHERE id = prop_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update property counts on INSERT
CREATE TRIGGER update_property_counts_on_issue_insert
    AFTER INSERT ON public.issues
    FOR EACH ROW
    EXECUTE FUNCTION public.update_property_issue_counts();

-- Trigger: Update property counts on UPDATE
CREATE TRIGGER update_property_counts_on_issue_update
    AFTER UPDATE ON public.issues
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_property_issue_counts();

-- Trigger: Update property counts on DELETE
CREATE TRIGGER update_property_counts_on_issue_delete
    AFTER DELETE ON public.issues
    FOR EACH ROW
    EXECUTE FUNCTION public.update_property_issue_counts();

-- ============================================================================
-- 7. Comments (documentation)
-- ============================================================================

COMMENT ON TABLE public.issues IS 'Issues/defects reported for properties. Each issue belongs to one property.';
COMMENT ON COLUMN public.issues.id IS 'Unique issue ID (auto-generated)';
COMMENT ON COLUMN public.issues.user_id IS 'Owner of the issue (references auth.users)';
COMMENT ON COLUMN public.issues.property_id IS 'Property this issue belongs to (references properties)';
COMMENT ON COLUMN public.issues.name IS 'Issue name/title (e.g., "Cieknący kran")';
COMMENT ON COLUMN public.issues.location IS 'Location within property (e.g., "Łazienka")';
COMMENT ON COLUMN public.issues.description IS 'Detailed description of the issue';
COMMENT ON COLUMN public.issues.status IS 'Status: critical, inProgress, or resolved';
COMMENT ON COLUMN public.issues.pin_position IS 'Position on floorplan map {x: 0-100, y: 0-100}';
COMMENT ON COLUMN public.issues.created_at IS 'Timestamp when issue was created';
COMMENT ON COLUMN public.issues.updated_at IS 'Timestamp of last update (auto-updated by trigger)';

-- ============================================================================
-- 8. Grant permissions
-- ============================================================================

REVOKE ALL ON public.issues FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.issues_id_seq TO authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
