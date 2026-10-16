import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Strict JWT Verification
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401
            })
        }

        const token = authHeader.replace(/^Bearer\s+/i, '')
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401
            })
        }

        const { action, payload } = await req.json()

        const ayrshareKey = Deno.env.get('AYRSHARE_API_KEY')
        if (!ayrshareKey) throw new Error('Missing Ayrshare API Key')

        const baseUrl = "https://app.ayrshare.com/api"

        let response

        if (action === 'post' || action === 'schedule') {
            // Endpoint is same for both in Ayrshare, schedule relies on payload having scheduleDate
            response = await fetch(`${baseUrl}/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ayrshareKey}`
                },
                body: JSON.stringify(payload)
            })
        } else if (action === 'history') {
            response = await fetch(`${baseUrl}/history`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${ayrshareKey}`
                }
            })
        } else {
            throw new Error('Invalid action')
        }

        const data = await response.json()

        if (data.status === 'error') {
            throw new Error(data.message)
        }

        return new Response(JSON.stringify({ success: true, data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
