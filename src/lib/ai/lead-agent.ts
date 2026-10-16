import { tavily } from "@tavily/core"

// Types for our Lead Data
export interface Lead {
    id: string
    companyName: string
    industry: string
    location: string
    website: string
    contactName: string
    role: string
    email: string
    linkedin: string
    status: 'New' | 'Contacted' | 'Qualified'
}

export class LeadAgent {
    private tv: any

    constructor() {
        const apiKey = import.meta.env.VITE_TAVILY_API_KEY
        if (apiKey) {
            this.tv = tavily({ apiKey })
        }
    }

    /**
     * Finds leads using Tavily.
     */
    async findLeads(niche: string, location: string): Promise<Lead[]> {
        if (!this.tv) {
            throw new Error("Lead discovery requires Tavily API Key. Please configure VITE_TAVILY_API_KEY in your environment.")
        }

        console.log(`🔍 Searching for ${niche} companies in ${location}...`)

        const query = `Top ${niche} companies agencies in ${location} list`
        const searchResults = await this.tv.search(query, {
            search_depth: "basic",
            max_results: 5,
            include_domains: ["linkedin.com", "clutch.co", "yelp.com"]
        })

        const leads: Lead[] = searchResults.results.slice(0, 5).map((r: any, i: number) => {
            let emailDomain = "unknown.com"
            try {
                if (r.url) {
                    emailDomain = new URL(r.url).hostname.replace('www.', '')
                }
            } catch (e) {
                // Fallback for malformed URLs
                emailDomain = "unknown.com"
            }

            return {
                id: `lead_${Date.now()}_${i}`,
                companyName: r.title ? r.title.split(/[-|]/)[0].trim() : "Unknown Company",
                industry: niche,
                location: location,
                website: r.url || "",
                contactName: "Unknown Decision Maker",
                role: "Founder / CEO",
                email: "contact@" + emailDomain,
                linkedin: "",
                status: 'New'
            }
        })

        return leads
    }

    /**
     * Enriches a lead by scraping the website for contacts.
     */
    async enrichLead(lead: Lead): Promise<Lead> {
        let scrapedData = ""
        let foundEmails: string[] = []

        try {
            // Lazy load scrapeUrl to avoid circular dependency
            const { scrapeUrl } = await import("./providers")

            console.log(`Enriching ${lead.companyName} via scraping...`)

            // 1. Scrape Main Page
            if (lead.website) {
                try {
                    const mainPageContent = await scrapeUrl(lead.website)
                    scrapedData += mainPageContent
                } catch (e) { console.warn("Main page scrape failed") }
            }

            // 2. Try Contact Page
            if (lead.website) {
                try {
                    const contactPageContent = await scrapeUrl(`${lead.website.replace(/\/$/, '')}/contact`)
                    scrapedData += "\n" + contactPageContent
                } catch (e) { /* Ignore */ }
            }

            // 3. Extract Emails
            const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g
            const matches = scrapedData.match(emailRegex)

            if (matches) {
                foundEmails = [...new Set(matches)]
                // Filter junk
                foundEmails = foundEmails.filter(e => !e.includes('sentry') && !e.includes('wix') && !e.includes('domain') && !e.includes('example'))
            }

            const bestEmail = foundEmails[0] || lead.email

            return {
                ...lead,
                email: bestEmail,
                status: 'Qualified'
            }

        } catch (error) {
            console.warn("Lead Enrichment failed:", error)
            return lead
        }
    }
}
