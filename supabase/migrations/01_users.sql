-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  subscription_id TEXT,
  subscription_status TEXT,
  credits_remaining INT DEFAULT 10,
  credits_reset_date TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 month',
  stripe_customer_id TEXT,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  affiliate_enabled BOOLEAN DEFAULT false,
  affiliate_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
