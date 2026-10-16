-- Create analytics_daily table
CREATE TABLE analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  -- Metrics
  revenue DECIMAL(12,2) DEFAULT 0,
  orders INT DEFAULT 0,
  visitors INT DEFAULT 0,
  page_views INT DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  
  -- Traffic Sources
  traffic_direct INT DEFAULT 0,
  traffic_social INT DEFAULT 0,
  traffic_organic INT DEFAULT 0,
  traffic_paid INT DEFAULT 0,
  traffic_referral INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(business_id, date)
);

CREATE INDEX idx_analytics_business_date ON analytics_daily(business_id, date DESC);

-- RLS
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics of own businesses" ON analytics_daily
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM businesses WHERE id = analytics_daily.business_id
    )
  );
