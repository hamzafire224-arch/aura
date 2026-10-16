import { generateContent } from "@/lib/ai/providers"
import { ScoutAgent } from "./scout-agent"
import { WatcherAgent } from "./watcher-agent"
import { ListenerAgent } from "./listener-agent"
import type { SpyDossier, ScoutReport, WatcherAnalysis, ListenerReport } from "./types"

export class OracleAgent {

    static async generateDossier(domain: string): Promise<SpyDossier> {
        console.log(`[Oracle] Initiating Deep Scan for ${domain}...`)

        // 1. Scout (The Eyes) - Gets raw data
        const scoutReport = await ScoutAgent.scan(domain)

        // 2. Parallel Processing (The Brains)
        const [watcher, listener] = await Promise.all([
            WatcherAgent.analyze(scoutReport),
            ListenerAgent.listen(domain)
        ])

        // 3. Oracle Synthesis (The Strategy)
        return this.synthesize(domain, scoutReport, watcher, listener)
    }

    private static async synthesize(
        domain: string,
        scout: ScoutReport,
        watcher: WatcherAnalysis,
        listener: ListenerReport
    ): Promise<SpyDossier> {
        console.log(`[Oracle] Synthesizing final dossier...`)

        const prompt = `
            You are "The Oracle", the ultimate business strategist.
            
            INTEL GATHERED:
            - Domain: ${domain}
            - Tech Stack: ${scout.techStack.join(", ")}
            - Visual ID: ${watcher.brandArchetype} (Trust: ${watcher.trustScore}/10)
            - Social Sentiment: ${listener.sentimentScore} / 100
            - Complaints: ${JSON.stringify(listener.complaints)}
            - Raw Content Snippet: ${scout.rawContent.substring(0, 500)}...
            
            TASK:
            Synthesize a Classified Spy Dossier.
            1. Determine the "Traffic Tier" based on sentiment volume and tech stack complexity.
            2. Reverse engineer their "Ad Strategy" based on the Visual Hooks (${watcher.visualHooks.join(", ")}).
            3. Formulate a killer "Counter-Strategy" to beat them.
            
            OUTPUT JSON (Match the SpyDossier interface):
            {
                "domain": "${domain}",
                "timestamp": "${new Date().toISOString()}",
                "identity": {
                    "techStack": ["..."],
                    "trafficTier": "Low/Mid/High/Enterprise",
                    "brandArchetype": "string",
                    "estimatedRevenue": "string (e.g. '$50k/mo')"
                },
                "intel": {
                    "adStrategy": {
                        "activeHooks": ["string"],
                        "visualStyle": "string",
                        "estimatedSpend": "string (e.g. '$5k/mo')"
                    },
                    "pricing": {
                        "entryPoint": number,
                        "premiumTier": number,
                        "hiddenCosts": ["string"],
                        "structure": "One-time/Subscription/Freemium"
                    },
                    "weaknesses": {
                        "sentiment": "Positive/Neutral/Negative",
                        "commonComplaints": ["string"],
                        "gaps": ["string"]
                    }
                },
                "counterStrategy": {
                    "summary": "string",
                    "tactics": [
                        { "title": "string", "description": "string", "priority": "High/Medium/Low" }
                    ]
                }
            }
        `

        try {
            const response = await generateContent({
                prompt,
                type: 'business_strategy',
                userId: 'system',
                preferredProvider: 'auto'
            })

            const cleanJson = response.content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(cleanJson)

        } catch (error) {
            console.error("[Oracle] Synthesis failed:", error)
            throw new Error("Failed to synthesize dossier")
        }
    }
}
