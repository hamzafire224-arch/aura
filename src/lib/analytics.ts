import { useEffect, useRef } from 'react'

export type AnalyticsEvent = {
    type: 'view' | 'click' | 'conversion'
    componentId: string
    timestamp: number
    properties?: Record<string, any>
}

class AnalyticsService {
    private queue: AnalyticsEvent[] = []
    private readonly BATCH_SIZE = 10
    private readonly FLUSH_MS = 5000

    constructor() {
        this.startFlushing()
    }

    public track(type: AnalyticsEvent['type'], componentId: string, properties?: Record<string, any>) {
        const event: AnalyticsEvent = {
            type,
            componentId,
            timestamp: Date.now(),
            properties
        }

        this.queue.push(event)

        if (this.queue.length >= this.BATCH_SIZE) {
            this.flush()
        }

        // Dev log for visibility
        console.log(`[AURA Analytics] Tracked: ${type} on ${componentId}`, properties)
    }

    private async flush() {
        if (this.queue.length === 0) return

        const batch = [...this.queue]
        this.queue = []

        try {
            // In production, this would be a fetch call to Supabase
            // await supabase.from('analytics_events').insert(batch)

            // For now, we persist to sessionStorage to simulate data accumulation for the Optimizer
            const history = JSON.parse(sessionStorage.getItem('aura_analytics_history') || '[]')
            sessionStorage.setItem('aura_analytics_history', JSON.stringify([...history, ...batch]))

            console.log(`[AURA Analytics] Flushed ${batch.length} events to storage.`)
        } catch (error) {
            console.error("[AURA Analytics] Flush failed", error)
            // Re-queue failed events
            this.queue = [...batch, ...this.queue]
        }
    }

    private startFlushing() {
        setInterval(() => {
            this.flush()
        }, this.FLUSH_MS)
    }
}

export const analytics = new AnalyticsService()

// React Hook for Component Visibility Tracking
export function useAnalytics(componentId: string) {
    const ref = useRef<HTMLDivElement>(null)
    const hasViewed = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasViewed.current) {
                    analytics.track('view', componentId)
                    hasViewed.current = true
                }
            },
            { threshold: 0.5 } // 50% visible triggers a view
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [componentId])

    const trackClick = (props?: any) => {
        analytics.track('click', componentId, props)
    }

    return { ref, trackClick }
}
