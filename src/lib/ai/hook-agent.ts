import { generateContent } from "./providers"
// removed @tavily/core import to fix browser crash

const TAVILY_KEY = import.meta.env.VITE_TAVILY_API_KEY || ""

export type Hook = {
    id: string
    headline: string
    explanation: string
    format: "Storytime" | "List" | "Controversial" | "Educational" | "Visual"
    scriptTemplate: string
    viralScore: number
    sourceUrl?: string
}

export class HookAgent {
    // Client removed, using fetch directly

    constructor() {
        // No init needed
    }

    async findHooks(niche: string): Promise<Hook[]> {
        console.log(`HookAgent: Hunting for viral hooks in ${niche}...`)

        let searchContext = ""

        // 1. Live Search for Trends
        if (TAVILY_KEY && TAVILY_KEY !== 'tvly-xxxxxxxxxxxx') {
            try {
                const query = `trending tiktok hooks for ${niche} ${new Date().getFullYear()} viral content ideas`

                // Direct fetch to avoid @tavily/core browser compatibility issues
                const response = await fetch("https://api.tavily.com/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        api_key: TAVILY_KEY,
                        query,
                        search_depth: "advanced",
                        include_domains: ["tiktok.com", "instagram.com", "youtube.com", "medium.com", "reddit.com"],
                        max_results: 5
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    searchContext = data.results.map((r: any) =>
                        `Source: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`
                    ).join("\n\n")
                } else {
                    console.warn("HookAgent: Tavily API request failed", response.statusText)
                }

            } catch (e) {
                console.warn("HookAgent: live search failed", e)
            }
        }

        // 2. AI Synthesis & Extraction
        // If search failed, AI will rely on its internal training (fallback logic handled prompt-side)
        const prompt = `
            You are a Viral Content Strategist (TikTok/Reels Expert).
            
            TASK:
            Identify 5 high-potential "Hooks" for the niche: "${niche}".
            Use the provided Search Context if available. If not, use your knowledge of current viral formats.
            
            SEARCH CONTEXT:
            ${searchContext || "No live data available. Use general viral principles."}
            
            REQUIREMENTS:
            - Hooks must be "Stop Scrolling" lines.
            - Provide a proven template for the script.
            - Assign a "Format" type.
            
            OUTPUT (JSON Array):
            [
                {
                    "id": "1",
                    "headline": "Stop doing [Common Mistake]...",
                    "explanation": "Plays on fear of being wrong.",
                    "format": "Educational",
                    "scriptTemplate": "Stop doing X. It's killing your Y. Instead, try Z. Here is why...",
                    "viralScore": 95
                }
            ]
        `

        const result = await generateContent({
            prompt,
            type: 'creative_writing',
            userId: 'system',
            preferredProvider: 'auto'
        })

        try {
            const cleanJson = result.content.replace(/```json\n?|\n?```/g, '').trim()
            const hooks = JSON.parse(cleanJson)
            return hooks.map((h: any) => ({
                ...h,
                id: crypto.randomUUID(),
                sourceUrl: searchContext ? "Live Web Search" : "AI Trend Database"
            }))
        } catch (e) {
            console.error("HookAgent: JSON parse failed", e)
            return [] // Fail gracefully
        }
    }
}
