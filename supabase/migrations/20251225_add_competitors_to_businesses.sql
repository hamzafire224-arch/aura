-- Migration: Add competitors array to businesses table
-- Description: Support for Orbit Module 14 (Workflow Integration) to track up to 2 competitors per business.

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS competitors TEXT[] DEFAULT '{}';

COMMENT ON COLUMN businesses.competitors IS 'List of competitor URLs (Max 2 enforced by app logic) for Spy integration.';
