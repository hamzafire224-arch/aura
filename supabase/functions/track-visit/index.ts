import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { business_id, event_type } = await req.json()

        if (!business_id) {
            throw new Error("Missing business_id")
        }

        if (event_type === 'page_view') {
            // Atomic increment of visitors
            const { error } = await supabase.rpc('increment_visitors', { row_id: business_id })
            if (error) {
                // If RPC doesn't exist (fallback), read-write (race condition prone but works for MVP)
                const { data: b } = await supabase.from('businesses').select('visitors').eq('id', business_id).single()
                await supabase.from('businesses').update({ visitors: (b?.visitors || 0) + 1 }).eq('id', business_id)
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        })
    }
})
