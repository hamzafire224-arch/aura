import { generateContent } from "./providers"
import { tavily } from "@tavily/core"

const TAVILY_KEY = import.meta.env.VITE_TAVILY_API_KEY || ""

export type Lead = {
    name: string
    website: string
    location: string
    snippet: string
}

export type Audit = {
    score: number
    issues: string[]
    opportunity: string
}

export class RainmakerAgent {
    private client: any

    constructor() {
        if (TAVILY_KEY) {
            this.client = tavily({ apiKey: TAVILY_KEY })
        }
    }

    /**
     * Step 1: Find Leads
     */
    async findLeads(niche: string, location: string): Promise<Lead[]> {
        if (!this.client) {
            // Simulation for demo
            return [
                { name: `${niche} Pros`, website: `www.${niche.toLowerCase().replace(/\s/g, '')}pros.com`, location, snippet: "Local service provider." },
                { name: `Elite ${niche}`, website: `www.elite${niche.toLowerCase().replace(/\s/g, '')}.com`, location, snippet: "Premium services." },
                { name: `${location} ${niche}`, website: `www.${location.toLowerCase()}${niche.toLowerCase().replace(/\s/g, '')}.com`, location, snippet: "Established local business." },
            ]
        }

        try {
            const query = `${niche} businesses in ${location} with website`
            const response = await this.client.search(query, {
                search_depth: "basic",
                max_results: 5,
                include_domains: []
            })

            return response.results.map((r: any) => ({
                name: r.title,
                website: r.url,
                location: location,
                snippet: r.content
            }))
        } catch (error) {
            console.warn("Tavily search failed", error)
            return []
        }
    }

    /**
     * Step 2: Audit Website (Simulated Analysis)
     */
    async auditWebsite(lead: Lead): Promise<Audit> {
        const prompt = `
            You are a Digital Marketing Auditor.
            
            TASK:
            Analyze this business based on their snippet and niche.
            Business: ${lead.name}
            Snippet: ${lead.snippet}
            
            OUTPUT (JSON ONLY):
            {
                "score": 0-100,
                "issues": ["Slow load speed", "No Facebook Pixel", "Weak SEO"],
                "opportunity": "They are missing out on retargeting ads."
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

    /**
     * Step 3: Generate Outreach
     */
    async generateOutreach(lead: Lead, audit: Audit, myService: string): Promise<string> {
        const prompt = `
            You are a Cold Outreach Expert.
            
            TASK:
            Write a personalized email to ${lead.name}.
            My Service: ${myService}
            Their Issues: ${audit.issues.join(", ")}
            Opportunity: ${audit.opportunity}
            
            TONE: Professional, helpful, not spammy.
            
            OUTPUT:
            Subject: ...
            Body: ...
        `

        const result = await generateContent({
            prompt,
            type: 'copywriting',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return result.content
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
            return { score: 50, issues: ["Could not analyze"], opportunity: "General improvement" }
        }
    }
}
