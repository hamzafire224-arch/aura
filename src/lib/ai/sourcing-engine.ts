import { generateContent, searchTavily } from "./providers"

export type SourcedProduct = {
    title: string
    description: string
    cost: number
    suggestedPrice: number
    imageUrl: string
    supplierUrl: string
    supplierName: string
    source: 'cj' | 'aliexpress' | 'manual'
}

/**
 * The Sourcing Agent
 * Scans the web (or APIs) to find real winning products for a niche.
 */
export class SourcingEngine {

    /**
     * Finds 5 "winning" products for a given niche and budget.
     * Uses Tavily to find real AliExpress/CJ links, then uses AI to extract structured data.
     */
    async findWinningProducts(niche: string, budget: number): Promise<SourcedProduct[]> {
        console.log(`[Sourcing] Hunting for products in niche: ${niche}`)

        // 1. Search for live products
        const query = `best selling ${niche} products aliexpress cj dropshipping ${new Date().getFullYear()} with price`
        const searchResults = await searchTavily(query, "advanced")

        // 2. Synthesize & Parse with AI
        const prompt = `
            You are a Professional Sourcing Agent.
            I have searched for winning products in the "${niche}" niche.
            
            SEARCH RESULTS:
            ${searchResults}
            
            TASK:
            Identify 5 distinct, real products mentioned in the search results that fit a budget of $${budget}.
            For each product, estimate the cost and suggested retail price based on standard dropshipping margins (3x).
            
            OUTPUT (JSON Array only):
            [
                {
                    "title": "Product Name",
                    "description": "Short convincing sales copy",
                    "cost": 5.00,
                    "suggestedPrice": 15.00,
                    "imageUrl": "URL to an image mentioned or a placeholder if unknown",
                    "supplierUrl": "Link to the product or supplier",
                    "supplierName": "AliExpress/CJ/Zendrop",
                    "source": "aliexpress"
                }
            ]
            
            IMPORTANT: Return ONLY valid JSON.
        `

        const response = await generateContent({
            prompt,
            type: 'sourcing_agent',
            userId: 'system',
            preferredProvider: 'auto'
        })

        try {
            const cleanJson = response.content.replace(/```json\n?|\n?```/g, '').trim()
            const products = JSON.parse(cleanJson) as SourcedProduct[]

            // Fallback for missing images if AI couldn't find real ones
            return products.map(p => ({
                ...p,
                imageUrl: p.imageUrl.startsWith('http') ? p.imageUrl : `https://source.unsplash.com/800x600/?${encodeURIComponent(p.title)}`
            }))
        } catch (e) {
            console.error("Failed to parse sourced products:", e)
            throw new Error(`Product sourcing failed for niche "${niche}". The AI response could not be parsed. Try rephrasing your niche or contact support.`)
        }
    }
}
