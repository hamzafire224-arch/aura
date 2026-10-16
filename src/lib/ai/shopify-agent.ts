import { generateContent } from "./providers"
import { tavily } from "@tavily/core"

// Initialize Tavily client
const TAVILY_KEY = import.meta.env.VITE_TAVILY_API_KEY || ""

export type ShopifyProduct = {
    title: string
    body_html: string
    vendor: string
    product_type: string
    tags: string
    variants: Array<{
        price: string
        compare_at_price: string
        sku: string
        inventory_quantity: number
    }>
    image_prompt: string
}

export class ShopifyAgent {
    private client: any

    constructor() {
        if (TAVILY_KEY) {
            this.client = tavily({ apiKey: TAVILY_KEY })
        }
    }

    /**
     * Step 1: Research winning products in a niche
     */
    async researchTrends(niche: string): Promise<string> {
        if (!this.client) return "Simulation: Trending minimalist desk accessories."

        try {
            const query = `best selling ${niche} products 2024 dropshipping trends`
            const response = await this.client.search(query, {
                search_depth: "basic",
                max_results: 3
            })

            return response.results.map((r: any) => r.content).join("\n\n")
        } catch (error) {
            console.warn("Tavily search failed", error)
            return `Simulation: High demand detected for ${niche}.`
        }
    }

    /**
     * Step 2: Generate optimized products based on research
     */
    async generateProducts(niche: string, count: number = 5): Promise<ShopifyProduct[]> {
        // 1. Get Research
        const research = await this.researchTrends(niche)

        // 2. Generate Products
        const prompt = `
            You are a Shopify Dropshipping Expert.
            
            TASK:
            Generate ${count} high-converting products for the "${niche}" niche.
            Use this market research:
            ${research.substring(0, 1000)}
            
            REQUIREMENTS:
            - Titles: SEO-optimized, click-worthy (e.g., "Zenith™ Ergonomic Stand").
            - Description: HTML format, benefit-driven, bullet points.
            - Pricing: Realistic markup (3x cost).
            - Tags: Relevant for collections.
            
            OUTPUT (JSON ONLY):
            [
                {
                    "title": "Product Name",
                    "body_html": "<p>Description...</p>",
                    "vendor": "AURA",
                    "product_type": "Category",
                    "tags": "tag1, tag2",
                    "variants": [
                        { "price": "49.99", "compare_at_price": "89.99", "sku": "SKU-001", "inventory_quantity": 100 }
                    ],
                    "image_prompt": "Photorealistic product shot on white background..."
                }
            ]
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
     * Step 3: Convert to Shopify CSV Format
     */
    convertToCSV(products: ShopifyProduct[]): string {
        const headers = [
            "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
            "Option1 Name", "Option1 Value", "Variant SKU", "Variant Grams",
            "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy",
            "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price",
            "Image Src", "Image Position", "Image Alt Text"
        ]

        const rows = products.map(p => {
            const handle = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            return [
                handle,
                `"${p.title.replace(/"/g, '""')}"`,
                `"${p.body_html.replace(/"/g, '""')}"`,
                p.vendor,
                p.product_type,
                `"${p.tags}"`,
                "TRUE",
                "Title", "Default Title", p.variants[0].sku, "1000",
                "shopify", p.variants[0].inventory_quantity, "deny",
                "manual", p.variants[0].price, p.variants[0].compare_at_price,
                "", "1", `"${p.title}"` // Image URL placeholder
            ].join(",")
        })

        return [headers.join(","), ...rows].join("\n")
    }

    private parseJson(content: string): any {
        try {
            const clean = content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(clean)
        } catch (e) {
            const start = content.indexOf('[')
            const end = content.lastIndexOf(']')
            if (start !== -1 && end !== -1) {
                return JSON.parse(content.substring(start, end + 1))
            }
            return []
        }
    }
    /**
     * Step 4: [REAL] Upload to Shopify Store (Properties routed via Edge Function)
     */
    async uploadProducts(products: ShopifyProduct[]): Promise<{ success: number, failed: number, errors: string[] }> {
        // We now rely on the backend proxy configured with env vars
        // Client doesn't need to know the keys

        // Dynamic import to avoid circular dependencies if any, though allow usually fine in methods
        const { supabase } = await import("@/lib/supabase")

        let success = 0
        let failed = 0
        const errors: string[] = []

        for (const p of products) {
            try {
                // Construct Shopify Product Object
                const shopifyProduct = {
                    product: {
                        title: p.title,
                        body_html: p.body_html,
                        vendor: p.vendor,
                        product_type: p.product_type,
                        tags: p.tags,
                        variants: p.variants.map(v => ({
                            price: v.price,
                            compare_at_price: v.compare_at_price,
                            sku: v.sku,
                            inventory_quantity: v.inventory_quantity,
                            inventory_management: "shopify"
                        })),
                    }
                }

                // Invoke Supabase Edge Function
                const { data, error } = await supabase.functions.invoke('shopify-proxy', {
                    body: {
                        action: 'upload_product',
                        payload: shopifyProduct
                    }
                })

                if (error) throw new Error(error.message || "Edge Function Invocation Failed")
                if (data?.error) throw new Error(data.error)

                success++

            } catch (e: any) {
                console.error(`Failed to upload ${p.title}:`, e)
                failed++
                errors.push(`${p.title}: ${e.message}`)
            }
        }

        return { success, failed, errors }
    }
}
