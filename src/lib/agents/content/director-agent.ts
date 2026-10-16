import { generateContent } from "@/lib/ai/providers"
import type { TrendReport } from "./trend-scout"

export interface ContentBrief {
    strategy: "human_shoot" | "stock_remix" | "gen_ai"
    rationale: string
    script: string
    resources: {
        lighting_guide?: string
        stock_keywords?: string[]
        ai_prompt?: string
    }
    viralityScore: number
}

export class DirectorAgent {
    /**
     * Decisions Matrix: Analyzes a trend and decides the best format.
     */
    async direct(trend: TrendReport, businessContext: string): Promise<ContentBrief> {
        console.log(`[Director] Directing content for: ${trend.topic}`)

        const prompt = `
            You are an Oscar-winning Creative Director for a high-end Digital Agency.
            Your client is in the "${businessContext}" niche.
            
            TREND: ${JSON.stringify(trend)}

            DECISION MATRIX:
            1. HUMAN SHOOT: If authenticity, trust, or personal connection is key.
            2. STOCK REMIX: If it's motivational, fast-paced, or generic aesthetic.
            3. GEN AI: If it requires impossible visuals, sci-fi concepts, or dream states.

            TASK:
            1. Decide the Strategy.
            2. Write a Viral Script (TickTok style, under 30s).
            3. Provide specific production resources.
            4. Predict Virality (0-100).
            
            Return JSON:
            {
                "strategy": "human_shoot" | "stock_remix" | "gen_ai",
                "rationale": "I chose X because data shows...",
                "script": "Markdown formatted script...",
                "resources": { ... },
                "viralityScore": 85
            }
        `

        const response = await generateContent({
            type: "social_post",
            userId: "system",
            prompt
        })

        return this.parseBrief(response.content)
    }

    private parseBrief(text: string): ContentBrief {
        try {
            const clean = text.replace(/```json/g, "").replace(/```/g, "").trim()
            return JSON.parse(clean)
        } catch (e) {
            console.error("Director failed to parse JSON", e)
            // Fallback object
            return {
                strategy: "human_shoot",
                rationale: "Parsing failed, defaulting to human connection.",
                script: text,
                resources: { lighting_guide: "Natural Light" },
                viralityScore: 50
            }
        }
    }
}
