import { generateContent } from "../providers"

const TAVILY_KEY = import.meta.env.VITE_TAVILY_API_KEY

export type ResearchResult = {
    source: string
    summary: string
    key_points: string[]
    trends: string[]
    references: Array<{ title: string, url: string }>
}

export class ContentStrategistAgent {

    /**
     * Performs deep research on a topic using Tavily Search + LLM Synthesis.
     */
    async research(topic: string, depth: 'basic' | 'deep' = 'basic'): Promise<ResearchResult> {
        console.log(`[Strategist] Researching: ${topic} (${depth})`)

        let searchContext = ""
        let references: any[] = []

        // 1. Live Web Search (if Key exists)
        if (TAVILY_KEY && TAVILY_KEY !== 'tvly-xxxxxxxxxxxx') {
            try {
                const searchData = await this.performTavilySearch(topic, depth)
                searchContext = searchData.context
                references = searchData.results.map((r: any) => ({ title: r.title, url: r.url }))
            } catch (error) {
                console.warn("[Strategist] Tavily search failed, falling back to knowledge base.", error)
            }
        } else {
            console.log("[Strategist] No Tavily key, using internal knowledge base.")
        }

        // 2. Synthesize with LLM
        const prompt = `
            You are a World-Class Content Strategist and Researcher.
            
            TOPIC: "${topic}"
            CONTEXT (Live Search Data): 
            ${searchContext || "No live data available. Use your internal knowledge base."}
            
            TASK:
            Analyze the topic and provide a strategic research brief.
            Identify key trends, interesting angles, and viral potential.
            
            OUTPUT (JSON ONLY):
            {
                "source": "Live Web Search" or "Internal Knowledge",
                "summary": "2-3 sentence executive summary.",
                "key_points": ["Point 1", "Point 2", "Point 3"],
                "trends": ["Trend A", "Trend B"],
                "references": [ ...passed through from context... ]
            }
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        try {
            const data = JSON.parse(result.content.replace(/```json\n?|\n?```/g, '').trim())
            // Merge references if LLM dropped them
            if (references.length > 0) {
                data.references = references.slice(0, 5)
                data.source = "Live Web Search + AI Analysis"
            }
            return data
        } catch (e) {
            console.error("[Strategist] Failed to parse JSON", e)
            throw new Error("Failed to synthesize research.")
        }
    }

    private async performTavilySearch(query: string, depth: string) {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: TAVILY_KEY,
                query: query,
                search_depth: depth === 'deep' ? "advanced" : "basic",
                include_answer: true,
                max_results: 5
            })
        })

        if (!response.ok) throw new Error("Tavily API failed")

        const data = await response.json()
        const context = data.results.map((r: any) => `Title: ${r.title}\nContent: ${r.content}`).join("\n\n")

        return { results: data.results, context }
    }
}
