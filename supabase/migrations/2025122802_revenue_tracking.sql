-- Add Stripe tracking columns to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS stripe_account_id text,
ADD COLUMN IF NOT EXISTS stripe_webhook_secret text,
ADD COLUMN IF NOT EXISTS stripe_api_key text; -- Note: user provided key for direct API calls (stored encrypted in real app, here plaintext for MVP)

-- Create Orders Table for granular revenue tracking
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
    stripe_session_id text,
    stripe_payment_intent text,
    amount_total numeric NOT NULL, -- Stored in whole currency units (e.g. 10.00)
    currency text DEFAULT 'usd',
    customer_email text,
    status text DEFAULT 'completed',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view orders for their own businesses" 
ON public.orders FOR SELECT 
USING (
    business_id IN (
        SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
);

-- Index for speed
CREATE INDEX IF NOT EXISTS idx_orders_business_id ON public.orders(business_id);
