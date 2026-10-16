-- Create businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  industry TEXT,
  target_audience TEXT,
  
  -- Branding
  brand_name TEXT,
  tagline TEXT,
  mission_statement TEXT,
  logo_url TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  color_accent TEXT,
  
  -- Store Integration
  store_platform TEXT CHECK (store_platform IN ('shopify', 'woocommerce', 'custom')),
  store_url TEXT,
  store_access_token TEXT,
  
  -- Settings
  ai_provider TEXT DEFAULT 'claude' CHECK (ai_provider IN ('claude', 'gemini', 'auto')),
  tone_of_voice TEXT DEFAULT 'professional',
  
  -- Stats
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_orders INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);

-- RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own businesses" ON businesses
  FOR ALL USING (auth.uid() = user_id);
