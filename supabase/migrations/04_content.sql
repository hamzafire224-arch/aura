-- Create content table
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('post', 'reel', 'blog', 'ad', 'email', 'product_desc')),
  platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'youtube', 'blog')),
  
  -- Content
  title TEXT,
  body TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  hashtags TEXT[] DEFAULT '{}',
  
  -- Scheduling
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  -- Analytics
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  clicks INT DEFAULT 0,
  
  -- AI Metadata
  generated_by TEXT CHECK (generated_by IN ('claude', 'gemini', 'manual')),
  generation_prompt TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_business_id ON content(business_id);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_scheduled_for ON content(scheduled_for);

-- RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage content of own businesses" ON content
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM businesses WHERE id = content.business_id
    )
  );
