/**
 * Shopify Orders Webhook Handler
 * Records revenue from user stores WITHOUT processing payments.
 * Zero-liability architecture - we only track, never touch money.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-shop-domain, x-shopify-topic',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    try {
        // Extract Shopify headers
        const hmacHeader = req.headers.get('x-shopify-hmac-sha256')
        const shopDomain = req.headers.get('x-shopify-shop-domain')
        const topic = req.headers.get('x-shopify-topic')

        const url = new URL(req.url)
        const businessId = url.searchParams.get('businessId')

        if (!businessId) {
            throw new Error('Missing businessId in webhook URL')
        }

        // Get raw body for HMAC verification
        const body = await req.text()

        // 1. Verify webhook authenticity via HMAC-SHA256
        const shopifyWebhookSecret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET')
        if (shopifyWebhookSecret) {
            if (!hmacHeader) {
                console.error('[Webhook] Missing x-shopify-hmac-sha256 header')
                return new Response(JSON.stringify({ error: 'Missing HMAC signature' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                })
            }

            const hmac = createHmac('sha256', shopifyWebhookSecret)
            hmac.update(body)
            const digest = hmac.digest('base64')

            if (digest !== hmacHeader) {
                console.error('[Webhook] HMAC verification failed: invalid signature')
                return new Response(JSON.stringify({ error: 'Unauthorized: Invalid Shopify signature' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                })
            }
        }

        const payload = JSON.parse(body)

        // Process based on topic
        if (topic === 'orders/create' || topic === 'orders/paid') {
            await handleOrderEvent(supabase, businessId, payload, topic)
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error('[Orders Webhook Error]', error.message)
        // Return 200 to prevent Shopify from retrying
        return new Response(JSON.stringify({ received: true, error: error.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})

interface ShopifyOrder {
    id: number
    order_number: number
    total_price: string
    subtotal_price: string
    total_tax: string
    currency: string
    financial_status: string
    fulfillment_status: string | null
    created_at: string
    updated_at: string
    customer?: {
        id: number
        email: string
        first_name: string
        last_name: string
    }
    line_items: Array<{
        id: number
        title: string
        quantity: number
        price: string
        sku: string
    }>
    shipping_address?: {
        country: string
        city: string
    }
}

async function handleOrderEvent(
    supabase: any,
    businessId: string,
    order: ShopifyOrder,
    topic: string
) {
    const orderData = {
        business_id: businessId,
        provider: 'shopify',
        provider_order_id: order.id.toString(),
        order_number: order.order_number,
        status: topic === 'orders/paid' ? 'paid' : 'pending',
        total_amount: parseFloat(order.total_price),
        subtotal: parseFloat(order.subtotal_price),
        tax_amount: parseFloat(order.total_tax),
        currency: order.currency,
        financial_status: order.financial_status,
        fulfillment_status: order.fulfillment_status || 'unfulfilled',
        customer_email: order.customer?.email || null,
        line_items_count: order.line_items.length,
        line_items: order.line_items.map(item => ({
            title: item.title,
            quantity: item.quantity,
            price: parseFloat(item.price),
            sku: item.sku
        })),
        country: order.shipping_address?.country || null,
        created_at: order.created_at,
        received_at: new Date().toISOString()
    }

    // Upsert order (handle duplicate webhooks)
    const { error } = await supabase
        .from('orders')
        .upsert(orderData, {
            onConflict: 'business_id,provider,provider_order_id'
        })

    if (error) {
        console.error('[Order Upsert Error]', error)
        throw error
    }

    // Update business revenue metrics
    if (topic === 'orders/paid') {
        await updateRevenueMetrics(supabase, businessId, parseFloat(order.total_price))
    }

    console.log(`[Order ${topic}] Recorded order ${order.order_number} for business ${businessId}`)
}

async function updateRevenueMetrics(supabase: any, businessId: string, amount: number) {
    // Get current metrics
    const { data: business } = await supabase
        .from('businesses')
        .select('total_revenue, orders_count')
        .eq('id', businessId)
        .single()

    const currentRevenue = business?.total_revenue || 0
    const currentOrders = business?.orders_count || 0

    // Update metrics
    await supabase
        .from('businesses')
        .update({
            total_revenue: currentRevenue + amount,
            orders_count: currentOrders + 1,
            last_order_at: new Date().toISOString()
        })
        .eq('id', businessId)
}
