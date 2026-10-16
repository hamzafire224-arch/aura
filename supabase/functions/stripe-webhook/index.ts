import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "npm:stripe@^14.0.0"

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") ?? ""
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? ""

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
})

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } })
    }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 })
    }

    try {
        const signature = req.headers.get("stripe-signature")
        if (!signature) {
            console.error("Missing Stripe-Signature header.")
            return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            })
        }

        if (!endpointSecret) {
            console.error("STRIPE_WEBHOOK_SECRET is not configured on the server.")
            return new Response(JSON.stringify({ error: "Server webhook configuration error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            })
        }

        // 1. Read raw body as text for cryptographic signature verification
        const rawBody = await req.text()

        // 2. Cryptographic signature check (Rejects forged payloads)
        let event: Stripe.Event
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)
        } catch (err: any) {
            console.error(`⚠️ Webhook signature verification failed: ${err.message}`)
            return new Response(JSON.stringify({ error: `Webhook Signature Verification Failed: ${err.message}` }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            })
        }

        console.log(`✅ Verified Stripe Event: [${event.id}] type: ${event.type}`)

        // 3. Process checkout.session.completed securely
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session
            const businessId = session.metadata?.business_id || session.metadata?.businessId
            const affiliateCode = session.metadata?.affiliate_code || session.metadata?.affiliateCode

            if (!businessId) {
                console.warn(`[Stripe Webhook] Session ${session.id} missing businessId in metadata. Skipping order creation.`)
                return new Response(JSON.stringify({ received: true, note: "No business_id" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                })
            }

            // Idempotency: Prevent duplicate order processing if Stripe retries delivery
            const { data: existingOrder } = await supabase
                .from("orders")
                .select("id")
                .eq("stripe_session_id", session.id)
                .maybeSingle()

            if (existingOrder) {
                console.log(`[Stripe Webhook] Order for session ${session.id} already processed. Skipping duplicate.`)
                return new Response(JSON.stringify({ received: true, duplicate: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                })
            }

            const totalAmount = session.amount_total ? session.amount_total / 100 : 0
            const customerEmail = session.customer_details?.email || session.customer_email || null
            const customerName = session.customer_details?.name || null

            // Insert verified order into public.orders using service_role
            const { data: newOrder, error: orderError } = await supabase
                .from("orders")
                .insert({
                    business_id: businessId,
                    stripe_session_id: session.id,
                    total_amount: totalAmount,
                    currency: (session.currency || "USD").toUpperCase(),
                    customer_email: customerEmail,
                    customer_name: customerName,
                    status: "paid",
                    items: session.metadata?.items ? JSON.parse(session.metadata.items) : []
                })
                .select()
                .single()

            if (orderError) {
                console.error("Failed to insert verified order:", orderError)
                return new Response(JSON.stringify({ error: "Failed to persist order to database" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                })
            }

            // Update business revenue & order count metrics
            const { data: currentBiz } = await supabase
                .from("businesses")
                .select("revenue, orders")
                .eq("id", businessId)
                .single()

            if (currentBiz) {
                await supabase
                    .from("businesses")
                    .update({
                        revenue: (Number(currentBiz.revenue) || 0) + totalAmount,
                        orders: (Number(currentBiz.orders) || 0) + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", businessId)
            }

            // 4. Handle Affiliate Attribution if referral/affiliate code was attached
            if (affiliateCode) {
                try {
                    const { data: affiliate } = await supabase
                        .from("affiliates")
                        .select("id")
                        .eq("referral_code", affiliateCode.toUpperCase())
                        .maybeSingle()

                    if (affiliate) {
                        const commissionCents = Math.round(totalAmount * 100 * 0.30) // 30% baseline commission
                        await supabase.from("conversions").insert({
                            affiliate_id: affiliate.id,
                            external_order_id: session.id,
                            amount_cents: Math.round(totalAmount * 100),
                            commission_amount_cents: commissionCents,
                            currency: (session.currency || "USD").toUpperCase(),
                            status: "pending"
                        })
                        console.log(`💰 Verified affiliate commission recorded for code ${affiliateCode}`)
                    }
                } catch (affErr) {
                    console.error("Error processing affiliate attribution:", affErr)
                }
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (err: any) {
        console.error("Stripe Webhook Fatal Error:", err)
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
})
