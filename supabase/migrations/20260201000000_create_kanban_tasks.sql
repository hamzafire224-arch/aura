-- ==============================================================================
-- PHASE 1: THE KANBAN & AGENT EXECUTION ENGINE
-- Migration: Create kanban_tasks table with atomic RLS and real-time streaming
-- ==============================================================================

-- 1. Create kanban_tasks Table
CREATE TABLE IF NOT EXISTS public.kanban_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'failed')),
    agent_type TEXT NOT NULL DEFAULT 'general_agent',
    intent TEXT,
    prompt_payload TEXT,
    credits_cost NUMERIC NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_business_id 
    ON public.kanban_tasks(business_id);

CREATE INDEX IF NOT EXISTS idx_kanban_tasks_business_status 
    ON public.kanban_tasks(business_id, status);

CREATE INDEX IF NOT EXISTS idx_kanban_tasks_created_at 
    ON public.kanban_tasks(created_at DESC);

-- 3. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_kanban_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_kanban_tasks_updated_at ON public.kanban_tasks;
CREATE TRIGGER tr_kanban_tasks_updated_at
BEFORE UPDATE ON public.kanban_tasks
FOR EACH ROW
EXECUTE FUNCTION public.handle_kanban_tasks_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.kanban_tasks ENABLE ROW LEVEL SECURITY;

-- 5. Strict Tenant Ownership Policies (CRUD)
-- Only business owners can SELECT tasks
DROP POLICY IF EXISTS "Users can view tasks for owned businesses" ON public.kanban_tasks;
CREATE POLICY "Users can view tasks for owned businesses"
ON public.kanban_tasks
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.businesses
        WHERE businesses.id = kanban_tasks.business_id
        AND businesses.user_id = auth.uid()
    )
);

-- Only business owners can INSERT tasks
DROP POLICY IF EXISTS "Users can create tasks for owned businesses" ON public.kanban_tasks;
CREATE POLICY "Users can create tasks for owned businesses"
ON public.kanban_tasks
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.businesses
        WHERE businesses.id = kanban_tasks.business_id
        AND businesses.user_id = auth.uid()
    )
);

-- Only business owners can UPDATE tasks
DROP POLICY IF EXISTS "Users can update tasks for owned businesses" ON public.kanban_tasks;
CREATE POLICY "Users can update tasks for owned businesses"
ON public.kanban_tasks
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.businesses
        WHERE businesses.id = kanban_tasks.business_id
        AND businesses.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.businesses
        WHERE businesses.id = kanban_tasks.business_id
        AND businesses.user_id = auth.uid()
    )
);

-- Only business owners can DELETE tasks
DROP POLICY IF EXISTS "Users can delete tasks for owned businesses" ON public.kanban_tasks;
CREATE POLICY "Users can delete tasks for owned businesses"
ON public.kanban_tasks
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.businesses
        WHERE businesses.id = kanban_tasks.business_id
        AND businesses.user_id = auth.uid()
    )
);

-- 6. Configure Realtime Replication & Full Row Replica Identity
ALTER TABLE public.kanban_tasks REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'kanban_tasks'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.kanban_tasks;
    END IF;
END $$;
