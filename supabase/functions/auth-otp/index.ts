
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

// Crypto helper to hash the OTP
async function hashOtp(otp: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(otp)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { action, email, code } = await req.json()

        if (!email) {
            throw new Error('Email is required')
        }

        if (action === 'send') {
            // 1. Generate secure random 6-digit code
            const randomBuffer = new Uint32Array(1)
            crypto.getRandomValues(randomBuffer)
            const otp = (randomBuffer[0] % 900000 + 100000).toString()

            // 2. Hash it
            const codeHash = await hashOtp(otp)

            // 3. Store in DB with 15m expiry (uses service role to write to restricted table)
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

            // Invalidate old codes for this email
            await supabase.from('verification_codes').delete().eq('email', email)

            const { error: dbError } = await supabase.from('verification_codes').insert({
                email,
                code_hash: codeHash,
                expires_at: expiresAt
            })

            if (dbError) throw dbError

            // 4. Send email via Resend
            if (!RESEND_API_KEY) {
                console.log(`[MOCK EMAIL SERVER-SIDE] To: ${email}, Code: ${otp}`)
                return new Response(JSON.stringify({ success: true, mock: true }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                })
            }

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'AURA <onboarding@aura-platform.com>',
                    to: [email],
                    subject: 'Verify your AURA account',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Welcome to AURA!</h2>
                            <p>Here is your secure verification code:</p>
                            <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
                                ${otp}
                            </div>
                            <p>This code will expire in 15 minutes.</p>
                        </div>
                    `
                })
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Resend API Error: ${errorText}`)
            }

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        if (action === 'verify') {
            if (!code) throw new Error('Code is required')

            // 1. Hash input code
            const inputHash = await hashOtp(code)

            // 2. Fetch valid code from DB
            const { data, error } = await supabase
                .from('verification_codes')
                .select('*')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (error || !data) {
                return new Response(JSON.stringify({ error: 'Invalid or expired code', valid: false }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            // 3. Verify Match & Expiry
            if (data.code_hash !== inputHash) {
                return new Response(JSON.stringify({ error: 'Invalid code', valid: false }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            if (new Date(data.expires_at) < new Date()) {
                return new Response(JSON.stringify({ error: 'Code expired', valid: false }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            // 4. Burn the code (prevent replay)
            await supabase.from('verification_codes').delete().eq('id', data.id)

            // Return success token (opaque)
            return new Response(JSON.stringify({
                success: true,
                valid: true,
                token: 'verified_session_' + crypto.randomUUID() // Simplified opaque token
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        throw new Error('Invalid action')

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
