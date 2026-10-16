-- Add credit system columns to the businesses table

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise', 'organization'
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create a function to deduct credits safely (atomic operation)
CREATE OR REPLACE FUNCTION deduct_credits(business_id UUID, amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance INTEGER;
BEGIN
    -- Get current balance
    SELECT credits_balance INTO current_balance FROM businesses WHERE id = business_id;
    
    -- Check if enough credits
    IF current_balance >= amount THEN
        -- Deduct credits
        UPDATE businesses 
        SET credits_balance = credits_balance - amount 
        WHERE id = business_id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;
