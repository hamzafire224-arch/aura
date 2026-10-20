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
    stream?: boolean
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
            systemPrompt: initialSystemPrompt = 'You are an autonomous AI business operator within the AURA 2.00 ecosystem. Deliver high-impact, actionable, and mathematically grounded business outputs without generic filler or AI cliches.',
            model = 'gpt-4o-mini',
            creditsCost = 1,
            stream: requestStream = true,
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

        // 4. Brand Memory Injection: Fetch Business Context
        let systemPrompt = initialSystemPrompt
        try {
            const { data: business, error: bizError } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', businessId)
                .single()

            if (bizError) {
                console.warn('Brand Memory fetch notice:', bizError.message || bizError)
            } else if (business) {
                systemPrompt = `${initialSystemPrompt}

--- VERIFIED BRAND CONTEXT ---
You are executing this directive for the following business entity. You MUST adopt their context implicitly:
- Brand Name: ${business.name || 'Unnamed Entity'}
- Industry: ${business.industry || 'General Commerce'}
- Target Audience: ${business.target_audience || 'Not specified'}
- Current Monthly Revenue: $${business.monthly_revenue || 0}`
            }
        } catch (err: any) {
            console.warn('Failed to inject brand memory context:', err.message || err)
        }

        const cost = typeof creditsCost === 'number' && creditsCost > 0 ? creditsCost : 1

        // 5. Atomic Credit Deduction via Postgres RPC (Phase 1 Ledger Lock)
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

        // 6. LLM Synthesis Orchestration
        const openaiKey = Deno.env.get('OPENAI_API_KEY')
        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
        const isAnthropic = model.toLowerCase().includes('claude')
        const shouldStream = requestStream !== false

        const streamHeaders = {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        }

        // Handle streaming response (SSE)
        if (shouldStream) {
            if (isAnthropic && anthropicKey) {
                const activeModelUsed = model || 'claude-3-5-sonnet-20241022'
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
                        messages: [{ role: 'user', content: prompt }],
                        stream: true,
                    }),
                })

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}))
                    throw new Error(`Anthropic API Error: ${errData.error?.message || response.statusText}`)
                }

                const stream = new ReadableStream({
                    async start(controller) {
                        const reader = response.body?.getReader()
                        if (!reader) {
                            controller.close()
                            return
                        }
                        const decoder = new TextDecoder()
                        const encoder = new TextEncoder()
                        let buffer = ''

                        try {
                            while (true) {
                                const { done, value } = await reader.read()
                                if (done) break

                                buffer += decoder.decode(value, { stream: true })
                                const lines = buffer.split('\n')
                                buffer = lines.pop() ?? ''

                                for (const line of lines) {
                                    const trimmed = line.trim()
                                    if (!trimmed || trimmed.startsWith(':')) continue
                                    if (trimmed.startsWith('data: ')) {
                                        const dataStr = trimmed.slice(6)
                                        try {
                                            const parsed = JSON.parse(dataStr)
                                            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: parsed.delta.text })}\n\n`))
                                            } else if (parsed.type === 'message_stop') {
                                                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                                            }
                                        } catch {
                                            // ignore partial JSON parse error
                                        }
                                    }
                                }
                            }
                            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                        } catch (err: any) {
                            console.error('Anthropic stream processing error:', err)
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message || 'Stream processing error' })}\n\n`))
                        } finally {
                            controller.close()
                        }
                    }
                })

                return new Response(stream, { headers: streamHeaders })

            } else if (openaiKey) {
                const activeModelUsed = isAnthropic ? 'gpt-4o-mini' : model
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
                        stream: true,
                    }),
                })

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}))
                    throw new Error(`OpenAI API Error: ${errData.error?.message || response.statusText}`)
                }

                const stream = new ReadableStream({
                    async start(controller) {
                        const reader = response.body?.getReader()
                        if (!reader) {
                            controller.close()
                            return
                        }
                        const decoder = new TextDecoder()
                        const encoder = new TextEncoder()
                        let buffer = ''

                        try {
                            while (true) {
                                const { done, value } = await reader.read()
                                if (done) break

                                buffer += decoder.decode(value, { stream: true })
                                const lines = buffer.split('\n')
                                buffer = lines.pop() ?? ''

                                for (const line of lines) {
                                    const trimmed = line.trim()
                                    if (!trimmed || trimmed.startsWith(':')) continue
                                    if (trimmed === 'data: [DONE]') {
                                        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                                        continue
                                    }
                                    if (trimmed.startsWith('data: ')) {
                                        const dataStr = trimmed.slice(6)
                                        try {
                                            const parsed = JSON.parse(dataStr)
                                            const token = parsed.choices?.[0]?.delta?.content
                                            if (token) {
                                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
                                            }
                                        } catch {
                                            // ignore partial JSON parse error
                                        }
                                    }
                                }
                            }
                            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                        } catch (err: any) {
                            console.error('OpenAI stream processing error:', err)
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message || 'Stream processing error' })}\n\n`))
                        } finally {
                            controller.close()
                        }
                    }
                })

                return new Response(stream, { headers: streamHeaders })

            } else {
                // Fallback Stub for dev / testing when server secrets have not yet been populated
                const simulatedOutput = `[AURA NEURAL GATEWAY - SIMULATED RESPONSE]\nAgent '${agentType}' completed directive '${intent}'.\n\nDirectives executed successfully with verified brand memory. In production, configure OPENAI_API_KEY or ANTHROPIC_API_KEY in your Supabase project Edge Function Secrets to receive live AI outputs.`
                const encoder = new TextEncoder()
                const stream = new ReadableStream({
                    async start(controller) {
                        try {
                            const tokens = simulatedOutput.split(/(?<=\s+)/)
                            for (const token of tokens) {
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
                                await new Promise((r) => setTimeout(r, 25))
                            }
                            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                        } catch (err: any) {
                            console.error('Simulated stream error:', err)
                        } finally {
                            controller.close()
                        }
                    }
                })

                return new Response(stream, { headers: streamHeaders })
            }
        }

        // Non-streaming fallback (if stream: false was explicitly requested)
        let llmOutput = ''
        let activeModelUsed = model

        if (isAnthropic && anthropicKey) {
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
                    messages: [{ role: 'user', content: prompt }],
                }),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(`Anthropic API Error: ${errData.error?.message || response.statusText}`)
            }

            const data = await response.json()
            llmOutput = data.content?.[0]?.text || ''

        } else if (openaiKey) {
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
            activeModelUsed = 'simulated-aura-agent'
            llmOutput = `[AURA NEURAL GATEWAY - SIMULATED RESPONSE]\nAgent '${agentType}' completed directive '${intent}'.\n\nDirectives executed successfully with verified brand memory. In production, configure OPENAI_API_KEY or ANTHROPIC_API_KEY in your Supabase project Edge Function Secrets to receive live AI outputs.`
        }

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
