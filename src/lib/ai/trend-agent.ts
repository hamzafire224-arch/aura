import { generateContent } from "./providers"

export type TrendProduct = {
    id: string
    name: string
    description: string
    price: number
    viralScore: number // 0-100
    opportunityLevel: "High" | "Medium" | "Low"
    imageUrl: string
    source: string
    category: string
}

export type ProductAnalysis = {
    profitability: {
        estimatedCost: number
        sellingPrice: number
        profitMargin: number
        breakEvenUnits: number
    }
    marketing: {
        hooks: string[]
        targetAudience: string
        channels: string[]
    }
    sourcing: {
        suppliers: Array<{ name: string, url: string, price: number }>
    }
    strategy: {
        launchPlan: string[]
        risks: string[]
    }
}

export class TrendHunterAgent {
    private tavilyKey = import.meta.env.VITE_TAVILY_API_KEY

    async scanTrends(niche: string): Promise<TrendProduct[]> {
        // 1. Try to get real data from Tavily if key exists
        if (this.tavilyKey && this.tavilyKey !== 'tvly-xxxxxxxxxxxx') {
            try {
                console.log("TrendHunter: Scanning live web data with Tavily...")
                return await this.fetchFromTavily(niche)
            } catch (e) {
                console.error("TrendHunter: Tavily search failed, falling back to simulation", e)
            }
        } else {
            console.warn("TrendHunter: No valid Tavily API Key found. Using simulation.")
        }

        // 2. Fallback to AI Simulation (if key missing or search fails)
        return await this.simulateTrends(niche)
    }

    async analyzeProduct(product: TrendProduct): Promise<ProductAnalysis> {
        // Enhanced prompt for deep analysis
        const prompt = `
            You are an expert E-commerce Analyst.
            
            PRODUCT: ${product.name}
            DESCRIPTION: ${product.description}
            PRICE: $${product.price}
            CATEGORY: ${product.category}
            SOURCE: ${product.source}
            
            TASK:
            Perform a professional deep-dive analysis for launching this product.
            This is a REAL product found via search. Treat it seriously.
            Estimate sourcing costs based on typical global manufacturing rates (e.g. Alibaba/AliExpress).
            
            OUTPUT (JSON ONLY):
            {
                "profitability": {
                    "estimatedCost": 15.00,
                    "sellingPrice": ${product.price},
                    "profitMargin": 65,
                    "breakEvenUnits": 50
                },
                "marketing": {
                    "hooks": ["Hook 1", "Hook 2", "Hook 3"],
                    "targetAudience": "Detailed persona",
                    "channels": ["TikTok", "Instagram Reels"]
                },
                "sourcing": {
                    "suppliers": [
                        { "name": "AliExpress Supplier (Est)", "url": "https://aliexpress.com", "price": 12.50 },
                        { "name": "CJ Dropshipping (Est)", "url": "https://cjdropshipping.com", "price": 14.00 }
                    ]
                },
                "strategy": {
                    "launchPlan": ["Step 1", "Step 2", "Step 3"],
                    "risks": ["Risk 1", "Risk 2"]
                }
            }
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy', // Use the smart model
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    private async fetchFromTavily(niche: string): Promise<TrendProduct[]> {
        // Advanced query construction
        const query = `trending ${niche} products ${new Date().getFullYear()} viral dropshipping "best seller"`

        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: this.tavilyKey,
                query: query,
                search_depth: "advanced", // Deep search for better results
                include_images: true,
                max_results: 7
            })
        })

        if (!response.ok) {
            throw new Error(`Tavily API Error: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.results || data.results.length === 0) {
            throw new Error("No results found from Tavily")
        }

        // Transform Tavily results into TrendProducts using AI to structure the unstructured data
        // We pass the raw search snippets to the LLM to extract "Products"
        const context = data.results.map((r: any, i: number) => `[Result ${i + 1}] Title: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`).join("\n\n")

        const prompt = `
            You are a Trend Hunter. I have performed a LIVE web search for "${niche}".
            Extract 5 distinct, real trending products from this search data.
            
            SEARCH DATA:
            ${context}
            
            CRITERIA:
            - Must be a physical product (not a service or article).
            - Must seem "viral" or popular based on the text.
            - Infer a realistic price if not stated.
            
            OUTPUT (JSON ONLY):
            [
                {
                    "id": "generate_unique_id",
                    "name": "Product Name",
                    "description": "Short description based on search result",
                    "price": 50,
                    "viralScore": 85,
                    "opportunityLevel": "High",
                    "category": "${niche}",
                    "sourceUrl": "The URL from the search result"
                }
            ]
        `

        const aiResult = await generateContent({
            prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        const products = this.parseJson(aiResult.content)

        // Merge back images from search results where possible, or use placeholders
        return products.map((p: any, i: number) => {
            // Try to find a matching image from search results (simple heuristic)
            const matchedResult = data.results.find((r: any) => r.url === p.sourceUrl) || data.results[i]

            return {
                ...p,
                imageUrl: matchedResult?.image || matchedResult?.images?.[0] || `https://source.unsplash.com/random/400x400/?${encodeURIComponent(p.name)}`,
                source: "Live Web Search"
            }
        })
    }

    private async simulateTrends(niche: string): Promise<TrendProduct[]> {
        console.log("TrendHunter: Simulating trends (Fallback mode)")
        const prompt = `
            Generate 6 "Trending" product ideas for the niche: "${niche}".
            They should be realistic dropshipping/e-commerce products that are currently viral.
            
            OUTPUT (JSON ONLY):
            [
                {
                    "id": "1",
                    "name": "Product Name",
                    "description": "Why it's viral",
                    "price": 49.99,
                    "viralScore": 92,
                    "opportunityLevel": "High",
                    "category": "${niche}"
                },
                ...
            ]
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        const products = this.parseJson(result.content)
        return products.map((p: any) => ({
            ...p,
            imageUrl: `https://source.unsplash.com/random/400x400/?${encodeURIComponent(p.name)}`,
            source: "AI Trend Simulation"
        }))
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
            // Try array
            const startArr = content.indexOf('[')
            const endArr = content.lastIndexOf(']')
            if (startArr !== -1 && endArr !== -1) {
                return JSON.parse(content.substring(startArr, endArr + 1))
            }
            throw new Error("Failed to parse JSON")
        }
    }
    /**
     * Simulation of live traffic for the Dashboard "Pulse" check.
     * In a real app, this would verify Google Analytics real-time API.
     */
    async getLiveTraffic(): Promise<{ active: number, trend: 'up' | 'down' }> {
        // Simulate a live socket check
        const baseVisitors = Math.floor(Math.random() * 50) + 12
        return {
            active: baseVisitors,
            trend: Math.random() > 0.4 ? 'up' : 'down'
        }
    }
}
