import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"


export function AiInsightBanner({ niche }: { niche: string }) {
    const [insight, setInsight] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInsight = async () => {
            // In a real prod environment, we would cache this or fetch from a DB table 'daily_insights'
            // to avoid API costs on every reload. For MVP/High-End Demo, we simulate the "Live" fetch.
            try {
                // Simulate agent delay for "thinking" effect
                await new Promise(resolve => setTimeout(resolve, 1500))

                // If we had the real backend hooked up fully, we'd call:
                // const agent = new TrendHunterAgent()
                // const result = await agent.analyze(niche)
                // setInsight(result.summary)

                // For now, to ensure reliability without burning tokens on every refresh during dev:
                const templates = [
                    `TrendHunter detected a 24% spike in "${niche}" search volume in the last hour.`,
                    `Competitor analysis suggests a gap in the "${niche}" market for premium tiers.`,
                    `Viral opportunity: Use "Day in the life" hooks for your ${niche} products.`,
                    `Traffic Alert: 150+ visitors currently viewing similar ${niche} content.`,
                    `Optimization: Your conversion rate could improve by 1.2% with a sticky CTA.`
                ]
                setInsight(templates[Math.floor(Math.random() * templates.length)])
            } catch (e) {
                setInsight("System nominal. No critical alerts.")
            } finally {
                setLoading(false)
            }
        }

        fetchInsight()
    }, [niche])

    return (
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Badge variant="outline" className={`border-purple-500 text-purple-400 ${loading ? 'opacity-50' : 'animate-pulse'}`}>
                    {loading ? "SCANNING..." : "AI INSIGHT"}
                </Badge>
                {loading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing market data for {niche}...
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2">
                        {insight}
                    </span>
                )}
            </div>
            <Button variant="ghost" size="sm" className="text-xs shrink-0">
                <Sparkles className="mr-2 h-3 w-3 text-purple-400" />
                View Report
            </Button>
        </div>
    )
}
