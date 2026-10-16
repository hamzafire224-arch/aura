
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { url, token } = await req.json()

        if (!url || !token) {
            throw new Error('Missing URL or Access Token')
        }

        // Clean URL
        const shopUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

        // 1. Validate if it's a real Shopify URL structure
        if (!shopUrl.includes('myshopify.com') && !shopUrl.includes('.')) {
            throw new Error('Invalid Shopify URL format')
        }

        console.log(`Verifying shop: ${shopUrl}`)

        // 2. Call Shopify Admin API
        const response = await fetch(`https://${shopUrl}/admin/api/2023-10/shop.json`, {
            method: 'GET',
            headers: {
                'X-Shopify-Access-Token': token,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid Access Token. Please check your credentials.')
            }
            throw new Error(`Shopify API Error: ${response.statusText}`)
        }

        const data = await response.json()
        const shop = data.shop

        // 3. Return success with shop details
        return new Response(
            JSON.stringify({
                success: true,
                shop: {
                    name: shop.name,
                    email: shop.email,
                    domain: shop.domain,
                    currency: shop.currency,
                    iana_timezone: shop.iana_timezone,
                    myshopify_domain: shop.myshopify_domain
                }
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
