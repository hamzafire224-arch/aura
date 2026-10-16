import { generateContent } from "@/lib/ai/providers"
import type { WatcherAnalysis, ScoutReport } from "./types"

export class WatcherAgent {

    static async analyze(report: ScoutReport): Promise<WatcherAnalysis> {
        console.log(`[Watcher] Analyzing visual identity of ${report.domain}...`)

        // Ideally, we send a screenshot to GPT-4o Vision.
        // For now, we infer visual identity from the content and tech stack.

        const prompt = `
            You are "The Watcher", an AI expert in Color Psychology and Brand Design.
            
            TARGET: ${report.domain}
            TECH STACK: ${report.techStack.join(", ")}
            CONTENT SNIPPET:
            ${report.rawContent.substring(0, 1000)}...
            
            TASK:
            1. Infer the Brand Archetype (e.g. "The Outlaw", "The Sage", "The Magician").
            2. Deduced Color Psychology (e.g. "Black/White = Luxury", "Blue = Trust").
            3. Extract "Visual Hooks" based on the copy (e.g. if they say "Handcrafted", the hook is "Artisanal Video").
            4. Assign a "Trust Score" (1-10) based on professionalism of copy.
            
            OUTPUT JSON:
            {
                "brandArchetype": "string",
                "visualHooks": ["string", "string"],
                "colorPsychology": "string",
                "trustScore": number
            }
        `

        try {
            const response = await generateContent({
                prompt,
                type: 'brand_identity',
                userId: 'system', // Internal agent call
                preferredProvider: 'auto'
            })

            const cleanJson = response.content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(cleanJson)
        } catch (error) {
            console.error("[Watcher] Analysis failed:", error)
            return {
                brandArchetype: "Unknown",
                visualHooks: ["Generic Product Photography"],
                colorPsychology: "Neutral / Unclear",
                trustScore: 5
            }
        }
    }
}
