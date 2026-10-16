import { generateContent } from "./providers"
import type { FlowResult } from "./flow-engine"
import type { MarketReport } from "./market-intelligence"

export type ConversionStrategy = 'hype' | 'trust' | 'value' | 'brand'

export type StoreTheme = {
    layout: 'minimal' | 'bold' | 'editorial' | 'industrial'
    colors: {
        primary: string
        secondary: string
        background: string
        text: string
        accent: string
    }
    typography: {
        headings: string
        body: string
    }
    content: {
        heroHeadline: string
        heroSubhead: string
        ctaText: string
        trustBadge: string
        aboutTitle: string
        aboutText: string
    }
    features?: {
        scarcityTimer?: boolean
        socialProof?: boolean
        trustBadges?: boolean
        comparison?: boolean
        bundles?: boolean
    }
    strategy?: {
        type: ConversionStrategy
        reasoning: string
    }
}

export type BuilderLog = {
    agent: 'system' | 'researcher' | 'designer' | 'analyst' | 'strategist'
    message: string
}

export class StoreBuilder {
    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Orchestrates the "Executive Boardroom" meeting.
     * 4 Agents debate and converge on a market-dominating strategy.
     * Uses REAL Market Intelligence data.
     */
    async generateStoreTheme(
        strategy: FlowResult,
        niche: string,
        marketData: MarketReport,
        onLog: (log: BuilderLog) => void
    ): Promise<{ logs: BuilderLog[], theme: StoreTheme }> {

        // 1. Initialize the Boardroom
        onLog({ agent: 'system', message: "Initializing Secure Workspace..." })
        await this.delay(800)
        onLog({ agent: 'system', message: `Uplinking to Real-Time Market Feed: ${niche}...` })
        await this.delay(1200)

        onLog({ agent: 'researcher', message: `Intelligence received. Analyzed ${marketData.competitors.length} major competitors including ${marketData.competitors.map(c => c.name).join(', ')}.` })
        await this.delay(1500)

        // 2. Generate the Boardroom Transcript & Strategy
        // We want a LONG, detailed debate (approx 15-20 messages)
        const prompt = `
            You are the "AURA Executive Engine", running a simulation of 4 elite global experts building a market-dominating e-commerce brand.
            
            CONTEXT:
            - Niche: ${niche}
            - Proposed Name: ${strategy.businessName}
            - User's Vibe: ${strategy.brandIdentity.visualStyle}
            - Strategy: ${strategy.reasoning.strategyLogic}

            REAL-TIME MARKET INTELLIGENCE (DO NOT HALLUCINATE - USE THIS DATA):
            ${JSON.stringify(marketData)}

            THE BOARDROOM MEMBERS (PSYCHOLOGICAL PROFILING MODE):
            1. **Researcher (The Eye)**: Cold, factual. Cites specific competitors. "Competitor X is failing at Y."
            2. **Analyst (The Brain - The CMO)**: Obsessed with PSYCHOLOGY and CONVERSION. He categorizes the product into a strategy:
               - **HYPE Strategy**: For trendy/low-cost items. Demands Urgency (ScarcityTimer) and Social Proof.
               - **TRUST Strategy**: For expensive/health items. Demands reassurance (TrustBadges) and Logic (ComparisonTable).
               - **VALUE Strategy**: For commodity items. Demands Bundles.
            3. **Designer (The Soul)**: Artistic, slightly arrogant. Obsessed with "Vibe" and "Emotion". "The Analyst is boring; we need to make them FEEL something."
            4. **Strategist (The Closer)**: The CEO figure. Resolves conflicts. "Enough. We are going with [Decision]."

            TASK:
            Simulate a high-stakes, "War Room" strategy meeting. 
            - **CRITICAL**: The Analyst MUST explicitly argue for a specific strategy (HYPE, TRUST, or VALUE) based on the product nature.
            - **CREATE CONFLICT**: The Designer and Analyst MUST disagree (Brand vs Conversion). They should fight over specific features.
            - **BE SPECIFIC**: Quote the competitor data.
            - **LENGTH**: Generate exactly 10-15 exchanges (conversation turns). 
            - **CONSENSUS IS MANDATORY**: The Strategist must NOT make the final decision until the Analyst and Designer both explicitly say "Agreed" or "Fine, that works."
            
            The meeting MUST end with the Strategist declaring the "Winning Architecture" and the "Dominant Psychological Trigger".

            OUTPUT (Strict JSON):
            {
                "logs": [
                    { "agent": "researcher", "message": "I'm looking at [Competitor Name]. Their mobile site is a disaster - 4 second load time." },
                    { "agent": "analyst", "message": "Good catch. But look at the price point. This is a High-Ticket item. 'Hype' tactics won't work. We need a TRUST Strategy." },
                    { "agent": "designer", "message": "Trust is boring. We need Mystery. We need to look like a gallery, not a pharmacy." },
                    { "agent": "analyst", "message": "If we look like a gallery, nobody buys. We need the 'Comparison Table' and 'Trust Badges' front and center." },
                    ...
                    { "agent": "designer", "message": "Fine. Given the price point, I agree to the Trust badges, but only if we use a minimalist layout." },
                    { "agent": "analyst", "message": "Agreed. Minimalist build with heavy trust signals." },
                    { "agent": "strategist", "message": "Consensus reached. We proceed with the [Layout Name] Architecture and the [Strategy Name] Protocol." }
                ],
                "theme": {
                    "layout": "editorial", 
                    "colors": { "primary": "#...", "secondary": "#...", "background": "#...", "text": "#...", "accent": "#..." },
                    "typography": { "headings": "FontName", "body": "FontName" },
                    "content": {
                        "heroHeadline": "The exact H1 (Benefit Driven)",
                        "heroSubhead": "The exact subheadline (Addressing Pain Point)",
                        "ctaText": "The Button Text",
                        "trustBadge": "The Key Trust Signal",
                        "aboutTitle": "Our Mission",
                        "aboutText": "Brief powerful story"
                    },
                    "features": {
                        "scarcityTimer": boolean, // true if HYPE strategy
                        "socialProof": boolean,   // true if HYPE or TRUST
                        "trustBadges": boolean,   // true if TRUST
                        "comparison": boolean,    // true if TRUST or VALUE
                        "bundles": boolean        // true if VALUE
                    },
                    "strategy": {
                        "type": "trust",
                        "reasoning": "High ticket item requires credibility indicators."
                    }
                }
            }
        `

        // Simulate thinking time while request is in flight
        onLog({ agent: 'analyst', message: "Processing competitor gap analysis..." })

        // This request usually takes 3-5 seconds
        const response = await generateContent({
            prompt,
            type: 'web_design', // Tuning parameter for the provider
            userId: 'system',
            preferredProvider: 'auto'
        })

        try {
            const clean = response.content.replace(/```json\n?|\n?```/g, '').trim()
            const result = JSON.parse(clean)

            // 3. THE PLAYBACK LOOP (The "Theater")
            // goal: 20-25 seconds total experience.
            // We have roughly 8-10 logs. 
            // 20s / 10 logs = 2s per log average.

            const logs = result.logs as BuilderLog[]

            for (const log of logs) {
                // Variable delay based on text length (reading time)
                // Base 1.5s + 30ms per character
                const readingDelay = 1500 + (log.message.length * 20)

                // Add some "typing" randomness
                const randomJitter = Math.random() * 500

                await this.delay(readingDelay + randomJitter)
                onLog(log)
            }

            // Final pause for dramatic effect
            await this.delay(1000)

            return {
                logs: result.logs,
                theme: result.theme
            } as any

        } catch (e) {
            console.error("Boardroom consensus failed", e)
            // Fallback (Professional)
            return {
                logs: [
                    { agent: 'strategist', message: "Emergency Protocol: Intelligence Uplink Unstable. Reverting to Safe Mode layout." }
                ],
                theme: {
                    layout: 'minimal',
                    colors: { primary: '#000000', secondary: '#FFFFFF', background: '#F5F5F5', text: '#111111', accent: '#FF4400' },
                    typography: { headings: 'Inter', body: 'Inter' },
                    content: {
                        heroHeadline: strategy.businessName,
                        heroSubhead: "Premium Quality. Unmatched Service.",
                        ctaText: "Shop Now",
                        trustBadge: "Satisfaction Guaranteed",
                        aboutTitle: "Our Story",
                        aboutText: `Welcome to ${strategy.businessName}.`
                    }
                }
            } as any
        }
    }
}


