-- Fix Workflows Table Schema (Legacy vs New Conflict)
-- Handles the case where the table exists from 2024 but is missing new 2025 columns

-- 1. Ensure new columns exist
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'New Operation';
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS index INTEGER DEFAULT 0;
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS competitors JSONB[] DEFAULT '{}';
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS focus TEXT DEFAULT 'Growth';

-- 2. Update Status Constraint to match new UI
-- First drop existing constraint if it exists (to avoid conflicts with 'draft', 'running' etc)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workflows_status_check') THEN
        ALTER TABLE workflows DROP CONSTRAINT workflows_status_check;
    END IF;
    
    -- Also drop the one from the legacy table definition if it was named differently (usually it's implicit or named workflows_status_check)
    -- We can try to alter the column type if needed, but text is fine.
END $$;

-- Add the new constraint
ALTER TABLE workflows 
ADD CONSTRAINT workflows_status_check 
CHECK (status IN ('planning', 'active', 'review'));

-- 3. Data Migration (Optional: valid for new rows, but helpful for old ones)
-- Set title = name if title is null and name exists? (Postgres doesn't support IF EXISTS on column in update easily without dynamic SQL, skipping for safety)
