import { searchTavily, generateContent } from "@/lib/ai/providers"
import type { ListenerReport } from "./types"

export class ListenerAgent {

    static async listen(domain: string): Promise<ListenerReport> {
        console.log(`[Listener] Scanning frequency for ${domain}...`)

        const brandName = domain.split('.')[0]

        // 1. Search for real user feedback
        const query = `site:reddit.com OR site:twitter.com OR site:trustpilot.com "${brandName}" review complaint scam love`
        const searchResults = await searchTavily(query, "basic")

        // 2. Sentiment Analysis
        const prompt = `
            You are "The Listener", a social listening intelligence agent.
            
            SEARCH DATA:
            ${searchResults}
            
            TASK:
            1. Analyze the sentiment (-100 to 100).
            2. Extract 3 specific complaints (what do people HATE?).
            3. Extract 3 specific praises (what do people LOVE?).
            
            OUTPUT JSON:
            {
                "sentimentScore": number,
                "complaints": ["string"],
                "praises": ["string"],
                "platforms": ["Reddit", "Twitter", etc]
            }
        `

        try {
            const response = await generateContent({
                prompt,
                type: 'business_strategy',
                userId: 'system',
                preferredProvider: 'auto'
            })

            const cleanJson = response.content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(cleanJson)
        } catch (error) {
            console.error("[Listener] Analysis failed:", error)
            return {
                sentimentScore: 0,
                complaints: ["No significant data found"],
                praises: ["No significant data found"],
                platforms: []
            }
        }
    }
}
