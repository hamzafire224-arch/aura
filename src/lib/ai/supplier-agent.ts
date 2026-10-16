import { searchTavily, generateContent } from "@/lib/ai/providers"

export interface Supplier {
    id: string
    name: string
    description: string
    location: string
    moq: string
    rating: number
    url: string
    contactEmail?: string
}

export class SupplierAgent {

    async findSuppliers(niche: string, location: string = "Global"): Promise<Supplier[]> {
        console.log(`SupplierAgent: Searching for ${niche} suppliers in ${location}...`)

        // 1. Search Web for Suppliers
        const query = `wholesale ${niche} suppliers distributors manufacturers ${location} contact email "MOQ"`
        const searchResults = await searchTavily(query, 'advanced')

        // 2. Use LLM to specific extract structured data
        const prompt = `
        Analyze the following search results for "${niche} suppliers".
        Extract a list of 4-6 REAL suppliers mentioned.
        For each, deduce:
        - Name
        - Description (Brief)
        - Location (City/Country)
        - MOQ (Minimum Order Quantity - guess if not explicit based on "Wholesale" context, e.g. "50-100 units")
        - Rating (Estimate 1-5 based on reputation/professionalism, default 4.5)
        - URL (Website link)
        - Contact Email (if found)

        output purely as a JSON array of objects with keys: id (random string), name, description, location, moq, rating (number), url, contactEmail.
        Do not output markdown code blocks. Just the JSON string.

        Search Results:
        ${searchResults}
        `

        const { content } = await generateContent({
            prompt: prompt,
            type: 'business_strategy', // Reuse strategy model for complexity
            userId: 'system', // Client-side, so just logging
            preferredProvider: 'auto'
        })

        try {
            // Clean content of markdown if present
            const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim()
            const suppliers = JSON.parse(cleanJson)
            return suppliers
        } catch (e) {
            console.error("SupplierAgent: Failed to parse LLM results", e)
            // Fallback if parsing fails (return raw text in a dummy object or empty)
            return []
        }
    }
}
