import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, businessId, returnUrl, affiliateCode } = await req.json()

    // 1. Verify business exists (and get user if needed, but this is a public store call often)
    const { data: business } = await supabase.from('businesses').select('*').eq('id', businessId).single()
    if (!business) throw new Error("Business not found")

    // 2. Prepare Line Items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.description,
          images: item.images ? [item.images[0]] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: 1,
    }))

    // 3. Prepare metadata with affiliate attribution
    const sessionMetadata: Record<string, string> = {
      businessId: businessId
    }

    // Include affiliate code if present (for commission attribution)
    if (affiliateCode) {
      sessionMetadata.affiliate_code = affiliateCode
      console.log(`💰 Checkout includes affiliate attribution: ${affiliateCode}`)
    }

    // 4. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: sessionMetadata
    })

    // 4. (Optional) Create Pending Order in DB immediately
    await supabase.from('orders').insert({
      business_id: businessId,
      total_amount: items.reduce((sum: number, i: any) => sum + i.price, 0),
      status: 'pending',
      stripe_session_id: session.id,
      items: items
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
