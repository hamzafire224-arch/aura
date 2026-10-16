-- REPAIR: Drop old versions of these tables to ensure distinct creation
DROP TABLE IF EXISTS public.payouts;
DROP TABLE IF EXISTS public.conversions;
DROP TABLE IF EXISTS public.referrals;
DROP TABLE IF EXISTS public.affiliates;

-- Create AFFILIATES table
CREATE TABLE public.affiliates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    referral_code TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'banned')),
    payout_method TEXT DEFAULT 'wise', -- wise, crypto, paypal
    payout_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create REFERRALS table (Clicks)
CREATE TABLE public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    visitor_ip_hash TEXT NOT NULL, -- Anonymized hash
    user_agent TEXT,
    landing_page TEXT,
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create CONVERSIONS table (Money)
CREATE TABLE public.conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES public.referrals(id), -- Link to specific click if possible
    external_order_id TEXT NOT NULL, -- Stripe/LemonSqueezy ID
    amount_cents INTEGER NOT NULL,
    commission_amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create PAYOUTS table (Ledger)
CREATE TABLE public.payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliates(id),
    amount_cents INTEGER NOT NULL,
    transaction_reference TEXT,
    paid_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_conversions_affiliate_id ON public.conversions(affiliate_id);

-- RLS Policies (Security)
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- 1. Users can view their own affiliate profile
CREATE POLICY "Users can view own affiliate profile" ON public.affiliates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate profile" ON public.affiliates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create own affiliate profile" ON public.affiliates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Users can view their own stats
CREATE POLICY "Users can view own referrals" ON public.referrals
    FOR SELECT USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- Allow public (anonymous) tracking of referrals (The TrafficMonitor needs this)
CREATE POLICY "Public can insert referrals" ON public.referrals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own conversions" ON public.conversions
    FOR SELECT USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));
    
CREATE POLICY "Users can view own payouts" ON public.payouts
    FOR SELECT USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));
