-- Migration: Create Workflows Table
-- Description: Independent Strategy Containers (Orbit Module 14.5)

CREATE TABLE IF NOT EXISTS workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT DEFAULT 'New Operation',
  index INTEGER DEFAULT 0,
  business_id UUID REFERENCES businesses(id),
  competitors JSONB[] DEFAULT '{}', -- Stores full Spy Dossier objects, UI shows only domain
  focus TEXT DEFAULT 'Growth', -- Strategic Focus
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workflows" ON workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workflows" ON workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows" ON workflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows" ON workflows
  FOR DELETE USING (auth.uid() = user_id);
