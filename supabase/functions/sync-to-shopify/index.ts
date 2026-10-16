/**
 * Sync Products to Shopify
 * Enhanced to use OAuth tokens from integrations table (user-owned stores).
 * Zero-liability: Uses user's own Shopify credentials.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { businessId, productIds } = await req.json()

        if (!businessId) {
            throw new Error("Missing required parameter: businessId")
        }

        // 1. Get Shopify integration (OAuth tokens)
        const { data: integration, error: integrationError } = await supabase
            .from('integrations')
            .select('*')
            .eq('business_id', businessId)
            .eq('provider', 'shopify')
            .eq('status', 'active')
            .single()

        if (integrationError || !integration) {
            return new Response(JSON.stringify({
                error: 'Shopify not connected. Please connect your store first.',
                code: 'SHOPIFY_NOT_CONNECTED'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const shopDomain = integration.metadata?.shop_domain
        const accessToken = integration.access_token

        if (!shopDomain || !accessToken) {
            throw new Error('Invalid Shopify integration data')
        }

        // 2. Fetch Products from AURA
        let query = supabase
            .from('products')
            .select('*')
            .eq('business_id', businessId)

        // Optionally filter by specific product IDs
        if (productIds && productIds.length > 0) {
            query = query.in('id', productIds)
        }

        const { data: products, error: prodError } = await query

        if (prodError) throw prodError
        if (!products || products.length === 0) {
            return new Response(JSON.stringify({
                message: "No products to sync",
                synced: 0,
                failed: 0
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 3. Sync to Shopify
        const results = []
        const apiUrl = `https://${shopDomain}/admin/api/2024-01/products.json`

        for (const product of products) {
            const payload = {
                product: {
                    title: product.title,
                    body_html: `<p>${product.description || ''}</p>`,
                    vendor: product.vendor || "AURA Store",
                    product_type: product.category || "General",
                    status: "active",
                    variants: [
                        {
                            price: String(product.selling_price || product.price || 0),
                            compare_at_price: product.compare_at_price ? String(product.compare_at_price) : null,
                            sku: product.sku || product.id,
                            inventory_management: null, // Dropshipping - don't track inventory
                            weight: product.weight || 0,
                            weight_unit: 'lb'
                        }
                    ],
                    images: product.images ? product.images.map((url: string) => ({ src: url })) : [],
                    tags: product.tags?.join(', ') || ''
                }
            }

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': accessToken
                    },
                    body: JSON.stringify(payload)
                })

                const responseData = await response.json()

                if (!response.ok) {
                    results.push({
                        id: product.id,
                        title: product.title,
                        status: 'failed',
                        error: responseData.errors || 'Unknown error'
                    })
                } else {
                    const shopifyProductId = responseData.product?.id

                    // Update product with Shopify ID
                    await supabase
                        .from('products')
                        .update({
                            shopify_product_id: shopifyProductId?.toString(),
                            synced_at: new Date().toISOString(),
                            sync_status: 'synced'
                        })
                        .eq('id', product.id)

                    results.push({
                        id: product.id,
                        title: product.title,
                        status: 'success',
                        shopify_id: shopifyProductId
                    })
                }

            } catch (err: any) {
                results.push({
                    id: product.id,
                    title: product.title,
                    status: 'failed',
                    error: err.message
                })
            }
        }

        return new Response(JSON.stringify({
            success: true,
            shop: shopDomain,
            synced: results.filter(r => r.status === 'success').length,
            failed: results.filter(r => r.status === 'failed').length,
            details: results
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error('[Sync Error]', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
