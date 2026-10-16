import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const LEMON_SQUEEZY_WEBHOOK_SECRET = 
    Deno.env.get("LEMON_SQUEEZY_WEBHOOK_SECRET") || 
    Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET")

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
})

/**
 * Cryptographic HMAC-SHA256 Verification via Web Crypto API (Deno Native)
 * Uses constant-time comparison to mitigate timing attacks.
 */
async function verifyLemonSqueezySignature(rawBody: string, signatureHex: string, secret: string): Promise<boolean> {
    try {
        const encoder = new TextEncoder()
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        )

        const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody))
        const computedHex = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
            .toLowerCase()

        const expectedHex = signatureHex.trim().toLowerCase()

        if (computedHex.length !== expectedHex.length) {
            return false
        }

        // Constant-time equality comparison
        let result = 0
        for (let i = 0; i < computedHex.length; i++) {
            result |= computedHex.charCodeAt(i) ^ expectedHex.charCodeAt(i)
        }
        return result === 0
    } catch (err) {
        console.error("Signature computation error:", err)
        return false
    }
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } })
    }

    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 })
    }

    try {
        // 1. Extract signature and ensure secret exists
        const signatureHeader = req.headers.get("x-signature")
        if (!signatureHeader) {
            console.error("⚠️ Rejected: Missing X-Signature header.")
            return new Response(JSON.stringify({ error: "Missing x-signature header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            })
        }

        if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
            console.error("⚠️ LEMON_SQUEEZY_WEBHOOK_SECRET not configured in Supabase environment.")
            return new Response(JSON.stringify({ error: "Server webhook configuration error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            })
        }

        // 2. Read raw payload buffer BEFORE parsing JSON
        const rawBody = await req.text()

        // 3. Cryptographically verify signature
        const isValid = await verifyLemonSqueezySignature(rawBody, signatureHeader, LEMON_SQUEEZY_WEBHOOK_SECRET)
        if (!isValid) {
            console.error("⛔ Unauthorized: Invalid HMAC-SHA256 signature from Lemon Squeezy.")
            return new Response(JSON.stringify({ error: "Unauthorized: Invalid cryptographic signature" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            })
        }

        // 4. Safely parse JSON only after cryptographic verification
        const payload = JSON.parse(rawBody)
        const eventName = payload.meta?.event_name
        const customData = payload.meta?.custom_data
        const data = payload.data
        const attributes = data?.attributes

        console.log(`✅ Verified Lemon Squeezy Event: [${eventName}] Order ID: ${data?.id}`)

        const businessId = customData?.business_id || customData?.businessId
        const affiliateCode = customData?.affiliate_code || customData?.affiliateCode

        // =====================================================================
        // EVENT: ORDER CREATED (Direct Purchase / Course / Single Product)
        // =====================================================================
        if (eventName === "order_created" && businessId) {
            const externalOrderId = data.id.toString()
            const totalAmount = attributes.total ? attributes.total / 100 : 0
            const customerEmail = attributes.user_email || null
            const customerName = attributes.user_name || null

            // Check duplicate
            const { data: existing } = await supabase
                .from("orders")
                .select("id")
                .eq("stripe_session_id", `ls_${externalOrderId}`)
                .maybeSingle()

            if (!existing) {
                // Record verified order in public.orders
                await supabase.from("orders").insert({
                    business_id: businessId,
                    stripe_session_id: `ls_${externalOrderId}`,
                    total_amount: totalAmount,
                    currency: (attributes.currency || "USD").toUpperCase(),
                    customer_email: customerEmail,
                    customer_name: customerName,
                    status: attributes.status === "paid" ? "paid" : "completed",
                    items: attributes.first_order_item ? [attributes.first_order_item] : []
                })

                // Increment business revenue
                const { data: biz } = await supabase
                    .from("businesses")
                    .select("revenue, orders")
                    .eq("id", businessId)
                    .single()

                if (biz) {
                    await supabase.from("businesses").update({
                        revenue: (Number(biz.revenue) || 0) + totalAmount,
                        orders: (Number(biz.orders) || 0) + 1,
                        updated_at: new Date().toISOString()
                    }).eq("id", businessId)
                }

                // Affiliate Attribution
                if (affiliateCode) {
                    await recordAffiliateConversion(affiliateCode, externalOrderId, totalAmount, attributes.currency || "USD")
                }
            }
        }

        // =====================================================================
        // EVENT: SUBSCRIPTION CREATED / UPDATED / PAYMENT SUCCESS
        // =====================================================================
        if (
            eventName === "subscription_created" || 
            eventName === "subscription_updated" || 
            eventName === "subscription_payment_success"
        ) {
            if (businessId) {
                const productName = attributes.product_name?.toLowerCase() || ""
                let tier = "pro"
                let creditsToSet = 5000

                if (productName.includes("enterprise")) {
                    tier = "enterprise"
                    creditsToSet = 12000
                } else if (productName.includes("agency") || productName.includes("organization")) {
                    tier = "agency"
                    creditsToSet = 30000
                } else if (productName.includes("starter")) {
                    tier = "starter"
                    creditsToSet = 1000
                }

                // 1. Update businesses table
                await supabase
                    .from("businesses")
                    .update({
                        tier: tier,
                        credits_balance: creditsToSet,
                        subscription_status: "active",
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", businessId)

                // 2. Synchronize Phase 1 tenant_credits ledger
                await supabase
                    .from("tenant_credits")
                    .update({
                        balance: creditsToSet,
                        updated_at: new Date().toISOString()
                    })
                    .eq("business_id", businessId)

                // 3. Process Affiliate Conversion on initial subscription
                if (affiliateCode && eventName === "subscription_created") {
                    const firstOrderPrice = attributes.first_order_item?.price || 0
                    const subDollars = firstOrderPrice / 100
                    await recordAffiliateConversion(affiliateCode, data.id.toString(), subDollars, "USD")
                }

                // 4. Send Confirmation Email via Resend if configured
                if (RESEND_API_KEY && attributes.user_email && eventName !== "subscription_payment_success") {
                    try {
                        await fetch("https://api.resend.com/emails", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${RESEND_API_KEY}`
                            },
                            body: JSON.stringify({
                                from: "AURA <billing@aura-platform.com>",
                                to: [attributes.user_email],
                                subject: `AURA Platform: ${tier.toUpperCase()} Access Activated`,
                                html: `<div style="font-family:sans-serif;padding:20px;background:#0a0a0a;color:#fff;">
                                    <h2>Subscription Verified & Activated</h2>
                                    <p>Your business is now upgraded to <strong>${tier.toUpperCase()}</strong> tier.</p>
                                    <p>AI Generation Credits allocated: <strong>${creditsToSet}</strong>.</p>
                                </div>`
                            })
                        })
                    } catch (emailErr) {
                        console.error("Resend notification error:", emailErr)
                    }
                }
            }
        }

        // =====================================================================
        // EVENT: SUBSCRIPTION PAYMENT FAILED (Dunning / Grace Period)
        // =====================================================================
        if (eventName === "subscription_payment_failed" && businessId) {
            await supabase
                .from("businesses")
                .update({
                    subscription_status: "past_due",
                    updated_at: new Date().toISOString()
                })
                .eq("id", businessId)
        }

        // =====================================================================
        // EVENT: SUBSCRIPTION EXPIRED
        // =====================================================================
        if (eventName === "subscription_expired" && businessId) {
            await supabase
                .from("businesses")
                .update({
                    tier: "free",
                    credits_balance: 50,
                    subscription_status: "expired",
                    updated_at: new Date().toISOString()
                })
                .eq("id", businessId)

            await supabase
                .from("tenant_credits")
                .update({
                    balance: 50,
                    updated_at: new Date().toISOString()
                })
                .eq("business_id", businessId)
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (err: any) {
        console.error("Lemon Squeezy Webhook Error:", err)
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
})

/**
 * Records verified affiliate conversion in public.conversions
 */
async function recordAffiliateConversion(code: string, orderId: string, amountDollars: number, currency: string) {
    try {
        const { data: affiliate } = await supabase
            .from("affiliates")
            .select("id")
            .eq("referral_code", code.toUpperCase())
            .maybeSingle()

        if (affiliate) {
            const amountCents = Math.round(amountDollars * 100)
            const commissionCents = Math.round(amountCents * 0.35) // 35% commission

            await supabase.from("conversions").insert({
                affiliate_id: affiliate.id,
                external_order_id: orderId,
                amount_cents: amountCents,
                commission_amount_cents: commissionCents,
                currency: currency.toUpperCase(),
                status: "pending"
            })
            console.log(`✅ Affiliate conversion logged: ${commissionCents} cents for code ${code}`)
        }
    } catch (err) {
        console.error("Affiliate processing error:", err)
    }
}
