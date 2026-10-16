import { generateContent, searchTavily } from "@/lib/ai/providers"

export interface MarketResearch {
    blueOcean: string
    competitors: { name: string, weakness: string }[]
    targetAudience: string
    uniqueSellingPoint: string
}

export class StrategistAgent {
    async analyze(idea: string): Promise<MarketResearch> {
        console.log(`[Strategist] Scanning market for: ${idea}`)

        // 1. Live Research
        const searchResults = await searchTavily(`competitors for ${idea} business model weaknesses`, "advanced")

        // 2. Strategic Synthesis
        const prompt = `
            You are a World-Class Business Strategist.
            USER IDEA: "${idea}"
            MARKET DATA: ${searchResults}

            Task:
            1. Identify 3 real competitors and their specific weaknesses (e.g., "Generic branding", "Slow shipping").
            2. Define a "Blue Ocean" strategy (a gap nobody is filling).
            3. Define the precise Target Audience (Psychographics, not just demographics).
            4. Craft a Killer USP (Unique Selling Proposition).

            Return JSON:
            {
                "blueOcean": "...",
                "competitors": [{ "name": "...", "weakness": "..." }],
                "targetAudience": "...",
                "uniqueSellingPoint": "..."
            }
        `

        const response = await generateContent({
            type: "business_strategy",
            userId: "system",
            prompt
        })

        return JSON.parse(response.content.replace(/```json/g, "").replace(/```/g, "").trim())
    }
}
