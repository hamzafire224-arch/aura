import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"

/**
 * TrafficMonitor: 30-Day First-Party Affiliate Click Tracker
 * 
 * 1. Headless component running globally at the root router level.
 * 2. Intercepts incoming attribution parameters (?ref=, ?via=, ?referral=).
 * 3. Persists attribution in both a first-party cookie (30 days) and localStorage.
 * 4. Logs verified referral clicks in the public.referrals table for CTR telemetry.
 * 5. Sanitizes address bar without causing a reload.
 */

const AFFILIATE_COOKIE_NAME = "aura_ref"
const AFFILIATE_STORAGE_KEY = "aura_affiliate_ref"
const COOKIE_EXPIRY_DAYS = 30

export interface AffiliateAttribution {
    code: string
    timestamp: number
    expiresAt: number
    landingPage: string
}

/**
 * Persist affiliate attribution to 30-day cookie and localStorage
 */
export function storeAffiliateAttribution(code: string, landingPage = "/"): void {
    if (typeof window === "undefined" || !code) return

    const sanitizedCode = code.trim().toUpperCase()
    const now = Date.now()
    const expiresAt = now + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000

    const attribution: AffiliateAttribution = {
        code: sanitizedCode,
        timestamp: now,
        expiresAt,
        landingPage: landingPage || window.location.pathname || "/",
    }

    const serialized = JSON.stringify(attribution)

    // 1. Set First-Party Cookie (30 Days)
    const maxAgeSeconds = COOKIE_EXPIRY_DAYS * 24 * 60 * 60
    document.cookie = `${AFFILIATE_COOKIE_NAME}=${encodeURIComponent(serialized)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax; Secure`

    // 2. Set LocalStorage backup
    try {
        localStorage.setItem(AFFILIATE_STORAGE_KEY, serialized)
    } catch (e) {
        console.warn("[TrafficMonitor] LocalStorage quota exceeded or disabled.")
    }
}

/**
 * Read active affiliate attribution (checks Cookie first, fallbacks to LocalStorage)
 */
export function getAffiliateAttribution(): AffiliateAttribution | null {
    if (typeof window === "undefined") return null
    const now = Date.now()

    // 1. Check Cookie
    try {
        const cookies = document.cookie.split(";")
        for (const cookie of cookies) {
            const [rawKey, ...rawValueParts] = cookie.trim().split("=")
            if (rawKey === AFFILIATE_COOKIE_NAME) {
                const rawVal = rawValueParts.join("=")
                if (rawVal) {
                    const parsed = JSON.parse(decodeURIComponent(rawVal)) as AffiliateAttribution
                    if (parsed.code && parsed.expiresAt > now) {
                        return parsed
                    }
                }
            }
        }
    } catch {
        // Fall through to localStorage
    }

    // 2. Check LocalStorage fallback
    try {
        const stored = localStorage.getItem(AFFILIATE_STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored) as AffiliateAttribution
            if (parsed.code && parsed.expiresAt > now) {
                return parsed
            }
        }
    } catch {
        // Ignore
    }

    return null
}

/**
 * Get active referral code string (or null if none or expired)
 */
export function getAffiliateCode(): string | null {
    const attr = getAffiliateAttribution()
    return attr?.code || null
}

/**
 * Clear affiliate attribution (e.g. after conversion checkout is recorded)
 */
export function clearAffiliateAttribution(): void {
    if (typeof window === "undefined") return

    document.cookie = `${AFFILIATE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`
    try {
        localStorage.removeItem(AFFILIATE_STORAGE_KEY)
    } catch {
        // Ignore
    }
}

/**
 * Log click in Supabase referrals table (with session deduplication)
 */
async function logReferralClick(refCode: string, landingPage: string): Promise<void> {
    const sessionKey = `aura_click_logged_${refCode.toUpperCase()}`

    // Deduplicate clicks within the current browsing session to avoid spamming
    if (sessionStorage.getItem(sessionKey)) {
        return
    }

    try {
        // 1. Attempt RPC call (optimal & privacy-safe with SECURITY DEFINER)
        const { data: rpcResult, error: rpcError } = await supabase.rpc("log_referral_click", {
            p_referral_code: refCode.toUpperCase(),
            p_landing_page: landingPage,
            p_user_agent: navigator.userAgent.substring(0, 255),
        })

        if (!rpcError && rpcResult?.success) {
            sessionStorage.setItem(sessionKey, "true")
            console.log(`📡 [TrafficMonitor] Click recorded for ref=${refCode} via RPC`)
            return
        }

        // 2. Fallback: Direct lookup + insert if RPC isn't loaded
        const { data: affiliate } = await supabase
            .from("affiliates")
            .select("id")
            .eq("referral_code", refCode.toUpperCase())
            .maybeSingle()

        if (affiliate?.id) {
            await supabase.from("referrals").insert({
                affiliate_id: affiliate.id,
                visitor_ip_hash: "client-telemetry",
                user_agent: navigator.userAgent.substring(0, 200),
                landing_page: landingPage,
                converted: false,
            })
            sessionStorage.setItem(sessionKey, "true")
            console.log(`📡 [TrafficMonitor] Click recorded for ref=${refCode} via direct insert`)
        }
    } catch (err) {
        console.warn("[TrafficMonitor] Referral click logging encountered error:", err)
    }
}

/**
 * Headless Traffic Monitor Component
 */
export function TrafficMonitor() {
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (typeof window === "undefined") return

        // Check for ?ref=, ?via=, or ?referral=
        const refParam = searchParams.get("ref") || searchParams.get("via") || searchParams.get("referral")

        if (refParam && refParam.trim().length > 0) {
            const cleanCode = refParam.trim().toUpperCase()
            const landingPath = window.location.pathname || "/"

            // 1. Persist attribution
            storeAffiliateAttribution(cleanCode, landingPath)
            console.log(`🔗 [TrafficMonitor] Affiliate attribution locked: ${cleanCode} (30 days)`)

            // 2. Log click to Supabase
            logReferralClick(cleanCode, landingPath)

            // 3. Clean up URL without triggering navigation or losing other query params
            try {
                const currentUrl = new URL(window.location.href)
                currentUrl.searchParams.delete("ref")
                currentUrl.searchParams.delete("via")
                currentUrl.searchParams.delete("referral")
                window.history.replaceState({}, document.title, currentUrl.pathname + (currentUrl.search || "") + currentUrl.hash)
            } catch {
                // Ignore URL replace errors on older runtimes
            }
        }
    }, [searchParams])

    return null
}
