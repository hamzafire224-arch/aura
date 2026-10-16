import { scrapeUrl, searchTavily, generateContent } from "@/lib/ai/providers"

export interface TrendReport {
    topic: string
    volume: string
    growth: "explosive" | "steady" | "declining"
    context: string
    sources: string[]
    platform: "tiktok" | "twitter" | "google" | "general"
}

export class TrendScout {
    /**
     * actively scans the web for trends in a specific niche
     */
    async scan(niche: string): Promise<TrendReport[]> {
        console.log(`[TrendScout] Scanning for ${niche} trends...`)

        // Parallel Execution: Search & Scrape
        const [tavilyData, googleTrendsData] = await Promise.all([
            this.searchLiveTrends(niche),
            this.scrapeGoogleTrends(niche)
        ])

        // Synthesize with AI
        const analysis = await generateContent({
            type: "business_strategy",
            userId: "system",
            prompt: `
                Analyze these raw intelligence feeds and extract the Top 5 Viral Trends for the niche "${niche}".
                
                SOURCE 1 (Search): ${tavilyData}
                SOURCE 2 (Google Trends Scrape): ${googleTrendsData}

                Return valid JSON array:
                [{ "topic": "...", "volume": "High/Med", "growth": "explosive", "context": "Why it's viral...", "sources": ["url"], "platform": "tiktok/general" }]
            `
        })

        const trends = this.parseResponse(analysis.content)
        return trends
    }

    private async searchLiveTrends(niche: string) {
        // Use Tavily to get the latest social chatter
        return await searchTavily(`viral tiktok trends ${niche} this week`, "advanced")
    }

    private async scrapeGoogleTrends(niche: string) {
        // Attempt to scrape Google Trends Daily RSS or similar public page
        // Firecrawl is powerful enough to handle this
        try {
            return await scrapeUrl(`https://trends.google.com/trends/explore?q=${encodeURIComponent(niche)}`)
        } catch (e) {
            console.warn("Direct scraping failed, falling back to deep search.")
            return ""
        }
    }

    private parseResponse(text: string): TrendReport[] {
        try {
            // Clean markdown code blocks if present
            const clean = text.replace(/```json/g, "").replace(/```/g, "").trim()
            return JSON.parse(clean)
        } catch (e) {
            console.error("Failed to parse Trend Report JSON", e)
            return []
        }
    }
}
