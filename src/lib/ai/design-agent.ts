import { generateContent } from "./providers"

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || ""

export type Design = {
    prompt: string
    imageUrl: string
    style: string
}

export type Mockup = {
    productType: 't-shirt' | 'hoodie' | 'mug'
    color: string
    mockupUrl: string
}

export class DesignAgent {

    /**
     * Step 1: Generate Design Prompt & Image (REAL DALL-E 3)
     */
    async generateDesign(concept: string, style: string): Promise<Design> {
        // 1. Refine the prompt using LLM
        const promptRefinement = `
            You are a Midjourney/DALL-E Prompt Expert.
            Convert this concept into a high-quality image generation prompt for a T-Shirt design.
            Concept: "${concept}"
            Style: "${style}"
            REQUIREMENTS: Focus on visual elements, sharp edges, NO text unless specified.
            OUTPUT (String only): A detailed, vivid prompt...
        `

        const refinedPrompt = await generateContent({
            prompt: promptRefinement,
            type: 'creative_writing',
            userId: 'system',
            preferredProvider: 'auto'
        })

        // 2. Generate Image (REAL DALL-E 3)
        let imageUrl = ""

        if (!OPENAI_KEY) {
            throw new Error("Design generation requires OpenAI API Key. Please configure VITE_OPENAI_API_KEY in your environment.")
        }

        try {
            console.log("🎨 DesignAgent: Generating image with DALL-E 3...")
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: refinedPrompt.content.substring(0, 1000),
                    n: 1,
                    size: "1024x1024",
                    quality: "standard",
                    response_format: "url"
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(`OpenAI API Error: ${err.error?.message || response.statusText}`)
            }

            const data = await response.json()
            imageUrl = data.data[0].url
            console.log("✅ DesignAgent: Image generated successfully")

        } catch (error) {
            console.error("DesignAgent: Failed to generate image:", error)
            throw new Error(`Image generation failed: ${(error as Error).message}`)
        }

        return {
            prompt: refinedPrompt.content,
            imageUrl,
            style
        }
    }

    /**
     * Step 2: [REAL] Generate a composite Product Mockup
     * Uses HTML Canvas to overlay the design onto a base product image.
     */
    async generateMockup(designUrl: string, productType: 't-shirt' | 'hoodie' | 'mug'): Promise<string> {
        // High quality base images (would ideally be hosted on our CDN)
        const BASE_IMAGES = {
            't-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
            'mug': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop',
            'hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop'
        }

        const baseImageUrl = BASE_IMAGES[productType] || BASE_IMAGES['t-shirt']

        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            try {
                return await this.createCompositeImage(baseImageUrl, designUrl)
            } catch (e) {
                console.error("Mockup Generation Failed:", e)
                return baseImageUrl
            }
        }
        return baseImageUrl
    }

    private createCompositeImage(baseUrl: string, overlayUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return reject("No Canvas Context")

            const baseImg = new Image()
            baseImg.crossOrigin = "Anonymous"

            baseImg.onload = () => {
                canvas.width = baseImg.width
                canvas.height = baseImg.height

                // Draw Base
                ctx.drawImage(baseImg, 0, 0)

                const overlayImg = new Image()
                overlayImg.crossOrigin = "Anonymous"

                overlayImg.onload = () => {
                    // Logic to center and scale design on the product
                    // Using fixed 30% width logic for MVP
                    const scale = (canvas.width * 0.3) / overlayImg.width
                    const w = overlayImg.width * scale
                    const h = overlayImg.height * scale
                    const x = (canvas.width - w) / 2
                    const y = (canvas.height - h) / 2

                    ctx.globalCompositeOperation = 'multiply' // Blend mode
                    ctx.drawImage(overlayImg, x, y, w, h)
                    ctx.globalCompositeOperation = 'source-over'

                    resolve(canvas.toDataURL('image/png'))
                }

                overlayImg.onerror = () => {
                    // If design fails to load, just return base
                    resolve(baseUrl)
                }

                overlayImg.src = overlayUrl
            }

            baseImg.onerror = (e) => reject(e)
            baseImg.src = baseUrl
        })
    }
}
