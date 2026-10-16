import type { StoreTheme } from "./store-builder"
import type { AnalyticsEvent } from "../analytics"

type OptimizationAction = {
    type: 'ENABLE_FEATURE' | 'DISABLE_FEATURE' | 'CHANGE_STRATEGY'
    target: string // feature key or strategy name
    reason: string
    confidence: number
}

export class OptimizerAgent {

    /**
     * Analyzes raw analytics data to identify user friction points.
     */
    static diagnose(events: AnalyticsEvent[], currentTheme: StoreTheme): OptimizationAction[] {
        const actions: OptimizationAction[] = []

        // 1. Calculate CTR per component
        const metrics = this.aggregateMetrics(events)

        // Rule 1: "The Trust Killer"
        // If ScarcityTimer exists but has High Bounce Rate or Low Engagement, kill it.
        // (Proxy: High impressions, zero clicks, short session duration - simplified here to CTR)
        if (currentTheme.features?.scarcityTimer) {
            const stats = metrics['ScarcityTimer']
            if (stats && stats.impressions > 50 && stats.ctr < 0.01) {
                actions.push({
                    type: 'DISABLE_FEATURE',
                    target: 'scarcityTimer',
                    reason: `High friction detected. Scarcity Timer has ${stats.impressions} views but only ${stats.ctr * 100}% engagement. Users may feel pressured.`,
                    confidence: 0.95
                })
            }
        }

        // Rule 2: "The Hidden Gem"
        // If BundleBuilder is disabled but "Value" strategy is active, enable it.
        if (!currentTheme.features?.bundles && currentTheme.strategy?.type === 'value') {
            actions.push({
                type: 'ENABLE_FEATURE',
                target: 'bundles',
                reason: "Strategy mismatch. 'Value' protocol is active but BundleBuilder is disabled. Enabling to increase AOV.",
                confidence: 0.85
            })
        }

        // Rule 3: "Social Proof Fatigue"
        // If SocialProofWall is at the bottom and never seen, move it? 
        // For MVP, we just detect if it's "Unseen" (Impressions = 0) despite page views
        const wallStats = metrics['SocialProofWall']
        if (currentTheme.features?.socialProof && wallStats && wallStats.impressions === 0) {
            // Real logic would be "Move higher", but for MVP we might just note it
            // actions.push(...)
        }

        return actions
    }

    static aggregateMetrics(events: AnalyticsEvent[]) {
        const metrics: Record<string, { impressions: number, clicks: number, ctr: number }> = {}

        events.forEach(e => {
            if (!metrics[e.componentId]) {
                metrics[e.componentId] = { impressions: 0, clicks: 0, ctr: 0 }
            }
            if (e.type === 'view') metrics[e.componentId].impressions++
            if (e.type === 'click') metrics[e.componentId].clicks++
        })

        // Calc CTR
        Object.keys(metrics).forEach(key => {
            const m = metrics[key]
            m.ctr = m.impressions > 0 ? m.clicks / m.impressions : 0
        })

        return metrics
    }

    /**
     * Applies the healing actions to the theme.
     */
    static heal(theme: StoreTheme, actions: OptimizationAction[]): StoreTheme {
        const newTheme = JSON.parse(JSON.stringify(theme)) // Deep clone

        actions.forEach(action => {
            if (!newTheme.features) newTheme.features = {}

            if (action.type === 'DISABLE_FEATURE') {
                newTheme.features[action.target] = false
            }
            if (action.type === 'ENABLE_FEATURE') {
                newTheme.features[action.target] = true
            }
        })

        return newTheme
    }
}
