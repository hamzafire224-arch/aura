-- 1. Create Courses Table (Safe Mode)
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

-- 2. Create Modules Table (Safe Mode)
create table if not exists public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Lessons Table (Safe Mode)
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  video_url text,
  duration integer,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create User Progress Table (Safe Mode)
create table if not exists public.user_progress (
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean default false,
  last_position integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, lesson_id)
);

-- 5. Enable RLS (Safe to run multiple times)
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;

-- 6. Policies (Drop old ones first to avoid "Already Exists" errors)

-- Courses Policies
drop policy if exists "Public courses" on public.courses;
create policy "Public courses" on public.courses for select using (true);

-- Modules Policies
drop policy if exists "Public modules" on public.modules;
create policy "Public modules" on public.modules for select using (true);

-- Lessons Policies
drop policy if exists "Public lessons" on public.lessons;
create policy "Public lessons" on public.lessons for select using (true);

-- User Progress Policies
drop policy if exists "Users can view own progress" on public.user_progress;
create policy "Users can view own progress" on public.user_progress
  for select using (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can modify own progress" on public.user_progress;
create policy "Users can modify own progress" on public.user_progress
  for update using (auth.uid() = user_id);

-- 7. Seed Data
-- NOTE: I wrapped this in a DO block. It will only insert the course if the "slug" 
-- doesn't exist yet, preventing errors.
DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN
  -- Insert Course if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.courses WHERE slug = 'aura-mastery') THEN
    
    insert into public.courses (title, description, slug, category, published, thumbnail_url, level)
    values ('AURA Mastery', 'The complete guide to automating your business.', 'aura-mastery', 'Platform', true, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 'Beginner')
    returning id into v_course_id;

    -- Insert Module
    insert into public.modules (course_id, title, order_index)
    values (v_course_id, 'Getting Started', 1)
    returning id into v_module_id;

    -- Insert Lesson
    insert into public.lessons (module_id, title, video_url, duration, order_index)
    values (v_module_id, 'Welcome to AURA', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 300, 1);
    
  END IF;
END $$;