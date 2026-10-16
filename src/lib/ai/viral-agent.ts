import { generateContent } from "./providers"

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY || ""
const ELEVENLABS_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || ""

export type VideoScript = {
    title: string
    hook: string
    body: string
    cta: string
    visual_keywords: string[]
    voice_id: string
}

export type VideoAsset = {
    type: 'video' | 'image'
    url: string
    duration: number
}

export class ViralAgent {

    /**
     * Step 1: Generate Viral Script
     */
    async generateScript(topic: string, platform: 'tiktok' | 'youtube' = 'tiktok'): Promise<VideoScript> {
        const prompt = `
            You are a Viral Content Strategist for ${platform}.
            
            TASK:
            Write a high-retention script for a video about: "${topic}".
            
            STRUCTURE:
            1. HOOK (0-3s): Grab attention immediately.
            2. BODY (3-45s): Deliver value/entertainment fast.
            3. CTA (45-60s): Ask for engagement.
            
            OUTPUT (JSON ONLY):
            {
                "title": "Clickbait Title",
                "hook": "Stop doing X...",
                "body": "Here is why...",
                "cta": "Follow for more...",
                "visual_keywords": ["shocked face", "money rain", "fast car"],
                "voice_id": "adam" 
            }
        `

        const result = await generateContent({
            prompt,
            type: 'content_creation',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    /**
     * Step 2: Search Stock Footage (Pexels)
     */
    async findVisuals(keywords: string[]): Promise<VideoAsset[]> {
        if (!PEXELS_KEY) {
            // Simulation
            return keywords.map(k => ({
                type: 'image',
                url: `https://source.unsplash.com/random/1920x1080/?${k.replace(/\s+/g, ',')}`, // Unsplash fallback
                duration: 5
            }))
        }

        try {
            // Real Pexels API call would go here
            // For now, we simulate with a placeholder to avoid breaking if key is invalid
            return keywords.map(k => ({
                type: 'video',
                url: `https://placehold.co/1080x1920/222/FFF?text=${k.replace(/\s+/g, '+')}`,
                duration: 5
            }))
        } catch (error) {
            console.error("Pexels Error:", error)
            return []
        }
    }

    /**
     * Step 3: Generate Voiceover (ElevenLabs)
     */
    async generateVoice(text: string): Promise<string> {
        if (!ELEVENLABS_KEY) {
            console.log("Simulating voice for:", text)
            // Return a dummy audio file for demo
            return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        }

        try {
            // Real ElevenLabs API call would go here
            // const response = await fetch(...)
            return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        } catch (error) {
            console.error("ElevenLabs Error:", error)
            return ""
        }
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
            return {
                title: "Error Generating Script",
                hook: "Something went wrong.",
                body: "Please try again.",
                cta: "Retry",
                visual_keywords: ["error"],
                voice_id: "adam"
            }
        }
    }
}
