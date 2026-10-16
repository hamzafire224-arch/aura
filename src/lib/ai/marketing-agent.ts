import { generateContent } from "./providers"

export type ContentCalendar = {
    weekStartDate: string
    theme: string
    posts: DayPlan[]
}

export type DayPlan = {
    day: string
    platform: "Instagram" | "LinkedIn" | "Twitter" | "TikTok"
    content: {
        hook: string
        body: string
        cta: string
        hashtags: string[]
    }
    visual: {
        type: "Image" | "Video" | "Carousel"
        description: string
        prompt: string // For AI Image Gen
    }
}

export class MarketingAgent {

    async generateCalendar(topic: string, niche: string, platform: string = "Instagram"): Promise<ContentCalendar> {
        const prompt = `
            You are AURA's Sentient Marketing Engine.
            
            TASK:
            Create a 7-day content calendar for a brand in the "${niche}" niche.
            Focus Topic: "${topic}"
            Platform: ${platform}
            
            REQUIREMENTS:
            - Each day must have a high-viral potential post.
            - Include specific visual descriptions and AI Image Prompts for each post.
            - The "prompt" field must be a detailed DALL-E 3 style prompt.
            
            OUTPUT (JSON ONLY):
            {
                "weekStartDate": "YYYY-MM-DD",
                "theme": "Weekly Theme Name",
                "posts": [
                    {
                        "day": "Monday",
                        "platform": "${platform}",
                        "content": {
                            "hook": "Attention grabbing first line",
                            "body": "Main caption content",
                            "cta": "Call to action",
                            "hashtags": ["#tag1", "#tag2"]
                        },
                        "visual": {
                            "type": "Image", 
                            "description": "What the image looks like",
                            "prompt": "Detailed AI image generation prompt: A photorealistic..."
                        }
                    },
                    ... (for all 7 days)
                ]
            }
            
            IMPORTANT: Return ONLY the JSON object.
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy', // Using high-token model
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    // analyzeCompetitor moved to WarRoomAgent for real-time Tavily analysis.

    private parseJson(content: string): any {
        try {
            const clean = content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(clean)
        } catch (e) {
            try {
                const start = content.indexOf('{')
                const end = content.lastIndexOf('}')
                if (start !== -1 && end !== -1) {
                    return JSON.parse(content.substring(start, end + 1))
                }
            } catch (e2) {
                console.error("Marketing Agent JSON Parse Error", content)
                throw new Error("Failed to parse Marketing Agent response")
            }
            throw e
        }
    }
}
