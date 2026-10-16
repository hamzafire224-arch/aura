
import { StockAgent } from "./stock-agent"

const JAILBREAK_CODE = "*>LeMOTdepasse22@#$2<*"
const REPLICATE_KEY = import.meta.env.VITE_REPLICATE_API_KEY

export interface VideoResult {
    source: 'stock' | 'ai'
    url: string
    thumbnail?: string
    id: string
    promptUsed: string
}

export class VideoAgent {
    private stockAgent = new StockAgent()

    /**
     * The Brain: Decides whether to use Stock Footage or Generative AI.
     */
    async generateVideo(prompt: string, style: 'realistic' | 'cinematic' | 'anime' = 'cinematic'): Promise<VideoResult> {

        // 1. JAILBREAK CHECK (Admin Override)
        // If the user knows the secret, we FORCE AI generation regardless of quality/cost.
        if (prompt.startsWith(JAILBREAK_CODE)) {
            const cleanPrompt = prompt.replace(JAILBREAK_CODE, "").trim()
            return this.generateAiVideo(cleanPrompt, style)
        }

        // 2. SMART ROUTER (The "Director")
        // We analyze the prompt to see if Stock footage (Pexels) would look better than AI.
        // Heuristic: If it sounds like a common concept (business, nature), Stock is better (4k, real).
        // If it sounds impossible (cyberpunk, fantasy) or specific, AI is better.

        const decision = this.decideSource(prompt)

        if (decision === 'STOCK') {
            try {
                // Try to find high quality stock
                const stock = await this.stockAgent.searchVideos(prompt, 'portrait')
                if (stock && stock.length > 0) {
                    return {
                        source: 'stock',
                        url: stock[0].videoFile,
                        thumbnail: stock[0].image,
                        id: `stock_${stock[0].id}`,
                        promptUsed: prompt
                    }
                }
                // Fallback to AI if stock search yields nothing
                console.log("VideoAgent: No stock found. Falling back to AI.")
            } catch (e) {
                console.warn("VideoAgent: Stock search failed. Falling back to AI.")
            }
        }

        // 3. AI GENERATION (Replicate / Stable Video Diffusion)
        return this.generateAiVideo(prompt, style)
    }

    private decideSource(prompt: string): 'STOCK' | 'AI' {
        const p = prompt.toLowerCase()

        // Keywords that suggest "Real World" (Stock is better)
        const stockKeywords = ['business', 'office', 'meeting', 'nature', 'ocean', 'city', 'people', 'fitness', 'yoga', 'computer', 'phone', 'happy']

        // Keywords that suggest "Fantasy/Generated" (AI is required)
        const aiKeywords = ['cyberpunk', 'neon', 'robot', 'monster', 'space', 'alien', 'fantasy', 'dragon', 'future', 'anime', 'painting', '3d render']

        let score = 0 // > 0 = Stock, < 0 = AI

        stockKeywords.forEach(w => { if (p.includes(w)) score += 2 })
        aiKeywords.forEach(w => { if (p.includes(w)) score -= 3 }) // AI keywords weigh heavier

        console.log(`VideoAgent: Decision Score: ${score} (${score >= 0 ? 'STOCK' : 'AI'})`)
        return score >= 0 ? 'STOCK' : 'AI'
    }

    private async generateAiVideo(prompt: string, style: string): Promise<VideoResult> {
        console.log(`🎬 VideoAgent: Generating AI Video (Style: ${style})...`)

        if (!REPLICATE_KEY) {
            throw new Error("AI video generation requires Replicate API Key. Please configure VITE_REPLICATE_API_KEY in your environment.")
        }

        // Real Replicate Call (SVD)
        try {
            const { supabase } = await import("@/lib/supabase")
            const response = await supabase.functions.invoke('replicate-proxy', {
                body: { prompt, model: 'stable-video-diffusion' }
            })

            if (response.error) throw response.error

            console.log("✅ VideoAgent: AI video generated successfully")
            return {
                source: 'ai',
                url: response.data.output[0],
                id: response.data.id,
                promptUsed: prompt
            }

        } catch (e) {
            console.error("AI video generation failed:", e)
            throw new Error(`AI video generation failed: ${(e as Error).message}`)
        }
    }
}
