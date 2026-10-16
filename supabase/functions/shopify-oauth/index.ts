/**
 * Shopify OAuth Edge Function
 * Implements OAuth 2.0 flow for user-owned Shopify store connections.
 * This ensures zero-liability architecture - users connect their own stores.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Shopify App credentials (from Partner Dashboard)
const SHOPIFY_API_KEY = Deno.env.get('SHOPIFY_API_KEY') || ''
const SHOPIFY_API_SECRET = Deno.env.get('SHOPIFY_API_SECRET') || ''
const APP_URL = Deno.env.get('APP_URL') || 'https://aura-increase.com'

// Required OAuth scopes - minimal for zero-liability
const SCOPES = [
    'read_products',
    'write_products',
    'read_orders',  // For revenue tracking only
].join(',')

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    try {
        // ==========================================
        // ACTION: INITIATE OAUTH
        // ==========================================
        if (action === 'initiate') {
            const { shop, businessId } = await req.json()

            if (!shop || !businessId) {
                throw new Error('Missing shop URL or businessId')
            }

            // Clean shop domain
            const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '')

            // Generate state for CSRF protection
            const state = crypto.randomUUID()

            // Store state in database for verification
            await supabase.from('oauth_states').insert({
                state,
                business_id: businessId,
                shop: cleanShop,
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 min expiry
            })

            // Construct OAuth URL
            const redirectUri = `${APP_URL}/api/shopify/callback`
            const authUrl = new URL(`https://${cleanShop}/admin/oauth/authorize`)
            authUrl.searchParams.set('client_id', SHOPIFY_API_KEY)
            authUrl.searchParams.set('scope', SCOPES)
            authUrl.searchParams.set('redirect_uri', redirectUri)
            authUrl.searchParams.set('state', state)

            return new Response(JSON.stringify({
                success: true,
                authUrl: authUrl.toString()
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // ==========================================
        // ACTION: HANDLE OAUTH CALLBACK
        // ==========================================
        if (action === 'callback') {
            const code = url.searchParams.get('code')
            const state = url.searchParams.get('state')
            const shop = url.searchParams.get('shop')

            if (!code || !state || !shop) {
                throw new Error('Missing OAuth callback parameters')
            }

            // Verify state
            const { data: stateData, error: stateError } = await supabase
                .from('oauth_states')
                .select('*')
                .eq('state', state)
                .eq('shop', shop)
                .single()

            if (stateError || !stateData) {
                throw new Error('Invalid or expired OAuth state')
            }

            // Check expiry
            if (new Date(stateData.expires_at) < new Date()) {
                throw new Error('OAuth session expired')
            }

            const businessId = stateData.business_id

            // Delete used state
            await supabase.from('oauth_states').delete().eq('state', state)

            // Exchange code for access token
            const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: SHOPIFY_API_KEY,
                    client_secret: SHOPIFY_API_SECRET,
                    code
                })
            })

            if (!tokenResponse.ok) {
                const errorData = await tokenResponse.text()
                throw new Error(`Token exchange failed: ${errorData}`)
            }

            const { access_token, scope } = await tokenResponse.json()

            // Get store info
            const shopInfoResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
                headers: { 'X-Shopify-Access-Token': access_token }
            })
            const shopInfo = await shopInfoResponse.json()

            // Store integration (upsert to handle reconnections)
            const { error: integrationError } = await supabase
                .from('integrations')
                .upsert({
                    business_id: businessId,
                    provider: 'shopify',
                    provider_id: shopInfo.shop?.id?.toString() || shop,
                    access_token: access_token, // Encrypted at rest by Supabase
                    refresh_token: null, // Shopify uses permanent tokens
                    scopes: scope,
                    metadata: {
                        shop_name: shopInfo.shop?.name,
                        shop_domain: shop,
                        email: shopInfo.shop?.email,
                        currency: shopInfo.shop?.currency,
                        connected_at: new Date().toISOString()
                    },
                    status: 'active',
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'business_id,provider'
                })

            if (integrationError) {
                throw new Error(`Failed to store integration: ${integrationError.message}`)
            }

            // Register webhooks for order tracking
            await registerOrderWebhooks(shop, access_token, businessId)

            // Redirect back to app with success
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': `${APP_URL}/dashboard/integrations?shopify=connected`,
                    ...corsHeaders
                }
            })
        }

        // ==========================================
        // ACTION: GET CONNECTION STATUS
        // ==========================================
        if (action === 'status') {
            const { businessId } = await req.json()

            const { data: integration } = await supabase
                .from('integrations')
                .select('*')
                .eq('business_id', businessId)
                .eq('provider', 'shopify')
                .single()

            return new Response(JSON.stringify({
                connected: !!integration && integration.status === 'active',
                shop: integration?.metadata?.shop_domain || null,
                shopName: integration?.metadata?.shop_name || null,
                connectedAt: integration?.metadata?.connected_at || null
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // ==========================================
        // ACTION: DISCONNECT
        // ==========================================
        if (action === 'disconnect') {
            const { businessId } = await req.json()

            await supabase
                .from('integrations')
                .update({ status: 'disconnected', access_token: null })
                .eq('business_id', businessId)
                .eq('provider', 'shopify')

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        throw new Error(`Unknown action: ${action}`)

    } catch (error: any) {
        console.error('[Shopify OAuth Error]', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})

/**
 * Register webhooks on the connected Shopify store for order tracking.
 * Zero-liability: We only READ order data for revenue tracking.
 */
async function registerOrderWebhooks(shop: string, accessToken: string, businessId: string) {
    const webhookUrl = `${APP_URL}/api/shopify/orders-webhook?businessId=${businessId}`

    const webhooks = [
        { topic: 'orders/create', address: webhookUrl },
        { topic: 'orders/paid', address: webhookUrl },
    ]

    for (const webhook of webhooks) {
        try {
            await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': accessToken
                },
                body: JSON.stringify({
                    webhook: {
                        topic: webhook.topic,
                        address: webhook.address,
                        format: 'json'
                    }
                })
            })
        } catch (e) {
            console.error(`Failed to register webhook ${webhook.topic}:`, e)
        }
    }
}
