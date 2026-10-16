import { generateContent, searchTavily } from "./providers"

export type FlowInput = {
    idea: string
    niche: string
    description?: string // User's specific vision
    budget?: number
    businessModel?: string
    excludeNames?: string[]
}

export type FlowResult = {
    businessName: string
    tagline: string
    missionStatement: string
    colorPalette: { primary: string; secondary: string; accent: string }
    brandIdentity: { toneOfVoice: string; visualStyle: string }
    strategy: {
        targetAudience: string
        uniqueSellingPoint: string
        marketingChannels: string[]
        launchTactics: string[]
    }
    modelSpecificData?: {
        sourcingPlan?: string
        fulfillmentStrategy?: string
        initialProductCandidates?: string[]
        techStack?: string[] // For SaaS later
    }
    reasoning: {
        nameChoice: string
        colorPsychology: string
        strategyLogic: string
    }
}

export type FlowStep = "researcher" | "analyst" | "creator" | "critic"

export type FlowLog = {
    step: FlowStep
    message: string
    data?: any
}

export class FlowEngine {
    private logs: FlowLog[] = []
    private onLog: (log: FlowLog) => void

    constructor(onLog?: (log: FlowLog) => void) {
        this.onLog = onLog || (() => { })
    }

    private log(step: FlowStep, message: string, data?: any) {
        const logEntry = { step, message, data }
        this.logs.push(logEntry)
        this.onLog(logEntry)
    }

    private parseJson(content: string): any {
        try {
            // 1. Try standard clean
            const clean = content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(clean)
        } catch (e) {
            // 2. Try extracting from first { to last }
            try {
                const start = content.indexOf('{')
                const end = content.lastIndexOf('}')
                if (start !== -1 && end !== -1) {
                    const jsonStr = content.substring(start, end + 1)
                    return JSON.parse(jsonStr)
                }
            } catch (e2) {
                console.error("JSON Parse Failed:", content)
                throw new Error("AI response was not valid JSON")
            }
            throw e
        }
    }

    async run(input: FlowInput): Promise<FlowResult> {
        this.log("researcher", `Starting deep analysis for: ${input.idea} in ${input.niche}`)

        // Step 1: The Researcher (Simulated)
        const facts = await this.stepResearcher(input)

        // Step 2: The Analyst
        const strategy = await this.stepAnalyst(input, facts)

        // Step 3: The Creator
        const candidates = await this.stepCreator(input, strategy)

        // Step 4: The Critic
        const finalResult = await this.stepCritic(input, strategy, candidates)

        return finalResult
    }

    private async stepResearcher(input: FlowInput): Promise<string[]> {
        this.log("researcher", "Scanning live market data and competitors...")

        try {
            // 1. Perform Real Search (Centralized)
            const query = `market analysis for ${input.niche} business trends ${new Date().getFullYear()} competitors`

            this.log("researcher", "Querying global intelligence network...")
            const context = await searchTavily(query, "advanced")

            this.log("researcher", "Raw market data gathered from Tavily")

            // 2. Synthesize Facts with AI
            const prompt = `
                You are a Market Researcher.
                I have gathered raw search data for a new business idea: "${input.idea}" in the "${input.niche}" niche.
                USER SPECIFIC VISION: "${input.description || 'General niche focus'}"
                
                SEARCH DATA:
                ${context}
                
                TASK:
                Extract 4-5 critical, non-obvious facts about this market.
                Focus on: Growth trends, Competitor weaknesses, and Underserved gaps SPECIFIC to the user's vision.
                
                OUTPUT (JSON String Array):
                [
                    "Fact 1...",
                    "Fact 2..."
                ]
            `

            const result = await generateContent({
                prompt,
                type: 'business_strategy',
                userId: 'system',
                preferredProvider: 'auto'
            })

            const facts = this.parseJson(result.content)
            this.log("researcher", "Market facts synthesized", facts)
            return facts

        } catch (e) {
            console.warn("FlowEngine: Research failed, using simulation.", e)
            this.log("researcher", "Live research unavailable. Using internal knowledge base.")

            // Fallback Simulation
            return [
                `Market for ${input.niche} is growing but competitive (Simulated).`,
                `Current trends favor sustainability and personalization.`,
                `Key competitors focus on volume over quality.`,
                `Gap identified: Premium positioning with AI-driven customization.`
            ]
        }
    }

    private async stepAnalyst(input: FlowInput, facts: string[]) {
        this.log("analyst", "Synthesizing facts into a winning strategy...")

        const prompt = `
            You are The Analyst, a strategic business brain.
            
            INPUT:
            - Idea: ${input.idea}
            - Niche: ${input.niche}
            - User Vision: "${input.description || "General"}"
            - Business Model: ${input.businessModel || "General"}
            - Budget: $${input.budget || "Unknown"}
            - Facts: ${JSON.stringify(facts)}
            
            TASK:
            Analyze the facts and formulate a "Blue Ocean" strategy.
            Identify a unique angle that separates this business from competitors.
            Ensure the strategy fits the $${input.budget} budget and '${input.businessModel}' model.
            
            REQUIREMENTS:
            - Provide REALISTIC ESTIMATES for Market Growth (CAGR) and potential Net Promoter Score (NPS) based on the angle.
            - Explain WHY top performers are winning and where they fail.

            ${input.businessModel === 'dropshipping' ? `
            SPECIFIC DROPSHIPPING INSTRUCTIONS:
            - Define a clear Sourcing Strategy (e.g. AliExpress vs Zendrop) suited for $${input.budget}.
            - Suggest 3 specific "Winning Product" types to test first.
            - Outline a Fulfillment/Shipping promise (e.g. "We promise < 10 days or free").
            ` : ''}
            
            OUTPUT (JSON ONLY):
            {
                "angle": "The core unique angle (e.g. 'Privacy-First Luxury')",
                "targetAudience": "Specific persona",
                "uniqueSellingPoint": "The main differentiator",
                "visualDirection": "Aesthetic direction (e.g. 'Dark Mode, Neon, Cyberpunk')",
                "sourcingPlan": "Detailed sourcing approach",
                "initialProductCandidates": ["Product 1", "Product 2", "Product 3"],
                "marketStats": {
                    "cagr": "e.g. +5.4% annually",
                    "competitorGap": "Brief explanation of what current market leaders miss"
                }
            }
            
            IMPORTANT: Return ONLY the JSON object. No conversational text.
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        const strategy = this.parseJson(result.content)
        this.log("analyst", "Strategy formulated", strategy)
        return strategy
    }

    private async stepCreator(input: FlowInput, strategy: any) {
        this.log("creator", "Generating creative assets based on strategy...")

        const prompt = `
            You are The Creator, a world-class branding expert.
            
            STRATEGY CONTEXT:
            - Angle: ${strategy.angle}
            - Visual Direction: ${strategy.visualDirection}
            - USP: ${strategy.uniqueSellingPoint}
            
            CONSTRAINTS:
            - Exclude Names: ${JSON.stringify(input.excludeNames || [])}
            
            TASK:
            Generate 3 distinct brand concepts.
            Keep descriptions concise (under 20 words).
            AVOID generic names like "Aura", "Nova", "Nex", "Flow", "Zen".
            Be creative, evocative, and unique.
            
            OUTPUT (JSON ONLY):
            {
                "candidates": [
                    {
                        "name": "Name 1",
                        "tagline": "Tagline 1",
                        "mission": "Mission 1",
                        "colors": { "primary": "#hex", "secondary": "#hex", "accent": "#hex" }
                    },
                    ...
                ]
            }
            
            IMPORTANT: Return ONLY the JSON object. No conversational text.
        `

        const result = await generateContent({
            prompt,
            type: 'brand_identity',
            userId: 'system',
            preferredProvider: 'auto'
        })

        const parsed = this.parseJson(result.content)

        let candidatesArray: any[] = []
        if (Array.isArray(parsed)) {
            candidatesArray = parsed
        } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.candidates)) {
            candidatesArray = parsed.candidates
        } else {
            console.error("FlowEngine: Invalid candidates structure", parsed)
            this.log("creator", "Failed to parse candidates structure - returning empty set")
            return []
        }

        this.log("creator", "Candidates generated", candidatesArray)
        return candidatesArray
    }

    private async stepCritic(_input: FlowInput, strategy: any, candidates: any[]) {
        this.log("critic", "Reviewing candidates against strategy...")

        const prompt = `
            You are The Critic, a perfectionist creative director.
            
            STRATEGY: ${JSON.stringify(strategy)}
            CANDIDATES: ${JSON.stringify(candidates)}
            
            TASK:
            1. Evaluate each candidate against the Strategy.
            2. Select the BEST one.
            3. Refine it if necessary.
            
            OUTPUT (JSON ONLY):
            {
                "selected": {
                    "businessName": "Final Name",
                    "tagline": "Final Tagline",
                    "missionStatement": "Final Mission",
                    "colorPalette": { "primary": "#hex", "secondary": "#hex", "accent": "#hex" },
                    "brandIdentity": { 
                        "toneOfVoice": "string", 
                        "visualStyle": "${strategy.visualDirection}" 
                    },
                    "strategy": {
                        "targetAudience": "${strategy.targetAudience}",
                        "uniqueSellingPoint": "${strategy.uniqueSellingPoint}",
                        "marketingChannels": ["Channel 1", "Channel 2"],
                        "launchTactics": ["Tactic 1", "Tactic 2"]
                    },
                    "modelSpecificData": {
                        "sourcingPlan": "${strategy.sourcingPlan || ''}",
                        "initialProductCandidates": ${JSON.stringify(strategy.initialProductCandidates || [])}
                    },
                    "reasoning": {
                        "nameChoice": "Why this name fits the '${strategy.angle}' angle better than others.",
                        "colorPsychology": "Why these colors match '${strategy.visualDirection}'.",
                        "strategyLogic": "Why this strategy will win. Market Growth: ${strategy.marketStats?.cagr || 'Unknown'}. Gap: ${strategy.marketStats?.competitorGap || 'Unknown'}"
                    }
                }
            }
            
            IMPORTANT: Return ONLY the JSON object. No conversational text.
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        const final = this.parseJson(result.content)
        this.log("critic", "Final selection made", final.selected)
        return final.selected
    }
}
