export interface SpyDossier {
    domain: string
    timestamp: string
    identity: {
        techStack: string[]
        trafficTier: "Low" | "Mid" | "High" | "Enterprise"
        brandArchetype: string
        estimatedRevenue?: string
    }
    intel: {
        adStrategy: {
            activeHooks: string[]
            visualStyle: string
            estimatedSpend: string
        }
        pricing: {
            entryPoint: number
            premiumTier: number
            hiddenCosts: string[]
            structure: "One-time" | "Subscription" | "Freemium"
        }
        weaknesses: {
            sentiment: "Positive" | "Neutral" | "Negative"
            commonComplaints: string[]
            gaps: string[]
        }
    }
    counterStrategy: {
        summary: string
        tactics: Array<{
            title: string
            description: string
            priority: "High" | "Medium" | "Low"
        }>
    }
}

export interface ScoutReport {
    domain: string
    rawContent: string
    metaDescription: string
    headings: string[]
    techStack: string[]
    productLinks: string[]
    screenshotUrl?: string // Placeholder for now
}

export interface WatcherAnalysis {
    brandArchetype: string
    visualHooks: string[]
    colorPsychology: string
    trustScore: number // 0-10
}

export interface ListenerReport {
    sentimentScore: number // -100 to 100
    complaints: string[]
    praises: string[]
    platforms: string[]
}
