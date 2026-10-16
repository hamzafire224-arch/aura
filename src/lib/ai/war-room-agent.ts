import { generateContent } from "./providers"
// removed @tavily/core import to fix browser crash

// Initialize Tavily client (client-side safe for demo, but ideally backend)
// Using the key from env or a placeholder if not set
const TAVILY_KEY = import.meta.env.VITE_TAVILY_API_KEY || ""

export type CompetitorData = {
    name: string
    url: string
    pricing: {
        model: string
        pricePoints: string[]
        analysis: string
    }
    ads: {
        activeChannels: string[]
        adCopyExamples: string[]
        strategy: string
    }
    content: {
        topTopics: string[]
        recentPosts: string[]
        gaps: string
    }
    threatLevel: "High" | "Medium" | "Low"
}

export class WarRoomAgent {
    // Client removed, using fetch directly

    constructor() {
        // No init needed
    }

    async analyzeCompetitor(competitorName: string, myBusinessNiche: string): Promise<CompetitorData> {
        // 1. Gather Intelligence via Tavily
        let searchContext = ""

        if (TAVILY_KEY) {
            try {
                const queries = [
                    `${competitorName} pricing page`,
                    `${competitorName} facebook ads library`,
                    `${competitorName} blog top posts`,
                    `${competitorName} reviews`
                ]

                // Execute searches in parallel using direct fetch
                // Tavily supports a 'search' endpoint, doing basic search depth for speed
                const fetchPromises = queries.map(async (q) => {
                    try {
                        const res = await fetch("https://api.tavily.com/search", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                api_key: TAVILY_KEY,
                                query: q,
                                search_depth: "basic",
                                max_results: 2
                            })
                        })

                        if (!res.ok) {
                            const errText = await res.text()
                            throw new Error(`Tavily API error: ${res.status} ${res.statusText} - ${errText}`)
                        }

                        return await res.json()
                    } catch (error) {
                        throw new Error(`Failed query "${q}": ${error instanceof Error ? error.message : String(error)}`)
                    }
                })

                const results = await Promise.allSettled(fetchPromises)

                // Process successful results
                const successfulData = results
                    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
                    .map(r => r.value)

                // Log failures
                results.forEach((r) => {
                    if (r.status === 'rejected') {
                        console.warn("WarRoomAgent: ", r.reason.message)
                    }
                })

                searchContext = successfulData.map(r =>
                    r.results?.map((i: any) => `Title: ${i.title}\nContent: ${i.content}`).join("\n") || ""
                ).join("\n\n")
            } catch (e) {
                console.warn("Tavily search failed, falling back to simulation", e)
            }
        }

        // 2. Analyze with AI
        const prompt = `
            You are a Corporate Spy and Competitive Intelligence Expert.
            
            TASK:
            Analyze this competitor based on the search results (or simulate if results are empty).
            Competitor: "${competitorName}"
            My Niche: "${myBusinessNiche}"
            
            SEARCH CONTEXT:
            ${searchContext}
            
            OUTPUT (JSON ONLY):
            {
                "name": "${competitorName}",
                "url": "https://example.com",
                "pricing": {
                    "model": "Freemium/Subscription/One-time",
                    "pricePoints": ["$10/mo", "$99/mo"],
                    "analysis": "Brief analysis of their pricing strategy vs market."
                },
                "ads": {
                    "activeChannels": ["Facebook", "LinkedIn"],
                    "adCopyExamples": ["Example headline 1", "Example hook 2"],
                    "strategy": "What angle are they using?"
                },
                "content": {
                    "topTopics": ["Topic A", "Topic B"],
                    "recentPosts": ["Title 1", "Title 2"],
                    "gaps": "What are they missing that we can exploit?"
                },
                "threatLevel": "High/Medium/Low"
            }
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    private parseJson(content: string): any {
        try {
            const clean = content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(clean)
        } catch (e) {
            const start = content.indexOf('{')
            const end = content.lastIndexOf('}')
            if (start !== -1 && end !== -1) {
                return JSON.parse(content.substring(start, end + 1))
            }
            throw new Error("Failed to parse JSON")
        }
    }
}
