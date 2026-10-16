import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AgentGatewayPayload {
    businessId: string
    agentType?: string
    intent?: string
    prompt: string
    systemPrompt?: string
    model?: string
    creditsCost?: number
}

serve(async (req) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 2. Strict Authentication Guard & JWT Extraction
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ 
                error: 'Missing Authorization header. Authentication required.' 
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const token = authHeader.replace(/^Bearer\s+/i, '').trim()
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) not configured.')
        }

        // Initialize user-scoped client with forwarded JWT to preserve auth context in RPC
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: { Authorization: `Bearer ${token}` },
            },
            auth: {
                persistSession: false,
            },
        })

        // Cryptographically verify token validity with Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) {
            return new Response(JSON.stringify({ 
                error: 'Unauthorized: Invalid, expired, or forged token.' 
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 3. Parse & Validate Ingestion Payload
        const body: AgentGatewayPayload = await req.json()
        const {
            businessId,
            agentType = 'general_agent',
            intent = 'Agent operation execution',
            prompt,
            systemPrompt = 'You are an autonomous AI business operator within the AURA 2.00 ecosystem. Deliver high-impact, actionable, and mathematically grounded business outputs without generic filler or AI cliches.',
            model = 'gpt-4o-mini',
            creditsCost = 1,
        } = body

        if (!businessId) {
            return new Response(JSON.stringify({ 
                error: 'Missing required field: businessId' 
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (!prompt) {
            return new Response(JSON.stringify({ 
                error: 'Missing required field: prompt' 
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const cost = typeof creditsCost === 'number' && creditsCost > 0 ? creditsCost : 1

        // 4. Atomic Credit Deduction via Postgres RPC (Phase 1 Ledger Lock)
        const { data: deductResult, error: rpcError } = await supabase.rpc('atomic_deduct_credits', {
            p_business_id: businessId,
            p_amount: cost,
            p_action_type: agentType,
            p_metadata: {
                intent,
                model,
                user_id: user.id,
                prompt_preview: prompt.substring(0, 100),
            },
        })

        if (rpcError) {
            console.error('RPC atomic_deduct_credits error:', rpcError)
            const isForbidden = rpcError.message?.toLowerCase().includes('unauthorized') ||
                                rpcError.message?.toLowerCase().includes('does not own')

            return new Response(JSON.stringify({ 
                error: rpcError.message || 'Credit verification failed.' 
            }), {
                status: isForbidden ? 403 : 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Check if atomic deduction was rejected due to insufficient credits
        if (deductResult && deductResult.success === false) {
            return new Response(JSON.stringify({ 
                error: 'Insufficient tenant credit balance to execute agent operation.',
                code: 'INSUFFICIENT_CREDITS',
                current_balance: deductResult.current_balance,
                required_amount: deductResult.required_amount,
            }), {
                status: 402, // 402 Payment Required
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 5. LLM Synthesis Orchestration
        const openaiKey = Deno.env.get('OPENAI_API_KEY')
        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')

        let llmOutput = ''
        let activeModelUsed = model

        const isAnthropic = model.toLowerCase().includes('claude')

        if (isAnthropic && anthropicKey) {
            // Anthropic Claude Execution
            activeModelUsed = model || 'claude-3-5-sonnet-20241022'
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': anthropicKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: activeModelUsed,
                    max_tokens: 2048,
                    system: systemPrompt,
                    messages: [
                        { role: 'user', content: prompt },
                    ],
                }),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(`Anthropic API Error: ${errData.error?.message || response.statusText}`)
            }

            const data = await response.json()
            llmOutput = data.content?.[0]?.text || ''

        } else if (openaiKey) {
            // OpenAI GPT Execution
            activeModelUsed = isAnthropic ? 'gpt-4o-mini' : model
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`,
                },
                body: JSON.stringify({
                    model: activeModelUsed,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.7,
                }),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(`OpenAI API Error: ${errData.error?.message || response.statusText}`)
            }

            const data = await response.json()
            llmOutput = data.choices?.[0]?.message?.content || ''

        } else {
            // Fallback Stub for dev / testing when server secrets have not yet been populated
            activeModelUsed = 'simulated-aura-agent'
            llmOutput = `[AURA NEURAL GATEWAY - SIMULATED RESPONSE]\nAgent '${agentType}' completed directive '${intent}'.\n\nDirectives executed successfully. In production, configure OPENAI_API_KEY or ANTHROPIC_API_KEY in your Supabase project Edge Function Secrets to receive live AI outputs.`
        }

        // 6. Return Structured Result & Updated Ledger Balance
        return new Response(JSON.stringify({
            success: true,
            agent_type: agentType,
            intent,
            output: llmOutput,
            credits: {
                deducted: cost,
                new_balance: deductResult.new_balance,
                previous_balance: deductResult.previous_balance,
            },
            telemetry: {
                business_id: businessId,
                user_id: user.id,
                model_used: activeModelUsed,
                timestamp: new Date().toISOString(),
            },
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error('Agent gateway fatal error:', error)
        return new Response(JSON.stringify({ 
            error: error.message || 'Internal Server Error' 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
