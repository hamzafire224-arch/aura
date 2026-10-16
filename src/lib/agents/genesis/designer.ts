import { generateContent } from "@/lib/ai/providers"

export interface BrandIdentity {
    colors: { primary: string, secondary: string, accent: string, rationale: string }
    typography: { heading: string, body: string }
    logoPrompt: string
    vibe: string
}

export class DesignerAgent {
    async createIdentity(idea: string, strategy: any): Promise<BrandIdentity> {
        console.log(`[Designer] Dreaming up visual identity for: ${idea}`)

        const prompt = `
            You are a Legendary Brand Designer (Apple/Nike level).
            CONTEXT: ${idea}
            STRATEGY: ${strategy.blueOcean}
            TARGET: ${strategy.targetAudience}

            Task:
            1. Create a Color Palette based on Color Psychology (Hex Codes).
            2. Select Google Fonts pairing (Heading/Body).
            3. Write a DALL-E 3 Prompt for a minimalist, iconic logo.
            4. Define the "Vibe" (e.g., "Cyberpunk meets Zen").

            Return JSON:
            {
                "colors": { "primary": "#...", "secondary": "#...", "accent": "#...", "rationale": "..." },
                "typography": { "heading": "Inter", "body": "Roboto" },
                "logoPrompt": "A minimalist vector logo of...",
                "vibe": "..."
            }
        `

        const response = await generateContent({
            type: "brand_identity",
            userId: "system",
            prompt
        })

        return JSON.parse(response.content.replace(/```json/g, "").replace(/```/g, "").trim())
    }
}
