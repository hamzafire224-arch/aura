-- ==============================================================================
-- PHASE 3: AFFILIATE ATTRIBUTION RPC
-- Stored procedure to safely record anonymous referral visits without leaking data
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.log_referral_click(
    p_referral_code TEXT,
    p_landing_page TEXT DEFAULT '/',
    p_user_agent TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_affiliate_id UUID;
    v_referral_id UUID;
BEGIN
    -- 1. Find active affiliate by referral code (case-insensitive)
    SELECT id INTO v_affiliate_id
    FROM public.affiliates
    WHERE UPPER(referral_code) = UPPER(TRIM(p_referral_code))
      AND status = 'active'
    LIMIT 1;

    IF v_affiliate_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Invalid or inactive referral code'
        );
    END IF;

    -- 2. Insert referral record with anonymized visitor signature
    INSERT INTO public.referrals (
        affiliate_id,
        visitor_ip_hash,
        user_agent,
        landing_page,
        converted
    ) VALUES (
        v_affiliate_id,
        md5(concat(coalesce(p_user_agent, ''), timezone('utc'::text, now())::date::text)),
        substring(coalesce(p_user_agent, '') from 1 for 255),
        coalesce(p_landing_page, '/'),
        false
    )
    RETURNING id INTO v_referral_id;

    RETURN jsonb_build_object(
        'success', true, 
        'referral_id', v_referral_id,
        'affiliate_id', v_affiliate_id
    );
END;
$$;

-- Grant execution to all client tiers (anon, authenticated, service_role)
GRANT EXECUTE ON FUNCTION public.log_referral_click(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
