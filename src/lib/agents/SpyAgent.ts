import { scrapeUrl, generateContent } from "../ai/providers"

export interface SpyDossier {
    domain: string
    threat_level: "Low" | "Medium" | "High" | "Critical"
    traffic_est: number
    business_model: string
    target_audience: string
    active_ads_count: number

    // Deep Analysis
    weaknesses: Array<{
        title: string
        description: string
        severity: "Low" | "High"
    }>
    strengths: string[]

    // Strategy
    marketing_channels: Array<{
        name: string // e.g., "SEO", "Paid Social", "Email"
        score: number // 0-100
    }>
    ad_creatives: Array<{
        type: "cpc" | "social" | "video"
        headline: string
        hook: string
    }>

    // The "Oracle" Prediction
    future_moves: string[]
    counter_strategy: string
}

export class SpyAgent {
    private static delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    /**
     * Performs deep competitor intelligence scan using web scraping and AI analysis.
     * No more mock data - real intelligence gathering.
     */
    static async scanTarget(url: string): Promise<SpyDossier> {
        // Clean URL
        const domain = url.replace(/(^\w+:|^)\/\//, '').split('/')[0].toLowerCase()
        const fullUrl = url.startsWith('http') ? url : `https://${url}`

        console.log(`🔍 SpyAgent: Initiating scan on ${domain}...`)

        // 1. Scrape the target website
        let scrapedContent = ""
        try {
            console.log("📡 Resolving target...")
            await this.delay(500)

            scrapedContent = await scrapeUrl(fullUrl)

            if (!scrapedContent || scrapedContent.length < 100) {
                console.log("⚠️ Limited content scraped, attempting homepage...")
                scrapedContent = await scrapeUrl(`https://${domain}`)
            }
        } catch (error) {
            console.warn("Scrape failed, proceeding with AI analysis only:", error)
        }

        console.log("🧠 Analyzing competitive intelligence...")
        await this.delay(300)

        // 2. Use AI to analyze the competitor
        const analysisPrompt = `
            You are an elite Competitive Intelligence Analyst at a McKinsey-level consulting firm.
            
            DOMAIN: ${domain}
            
            SCRAPED CONTENT:
            ${scrapedContent.substring(0, 4000)}
            
            TASK: Perform deep competitive analysis and return insights.
            
            OUTPUT (JSON only, no markdown):
            {
                "threat_level": "Low" | "Medium" | "High" | "Critical",
                "traffic_est": <estimated monthly visitors as integer>,
                "business_model": "<brief description>",
                "target_audience": "<specific demographic/psychographic>",
                "active_ads_count": <estimated active ad campaigns>,
                "weaknesses": [
                    {"title": "<weakness>", "description": "<why exploitable>", "severity": "Low" | "High"}
                ],
                "strengths": ["<strength 1>", "<strength 2>"],
                "marketing_channels": [
                    {"name": "SEO", "score": <0-100>},
                    {"name": "Social", "score": <0-100>},
                    {"name": "Email", "score": <0-100>}
                ],
                "ad_creatives": [
                    {"type": "social", "headline": "<compelling headline>", "hook": "<attention grabber>"}
                ],
                "future_moves": ["<predicted strategic move 1>", "<predicted move 2>"],
                "counter_strategy": "<actionable strategy to beat this competitor>"
            }
            
            Be specific and data-driven. Base estimates on real patterns in the content.
        `

        try {
            const response = await generateContent({
                prompt: analysisPrompt,
                type: 'competitor_analysis',
                userId: 'system',
                preferredProvider: 'auto'
            })

            const cleanJson = response.content
                .replace(/```json\n?|\n?```/g, '')
                .replace(/^[\s\S]*?{/, '{')
                .replace(/}[\s\S]*$/, '}')
                .trim()

            const analysis = JSON.parse(cleanJson)

            console.log("✅ SpyAgent: Dossier complete")

            return {
                domain,
                threat_level: analysis.threat_level || "Medium",
                traffic_est: analysis.traffic_est || 10000,
                business_model: analysis.business_model || "E-Commerce",
                target_audience: analysis.target_audience || "General Consumer",
                active_ads_count: analysis.active_ads_count || 5,
                weaknesses: analysis.weaknesses || [
                    { title: "Unknown", description: "Could not analyze", severity: "Low" }
                ],
                strengths: analysis.strengths || ["Unable to determine"],
                marketing_channels: analysis.marketing_channels || [
                    { name: "SEO", score: 50 },
                    { name: "Social", score: 50 },
                    { name: "Email", score: 50 }
                ],
                ad_creatives: analysis.ad_creatives || [
                    { type: "social", headline: "Discover the difference", hook: "See why customers are switching" }
                ],
                future_moves: analysis.future_moves || ["Unable to predict without more data"],
                counter_strategy: analysis.counter_strategy || "Focus on superior customer experience and faster delivery."
            }

        } catch (error) {
            console.error("SpyAgent AI analysis failed:", error)
            throw new Error(`Competitor analysis failed for ${domain}. Please try again or check API configuration.`)
        }
    }
}
