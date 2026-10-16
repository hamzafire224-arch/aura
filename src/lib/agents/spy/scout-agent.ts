import { scrapeUrl } from "@/lib/ai/providers"
import type { ScoutReport } from "./types"

export class ScoutAgent {

    static async scan(domain: string): Promise<ScoutReport> {
        console.log(`[Scout] Infiltrating ${domain}...`)

        // 1. Raw Content Extraction (Firecrawl/Puppeteer)
        // If Firecrawl key is missing, providers.ts will fallback to simulation automatically
        const rawContent = await scrapeUrl(`https://${domain}`)

        // 2. Tech Stack Detection (Simulated for now, or inferred from content)
        // In a real Puppeteer setup, we would check window objects or headers.
        // HACK: Inspect raw markdown for clues
        const techStack = this.detectTech(rawContent)

        // 3. Structure Analysis
        const headings = this.extractHeadings(rawContent)

        return {
            domain,
            rawContent: rawContent.substring(0, 5000), // Truncate for LLM context limits
            metaDescription: "Extracted from scraping", // Firecrawl returns markdown so meta is lost often, simplified here
            headings: headings.slice(0, 10),
            techStack,
            productLinks: [] // would be parsed from hrefs
        }
    }

    private static detectTech(content: string): string[] {
        const stack: string[] = []
        const c = content.toLowerCase()

        if (c.includes("shopify")) stack.push("Shopify")
        if (c.includes("wordpress") || c.includes("wp-content")) stack.push("WordPress")
        if (c.includes("wix")) stack.push("Wix")
        if (c.includes("squarespace")) stack.push("Squarespace")
        if (c.includes("react")) stack.push("React")
        if (c.includes("stripe")) stack.push("Stripe")
        if (c.includes("klaviyo")) stack.push("Klaviyo")

        return stack.length > 0 ? stack : ["Custom / Unknown"]
    }

    private static extractHeadings(markdown: string): string[] {
        // Simple regex to find markdown headings #, ##, ###
        const matches = markdown.match(/^#{1,3}\s+(.+)$/gm)
        if (!matches) return []
        return matches.map(h => h.replace(/^#+\s+/, '').trim())
    }
}
