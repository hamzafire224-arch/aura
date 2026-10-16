import { generateContent, searchTavily } from "./providers"

export interface CompetitorAnalysis {
    name: string
    url: string
    strengths: string[]
    weaknesses: string[]
    pricePoint: 'budget' | 'mid-range' | 'luxury'
}

export interface MarketTrend {
    trend: string
    sentiment: 'positive' | 'negative' | 'neutral'
    impact: string
}

export interface MarketReport {
    niche: string
    competitors: CompetitorAnalysis[]
    trends: MarketTrend[]
    summary: string
}

export class MarketIntelligence {

    /**
     * Scrapes the web for real-time market data on the given niche.
     * Returns a structured report for the Executive Boardroom agents.
     */
    async analyzeNiche(niche: string): Promise<MarketReport> {
        console.log(`[MarketIntelligence] Analyzing niche: ${niche}`)

        // 1. Parallel Search for Competitors and Trends
        const [competitorResults, trendResults] = await Promise.all([
            searchTavily(`top ${niche} brands websites competitors`, 'basic', { maxResults: 4 }),
            searchTavily(`latest trends and customer complaints ${niche} ${new Date().getFullYear()}`, 'basic', { maxResults: 4 })
        ])

        // 2. Synthesize with AI
        const prompt = `
            You are a Market Intelligence Officer. Analyze these raw search results for the niche "${niche}" and produce a strategic briefing.
            
            RAW COMPETITOR DATA:
            ${JSON.stringify(competitorResults.results)}

            RAW TREND DATA:
            ${JSON.stringify(trendResults.results)}

            TASK:
            1. Identify 3 real competitors from the search results.
            2. Infer their strengths/weaknesses based on snippets (e.g. "slow shipping", "premium design").
            3. Identify 2-3 rising trends or common complaints.

            OUTPUT JSON:
            {
                "niche": "${niche}",
                "competitors": [
                    { "name": "Brand A", "url": "...", "strengths": ["..."], "weaknesses": ["..."], "pricePoint": "luxury" }
                ],
                "trends": [
                    { "trend": "Eco-friendly materials", "sentiment": "positive", "impact": "High demand" }
                ],
                "summary": "Brief 2-sentence executive summary of the market state."
            }
        `

        try {
            const response = await generateContent({
                prompt,
                type: 'analysis',
                userId: 'system'
            })

            const clean = response.content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(clean) as MarketReport

        } catch (e) {
            console.error("Market Intelligence Failed", e)
            return this.getFallbackReport(niche)
        }
    }

    private getFallbackReport(niche: string): MarketReport {
        return {
            niche,
            competitors: [
                { name: "Generic Market Leader", url: "#", strengths: ["Brand Awareness"], weaknesses: ["Slow Innovation"], pricePoint: "mid-range" },
                { name: "Cheap Import Alternative", url: "#", strengths: ["Price"], weaknesses: ["Quality Control"], pricePoint: "budget" }
            ],
            trends: [
                { trend: "Digital Experience focus", sentiment: "positive", impact: "Critical" }
            ],
            summary: "Market analysis unavailable. Proceeding with general best practices."
        }
    }
}

export const marketIntelligence = new MarketIntelligence()
