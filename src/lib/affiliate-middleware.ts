/**
 * Affiliate Tracking Middleware
 * Captures ?ref=CODE parameter and stores 90-day sticky attribution
 * Uses both cookies and localStorage for redundancy
 */

const AFFILIATE_STORAGE_KEY = 'aura_affiliate_ref';
const AFFILIATE_COOKIE_NAME = 'aura_ref';
const COOKIE_EXPIRY_DAYS = 90;

export interface AffiliateAttribution {
    code: string;
    timestamp: number;
    landingPage: string;
}

/**
 * Initialize affiliate tracking on app load
 * Call this in your main App component or router
 */
export function initAffiliateTracking(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode) {
        console.log(`🔗 Affiliate tracking: Captured ref=${refCode}`);
        storeAffiliateAttribution(refCode);

        // Clean URL (optional - removes ?ref= from address bar)
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('ref');
        window.history.replaceState({}, '', cleanUrl.toString());

        // Track the referral visit in backend
        trackAffiliateVisit(refCode);
    }
}

/**
 * Store affiliate attribution with 90-day persistence
 */
function storeAffiliateAttribution(code: string): void {
    const attribution: AffiliateAttribution = {
        code: code.toUpperCase(),
        timestamp: Date.now(),
        landingPage: window.location.pathname
    };

    // 1. Set HTTP Cookie (90 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    document.cookie = `${AFFILIATE_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(attribution))}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;

    // 2. Set localStorage (backup for cookie clearing)
    try {
        localStorage.setItem(AFFILIATE_STORAGE_KEY, JSON.stringify(attribution));
    } catch (e) {
        console.warn('Affiliate tracking: localStorage not available');
    }
}

/**
 * Get current affiliate attribution (checks cookie first, then localStorage)
 * Returns null if no attribution or if expired (>90 days)
 */
export function getAffiliateAttribution(): AffiliateAttribution | null {
    if (typeof window === 'undefined') return null;

    // 1. Try Cookie first
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === AFFILIATE_COOKIE_NAME && value) {
            try {
                const attribution = JSON.parse(decodeURIComponent(value)) as AffiliateAttribution;
                if (isAttributionValid(attribution)) {
                    return attribution;
                }
            } catch (e) {
                // Invalid cookie format
            }
        }
    }

    // 2. Fallback to localStorage
    try {
        const stored = localStorage.getItem(AFFILIATE_STORAGE_KEY);
        if (stored) {
            const attribution = JSON.parse(stored) as AffiliateAttribution;
            if (isAttributionValid(attribution)) {
                return attribution;
            }
        }
    } catch (e) {
        // localStorage not available or invalid data
    }

    return null;
}

/**
 * Get just the affiliate code (simplified getter)
 */
export function getAffiliateCode(): string | null {
    const attribution = getAffiliateAttribution();
    return attribution?.code || null;
}

/**
 * Check if attribution is still valid (within 90 days)
 */
function isAttributionValid(attribution: AffiliateAttribution): boolean {
    const maxAge = COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 90 days in ms
    return Date.now() - attribution.timestamp < maxAge;
}

/**
 * Clear affiliate attribution (call after successful conversion/payout)
 */
export function clearAffiliateAttribution(): void {
    if (typeof window === 'undefined') return;

    // Clear cookie
    document.cookie = `${AFFILIATE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    // Clear localStorage
    try {
        localStorage.removeItem(AFFILIATE_STORAGE_KEY);
    } catch (e) {
        // Ignore
    }
}

/**
 * Track affiliate visit in backend
 */
async function trackAffiliateVisit(code: string): Promise<void> {
    try {
        const { supabase } = await import('@/lib/supabase');

        // First, find the affiliate by code
        const { data: affiliate } = await supabase
            .from('affiliates')
            .select('id')
            .eq('referral_code', code.toUpperCase())
            .single();

        if (!affiliate) {
            console.warn(`Affiliate tracking: Code ${code} not found`);
            return;
        }

        // Record the referral visit
        await supabase.from('referrals').insert({
            affiliate_id: affiliate.id,
            visitor_ip_hash: 'anon', // Privacy-safe, would hash IP on server
            user_agent: navigator.userAgent.substring(0, 200),
            landing_page: window.location.pathname,
            converted: false
        });

        console.log('✅ Affiliate visit tracked');
    } catch (error) {
        console.error('Affiliate tracking failed:', error);
    }
}
