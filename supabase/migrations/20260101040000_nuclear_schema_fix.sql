-- ⚠️ THE NUCLEAR FIX (Run this once to fix ALL missing columns)
-- TRUTH SOURCE: Adds ALL missing columns for the Autonomous Dashboard
-- Run this ONCE to fix all "Could not find column" errors.

-- 1. Financials & Counters
alter table "public"."businesses" add column if not exists "revenue" numeric default 0;
alter table "public"."businesses" add column if not exists "expenses" numeric default 0;
alter table "public"."businesses" add column if not exists "profit" numeric default 0;
alter table "public"."businesses" add column if not exists "margin" numeric default 0;
alter table "public"."businesses" add column if not exists "orders" numeric default 0;
alter table "public"."businesses" add column if not exists "visitors" numeric default 0;
alter table "public"."businesses" add column if not exists "conversionRate" numeric default 0;
alter table "public"."businesses" add column if not exists "progress" numeric default 0;

-- 2. System Logic & Arrays
alter table "public"."businesses" add column if not exists "branding" jsonb default '{}'::jsonb;
alter table "public"."businesses" add column if not exists "theme_config" jsonb default '{}'::jsonb;
alter table "public"."businesses" add column if not exists "tasks" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "history" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "competitors" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "products" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "lastBoardMeeting" timestamp with time zone;

-- 3. Wizard & Configuration (The Culprits)
alter table "public"."businesses" add column if not exists "settings" jsonb default '{}'::jsonb;
alter table "public"."businesses" add column if not exists "description" text;
alter table "public"."businesses" add column if not exists "credits_balance" numeric default 10;
alter table "public"."businesses" add column if not exists "tier" text default 'free';
alter table "public"."businesses" add column if not exists "industry" text default 'E-commerce';
alter table "public"."businesses" add column if not exists "type" text default 'dropship';
