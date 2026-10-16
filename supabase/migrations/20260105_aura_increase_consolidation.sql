-- 20260105_aura_increase_consolidation.sql
-- PURPOSE: Consolidates all schema requirements for Aura Increase (War Room + Builder + Academy)

-- ==============================================================================
-- 1. BUSINESSES TABLE UPDATES (The Core Entity)
-- ==============================================================================

-- Financials & Counters
alter table "public"."businesses" add column if not exists "revenue" numeric default 0;
alter table "public"."businesses" add column if not exists "expenses" numeric default 0;
alter table "public"."businesses" add column if not exists "profit" numeric default 0;
alter table "public"."businesses" add column if not exists "margin" numeric default 0;
alter table "public"."businesses" add column if not exists "orders" numeric default 0;
alter table "public"."businesses" add column if not exists "visitors" numeric default 0;
alter table "public"."businesses" add column if not exists "conversionRate" numeric default 0;
alter table "public"."businesses" add column if not exists "progress" numeric default 0;

-- System Logic & Arrays
alter table "public"."businesses" add column if not exists "branding" jsonb default '{}'::jsonb;
alter table "public"."businesses" add column if not exists "theme_config" jsonb default '{}'::jsonb;
alter table "public"."businesses" add column if not exists "tasks" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "history" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "competitors" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "products" jsonb default '[]'::jsonb;
alter table "public"."businesses" add column if not exists "lastBoardMeeting" timestamp with time zone;

-- Wizard & Configuration
alter table "public"."businesses" add column if not exists "settings" jsonb default '{}'::jsonb;
alter table "public"."businesses" add column if not exists "description" text;
alter table "public"."businesses" add column if not exists "credits_balance" numeric default 10;
alter table "public"."businesses" add column if not exists "tier" text default 'free';
alter table "public"."businesses" add column if not exists "industry" text default 'E-commerce';
alter table "public"."businesses" add column if not exists "type" text default 'dropship';

-- ==============================================================================
-- 2. PRODUCTS TABLE (The "Hands" Output)
-- ==============================================================================
create table if not exists public.products (
    id uuid not null default gen_random_uuid(),
    business_id uuid not null references public.businesses(id) on delete cascade,
    external_id text,
    title text not null,
    description text,
    cost_price decimal(10,2),
    selling_price decimal(10,2),
    images text[],
    supplier_info jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    constraint products_pkey primary key (id)
);

alter table public.products enable row level security;

-- Policies for Products
do $$ begin
    create policy "Users can view own products" on public.products for select using (auth.uid() in (select user_id from public.businesses where id = business_id));
exception when duplicate_object then null; end $$;

do $$ begin
    create policy "Users can insert own products" on public.products for insert with check (auth.uid() in (select user_id from public.businesses where id = business_id));
exception when duplicate_object then null; end $$;


-- ==============================================================================
-- 3. INTEGRATIONS TABLE (Connections)
-- ==============================================================================
create table if not exists public.integrations (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  provider character varying not null,
  credentials jsonb not null default '{}'::jsonb,
  status character varying not null default 'active'::character varying,
  metadata jsonb null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  constraint integrations_pkey primary key (id),
  constraint integrations_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
) tablespace pg_default;

alter table public.integrations enable row level security;

-- Policies for Integrations
do $$ begin
    create policy "Users can view their own integrations" on public.integrations for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
    create policy "Users can manage their own integrations" on public.integrations for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

GRANT ALL ON TABLE public.integrations TO postgres, service_role, authenticated, anon;


-- ==============================================================================
-- 4. LEARNING SYSTEM (The Academy)
-- ==============================================================================
-- Courses
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  slug text unique not null,
  category text,
  level text default 'Beginner',
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Modules
create table if not exists public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Lessons
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  video_url text, -- YouTube embed URL or storage path
  duration integer, -- in seconds
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress
create table if not exists public.user_progress (
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean default false,
  last_position integer default 0, -- resume position in seconds
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, lesson_id)
);

-- Enable RLS for Learning
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;

-- Policies for Learning
do $$ begin
    create policy "Public courses" on public.courses for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
    create policy "Public modules" on public.modules for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
    create policy "Public lessons" on public.lessons for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
    create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
    create policy "Users can update own progress" on public.user_progress for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
    create policy "Users can modify own progress" on public.user_progress for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Seed Data (Sample Course)
-- Only inserting if table is empty to avoid duplicates on re-runs
do $$
begin
    if not exists (select 1 from public.courses where slug = 'aura-mastery') then
        with new_course as (
          insert into public.courses (title, description, slug, category, published, thumbnail_url, level)
          values ('AURA Mastery', 'The complete guide to automating your business.', 'aura-mastery', 'Platform', true, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 'Beginner')
          returning id
        ),
        new_module as (
          insert into public.modules (course_id, title, order_index)
          select id, 'Getting Started', 1 from new_course
          returning id
        )
        insert into public.lessons (module_id, title, video_url, duration, order_index)
        select id, 'Welcome to AURA', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 300, 1 from new_module;
    end if;
end $$;
