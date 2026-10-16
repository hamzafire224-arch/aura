-- Create affiliates table
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Stats
  total_referrals INT DEFAULT 0,
  successful_conversions INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  paid_earnings DECIMAL(10,2) DEFAULT 0,
  
  -- Payment Info
  payment_method TEXT CHECK (payment_method IN ('bank', 'paypal', 'wise')),
  payment_details JSONB,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own affiliate data" ON affiliates
  FOR ALL USING (auth.uid() = user_id);

-- Create referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Tracking
  referral_code TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  
  -- Commission
  subscription_plan TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 40.00,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'paid', 'cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);

-- RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own referrals" ON referrals
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM affiliates WHERE id = referrals.affiliate_id
    )
  );
