-- Add status column to workflows table
ALTER TABLE workflows 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'planning';

-- Update RLS if needed (existing policy should cover updates)
-- Optional: Add check constraint for valid statuses
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'workflows_status_check'
    ) THEN
        ALTER TABLE workflows 
        ADD CONSTRAINT workflows_status_check 
        CHECK (status IN ('planning', 'active', 'review'));
    END IF;
END $$;
