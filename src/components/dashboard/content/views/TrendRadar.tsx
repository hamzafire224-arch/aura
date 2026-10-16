import { useEffect, useState } from "react"
import { TrendScout, type TrendReport } from "@/lib/agents/content/trend-scout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowUpRight } from "lucide-react"

export function TrendRadar() {
    const [trends, setTrends] = useState<TrendReport[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const scanTrends = async () => {
        setIsLoading(true)
        try {
            const scout = new TrendScout()
            // Using a default niche for now, could be dynamic
            const results = await scout.scan("Tech & AI")
            setTrends(results)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        scanTrends()
    }, [])

    return (
        <div className="p-6 h-full overflow-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        Trend Radar <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span></span>
                    </h1>
                    <p className="text-muted-foreground">Live intelligence from TikTok, Google, and X.</p>
                </div>
                <Button onClick={() => scanTrends()} disabled={isLoading} variant="outline" className="border-pink-500/20 hover:bg-pink-500/10 hover:text-pink-500">
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Intel
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trends.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-20 text-muted-foreground bg-card/40 rounded-xl border border-white/5 mx-auto w-full max-w-md p-10 backdrop-blur-md">
                        <RefreshCw className="h-10 w-10 mx-auto mb-4 text-slate-500 opacity-50" />
                        No trends detected. Initialize scan.
                    </div>
                )}

                {trends.map((trend, i) => (
                    <Card key={i} className="bg-card/40 border-white/5 backdrop-blur-md p-6 space-y-4 hover:border-pink-500/40 transition-all cursor-pointer group shadow-sm hover:shadow-pink-500/10">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/20">
                                {trend.platform}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">{trend.volume} Vol</span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold group-hover:text-pink-400 transition-colors">{trend.topic}</h3>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{trend.context}</p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs font-mono text-green-400 flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> Explosive
                            </span>
                            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-xs h-7">
                                Create Strategy
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
