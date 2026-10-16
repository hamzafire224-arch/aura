-- Comprehensive Financial Schema Fix
-- Adds ALL missing columns identified in BusinessContext.tsx to prevent future errors.

-- 1. Financial Core
alter table "public"."businesses" add column if not exists "expenses" numeric default 0;
alter table "public"."businesses" add column if not exists "profit" numeric default 0;
alter table "public"."businesses" add column if not exists "margin" numeric default 0;

-- 2. Traffic & Conversion
alter table "public"."businesses" add column if not exists "visitors" numeric default 0;
-- conversionRate was added in previous step, but included here for completeness (idempotent)
alter table "public"."businesses" add column if not exists "conversionRate" numeric default 0;

-- 3. Progress & Status
alter table "public"."businesses" add column if not exists "progress" numeric default 0;
alter table "public"."businesses" add column if not exists "lastBoardMeeting" timestamp with time zone;

-- 4. Arrays (JSONB is safer for arrays in Supabase if not using native array types)
alter table "public"."businesses" add column if not exists "tasks" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "history" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "competitors" jsonb default '[]'::jsonb;
