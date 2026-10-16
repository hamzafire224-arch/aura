import { generateContent } from "../providers"

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY

export type DesignResult = {
    imageUrl: string
    promptUsed: string
    description: string
}

export class VisualDesignerAgent {

    /**
     * Generates a high-quality image based on a concept or context.
     */
    async generate(concept: string, style: string = "cinematic"): Promise<DesignResult> {
        console.log(`[Designer] Generating: ${concept} (Style: ${style})`)

        // 1. Refine Prompt
        const refinementPrompt = `
            You are an expert AI Art Director.
            
            CONCEPT: "${concept}"
            STYLE: "${style}"
            
            TASK:
            Write a detailed, creative image generation prompt for DALL-E 3 / Midjourney.
            Focus on lighting, composition, texture, and mood.
            NO text in the image unless explicitly asked.
            
            OUTPUT (String only):
            The prompt text.
        `

        const refinedPrompt = await generateContent({
            prompt: refinementPrompt,
            type: 'creative_writing', // Using creative model
            userId: 'system',
            preferredProvider: 'auto'
        })

        const finalPrompt = refinedPrompt.content

        // 2. Generate Image (DALL-E 3)
        let imageUrl = ""

        if (OPENAI_KEY && OPENAI_KEY.startsWith("sk-")) {
            try {
                const response = await fetch("https://api.openai.com/v1/images/generations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${OPENAI_KEY}`
                    },
                    body: JSON.stringify({
                        model: "dall-e-3",
                        prompt: finalPrompt.substring(0, 1000),
                        n: 1,
                        size: "1024x1024",
                        quality: "standard",
                        response_format: "url"
                    })
                })

                if (!response.ok) {
                    const errorBody = await response.text()
                    throw new Error(`DALL-E Error: ${response.status} ${response.statusText} - ${errorBody}`)
                }

                const data = await response.json()
                imageUrl = data.data[0].url

            } catch (error) {
                console.error("[Designer] DALL-E generation failed", error)
            }
        } else {
            console.warn("[Designer] No valid OpenAI Key. Using placeholder.")
        }

        // Fallback
        if (!imageUrl) {
            imageUrl = `https://placehold.co/1024x1024/2563eb/FFF?text=${encodeURIComponent(concept.substring(0, 30))}`
        }

        return {
            imageUrl,
            promptUsed: finalPrompt,
            description: `A ${style} style image representing: ${concept}`
        }
    }
}
