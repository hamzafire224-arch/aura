-- Fix Legacy Constraints on Workflows Table
-- The 2024 version of the table had 'name' as NOT NULL.
-- The 2025 version uses 'title'. We need to make 'name' optional to allow inserts that only provide 'title'.

ALTER TABLE workflows ALTER COLUMN name DROP NOT NULL;

-- Also ensure description is nullable just in case
ALTER TABLE workflows ALTER COLUMN description DROP NOT NULL;
