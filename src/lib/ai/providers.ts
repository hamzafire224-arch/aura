import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenAI } from '@google/genai'
import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

// Initialize clients
const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY
const geminiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY
const openaiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!anthropicKey || !geminiKey) {
    // Client-side AI execution requires keys or delegation to backend RPC
}

// Lazy initialization for clients
let anthropic: Anthropic | null = null
let gemini: GoogleGenAI | null = null

function getAnthropic() {
    if (!anthropic) {
        anthropic = new Anthropic({
            apiKey: anthropicKey || 'dummy_key',
            dangerouslyAllowBrowser: true // Required for client-side if not proxied
        } as any)
    }
    return anthropic
}

function getGemini() {
    if (!gemini) {
        gemini = new GoogleGenAI({ apiKey: geminiKey || 'dummy_key' })
    }
    return gemini
}

// Cost tracking (per 1M tokens)
const PRICING = {
    claude: {
        input: 3.00,
        output: 15.00
    },
    gemini: {
        input: 0.50,
        output: 1.50
    }
}

// Rate limiting
// Rate limiting
const lastCallTimes = new Map<string, number>()
const MIN_INTERVAL = 1000 // 1 second (relaxed from 5s)

// Smart routing based on complexity
export async function generateContent({
    prompt,
    type,
    userId,
    businessId,
    preferredProvider = 'auto' // Note: For specialized agents (Shopify/Social), we now route via Supabase Edge Functions
}: {
    prompt: string
    type: string
    userId: string
    businessId?: string
    preferredProvider?: 'claude' | 'gemini' | 'auto'
}) {
    // Rate Limit Check
    const now = Date.now()

    // Skip rate check for system calls
    if (userId !== 'system') {
        const lastCallTime = lastCallTimes.get(userId) || 0

        if (now - lastCallTime < MIN_INTERVAL) {
            throw new Error(`Please wait ${Math.ceil((MIN_INTERVAL - (now - lastCallTime)) / 1000)}s before generating again.`)
        }

        lastCallTimes.set(userId, now)
    }

    // Cleanup stale entries
    for (const [key, timestamp] of lastCallTimes.entries()) {
        if (now - timestamp > MIN_INTERVAL * 2) {
            lastCallTimes.delete(key)
        }
    }

    // Determine which provider to use
    let provider = preferredProvider

    if (preferredProvider === 'auto') {
        // Force Gemini for client-side execution to avoid CORS issues with Anthropic
        provider = 'gemini'
    }

    let result
    let tokensUsed = 0
    let cost = 0

    try {
        if (provider === 'claude') {
            result = await generateWithClaude(prompt, type)
            tokensUsed = result.usage.totalTokens
            cost = calculateCost(result.usage.inputTokens, result.usage.outputTokens, 'claude')
        } else {
            result = await generateWithGemini(prompt, type)
            tokensUsed = result.usage.totalTokens
            cost = calculateCost(result.usage.totalTokens, 0, 'gemini')
        }

        // Log usage
        await logAIUsage({
            userId,
            businessId,
            provider,
            feature: type,
            tokensUsed,
            cost,
            success: true
        })

        return {
            content: result.content,
            provider,
            tokensUsed,
            cost
        }

    } catch (error: any) {
        // Fallback to other provider
        console.error(`[AI_ERROR] ${provider} failed:`, error)

        // If we already tried the fallback or if it's a key error, throw
        if (error.message.includes("API Key")) {
            throw error
        }

        try {
            if (provider === 'claude') {
                console.log("Falling back to Gemini...")
                result = await generateWithGemini(prompt, type)
                provider = 'gemini'
            } else {
                // Don't fallback to Claude in browser (CORS)
                // console.log("Falling back to Claude...")
                // result = await generateWithClaude(prompt, type)
                // provider = 'claude'
                throw error // Re-throw if Gemini fails
            }

            return {
                content: result.content,
                provider,
                tokensUsed: result.usage?.totalTokens || 0
            }
        } catch (fallbackError) {
            console.error("All AI providers failed")
            throw fallbackError
        }
    }
}

async function generateWithClaude(prompt: string, type: string) {
    const systemPrompt = getSystemPrompt(type)

    const message = await getAnthropic().messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: getMaxTokens(type),
        temperature: getTemperature(type),
        system: systemPrompt,
        messages: [{
            role: 'user',
            content: prompt
        }]
    })

    const totalTokens = message.usage.input_tokens + message.usage.output_tokens

    return {
        content: (message.content[0] as any).text,
        usage: {
            inputTokens: message.usage.input_tokens,
            outputTokens: message.usage.output_tokens,
            totalTokens: totalTokens
        }
    }
}

async function generateWithGemini(prompt: string, type: string) {
    const systemPrompt = getSystemPrompt(type)
    const errors: Record<string, string> = {}

    // Try multiple Gemini models in order of preference
    const modelsToTry = [
        'gemini-2.5-flash',     // User specified (Priority 1)
        'gemini-2.0-flash-exp', // Latest Experimental (Fastest)
        'gemini-1.5-flash',     // Standard Flash (Stable)
        'gemini-1.5-pro'        // Standard Pro (High IQ)
    ]

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting generation with model: ${modelName}`)

            const response = await getGemini().models.generateContent({
                model: modelName,
                config: {
                    temperature: getTemperature(type),
                    maxOutputTokens: getMaxTokens(type),
                    systemInstruction: systemPrompt
                },
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }]
                    }
                ]
            })

            const content = (response as any).text || (response as any).candidates?.[0]?.content?.parts?.[0]?.text || ''
            const totalTokens = (response as any).usageMetadata?.totalTokenCount || 0

            return {
                content: content,
                usage: {
                    inputTokens: 0,
                    outputTokens: totalTokens,
                    totalTokens: totalTokens
                }
            }
        } catch (error: any) {
            console.warn(`Gemini model ${modelName} failed:`, error.message)
            errors[modelName] = error.message
        }
    }

    // If all generation attempts failed, try to list available models to help debugging
    let availableModelsList = 'Could not list models';
    try {
        console.log("Attempting to list available models...");
        const listResponse = await getGemini().models.list();
        // The response structure depends on the SDK version, handling safely
        const models = (listResponse as any).models || (listResponse as any).data?.models || [];
        if (Array.isArray(models)) {
            availableModelsList = models.map((m: any) => m.name?.replace('models/', '') || m.displayName).join(', ');
        } else {
            availableModelsList = JSON.stringify(listResponse).substring(0, 200);
        }
    } catch (listError: any) {
        console.error("Failed to list models:", listError);
        availableModelsList = `List failed: ${listError.message}`;
    }

    const primaryError = errors['gemini-1.5-flash'] || Object.values(errors)[0]
    throw new Error(`All AI models failed. Available models for your key: [${availableModelsList}]. Primary error: ${primaryError}.`)
}

// System prompts for different types
function getSystemPrompt(type: string): string {
    const prompts: Record<string, string> = {
        business_strategy: `You are AURA, an expert business strategist. You provide actionable, data-driven advice for online businesses. Be specific, practical, and optimistic.`,

        product_description: `You are a skilled copywriter specializing in e-commerce. Write compelling, SEO-optimized descriptions that highlight benefits. Use persuasive language and CTAs.`,

        social_post: `You are a social media expert. Create engaging, platform-appropriate content. Use hooks, storytelling, and calls-to-action. Include relevant emojis.`,

        blog_post: `You are an experienced content writer. Create well-structured, informative blog posts with clear headings and actionable insights.`,

        financial_planning: `You are a financial educator (not advisor). Explain concepts clearly and provide educational scenarios. Always include disclaimers.`,

        ad_copy: `You are a direct response copywriter. Create attention-grabbing ad copy that drives action. Use proven frameworks like AIDA.`,

        brand_identity: `You are a brand strategist. Create cohesive brand identities that resonate with target audiences. Be creative yet strategic.`
    }

    return prompts[type] || 'You are AURA, a helpful AI business assistant.'
}

function getMaxTokens(type: string): number {
    const tokens: Record<string, number> = {
        business_strategy: 8192,
        product_description: 1024,
        social_post: 512,
        blog_post: 8192,
        financial_planning: 4096,
        ad_copy: 512,
        brand_identity: 8192
    }
    return tokens[type] || 4096
}

function getTemperature(type: string): number {
    // Creative tasks = higher temperature
    const creative = ['social_post', 'blog_post', 'ad_copy', 'brand_identity']
    return creative.includes(type) ? 0.8 : 0.5
}

function calculateCost(inputTokens: number, outputTokens: number, provider: 'claude' | 'gemini'): number {
    const pricing = PRICING[provider]
    return (inputTokens / 1000000 * pricing.input) + (outputTokens / 1000000 * pricing.output)
}

// Supabase import moved to top

// ... existing imports ...

export const CREDIT_COSTS = {
    // Per Unit Costs
    WORDS_100: 1,      // 1 credit per 100 words (GPT-4o)
    SEARCH: 5,         // 5 credits per search (Tavily)
    IMAGE: 40,         // 40 credits per image (DALL-E 3)
    VOICE_MIN: 10,     // 10 credits per minute (ElevenLabs)
    AUDIT: 25,         // 25 credits per competitor audit
    LEAD: 50,          // 50 credits per lead enriched
    CAMPAIGN: 350,     // 7-day campaign (Combo of above)
    HOOK_SEARCH: 5     // 5 credits (Viral Hook)
}

// ... existing code ...

// Real logAIUsage implementation
async function logAIUsage(data: {
    userId: string
    businessId?: string
    provider: string
    feature: string
    tokensUsed: number
    cost: number
    success: boolean
    errorMessage?: string
}) {
    if (!data.userId) return

    const { error } = await supabase
        .from('ai_usage')
        .insert([{
            user_id: data.userId,
            business_id: data.businessId,
            provider: data.provider,
            feature: data.feature,
            tokens_used: data.tokensUsed,
            cost: data.cost,
            success: data.success,
            error_message: data.errorMessage
        }])

    if (error) {
        console.error("Failed to log AI usage:", error)
    }
}

// ... existing imports ...
// Removed @tavily/core import to prevent "Class extends value undefined" browser crash

// ... existing code ...

// ... existing code ...

const TAVILY_KEY = import.meta.env.VITE_TAVILY_API_KEY
const FIRECRAWL_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY

// ... existing code ...

// --- INTELLIGENCE PROVIDERS ---

export async function searchTavily(query: string, depth: 'basic' | 'advanced' = 'basic', options: Record<string, any> = {}) {
    if (!TAVILY_KEY) {
        console.warn("Search Agent: No Tavily Key. Simulating.")
        await new Promise(r => setTimeout(r, 1000))
        return `[Simulation] Search results for: ${query}. Competitors are aggressive. Pricing is high.`
    }

    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: TAVILY_KEY,
                query: query,
                search_depth: depth,
                include_answer: true,
                ...options
            })
        })

        if (!response.ok) {
            throw new Error(`Tavily API Error: ${response.statusText}`)
        }

        const data = await response.json()
        return data.answer || data.results.map((r: any) => r.content).join("\n\n")

    } catch (error) {
        console.error("Search failed:", error)
        throw new Error("Failed to search live data.")
    }
}

export async function scrapeUrl(url: string) {
    if (!FIRECRAWL_KEY) {
        console.warn("Scraper Agent: No Firecrawl Key. Simulating.")
        await new Promise(r => setTimeout(r, 1500))
        return `[Simulation] Scraped content from ${url}. They offer 3 plans: Basic ($29), Pro ($99), Enterprise (Contact Us).`
    }

    try {
        const response = await fetch("https://api.firecrawl.dev/v0/scrape", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${FIRECRAWL_KEY}`
            },
            body: JSON.stringify({
                url: url,
                pageOptions: {
                    onlyMainContent: true
                }
            })
        })

        const data = await response.json()
        if (!data.success) {
            throw new Error(data.error || "Failed to scrape URL")
        }

        return data.data.markdown || data.data.content
    } catch (error) {
        console.error("Scrape failed:", error)
        throw new Error("Failed to scrape target website.")
    }
}


let openai: OpenAI | null = null

function getOpenAI() {
    if (!openai) {
        openai = new OpenAI({
            apiKey: openaiKey || 'dummy_key',
            dangerouslyAllowBrowser: true
        })
    }
    return openai
}

export async function generateImage(prompt: string, size: 'square' | 'wide' | 'vertical' = 'square') {
    if (!openaiKey) {
        console.warn("Visual Agent: No OpenAI Key. Simulating.")
        await new Promise(r => setTimeout(r, 2000))
        // Return a placeholder that looks good
        return `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2665&auto=format&fit=crop`
    }

    try {
        // DALL-E 3 only supports 1024x1024, 1024x1792, 1792x1024
        const realSize = size === 'wide' ? '1792x1024' : size === 'vertical' ? '1024x1792' : '1024x1024'

        const response = await getOpenAI().images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: realSize as any,
            quality: "hd",
            style: "vivid"
        })

        return response.data?.[0]?.url || ''
    } catch (error: any) {
        console.error("Image Gen failed:", error)
        if (error.message?.includes("billing")) {
            throw new Error("AI Billing Limit Reached. Please upgrade OpenAI plan.")
        }
        if (error.message?.includes("safety")) {
            throw new Error("Content Policy Violation. Please refine your prompt.")
        }
        throw new Error("Failed to generate image.")
    }
}

