import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MarketData } from "@/hooks/use-market-data"
import { Trash2 } from "lucide-react"

interface ViewProps {
    data: MarketData
}

export function CashFlowView({ data }: ViewProps) {
    const isCritical = data.business.runwayDays < 30
    const color = isCritical ? "bg-red-500" : "bg-blue-500"

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 max-w-5xl mx-auto h-full items-center">

            {/* FUEL GAUGE */}
            <Card className="bg-card/40 border-white/5 backdrop-blur-md p-8 space-y-8">
                <div>
                    <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-1">Runway Fuel Gauge</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-bold font-mono">{data.business.runwayDays}</span>
                        <span className="text-xl text-muted-foreground">Days Left</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative h-6 bg-black/20 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(data.business.runwayDays / 365 * 100, 100)}%` }}
                            className={`absolute inset-y-0 left-0 ${color} shadow-[0_0_20px_rgba(59,130,246,0.5)]`}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>DOOMSDAY</span>
                        <span>INFINITE</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                        <p className="text-xs text-muted-foreground mb-1">Monthly Burn</p>
                        <p className="text-xl font-mono text-red-400">-${data.business.burnRate.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                        <p className="text-xs text-muted-foreground mb-1">Cash on Hand</p>
                        <p className="text-xl font-mono text-white">${data.business.cash.toLocaleString()}</p>
                    </div>
                </div>
            </Card>

            {/* SUBSCRIPTION REAPER */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Subscription Reaper</h3>
                        <p className="text-sm text-muted-foreground">AI detected 3 unused recurring payments.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {[
                        { name: "Adobe Creative Cloud", cost: 59.99, lastUsed: "45 days ago" },
                        { name: "Midjourney Pro", cost: 30.00, lastUsed: "12 days ago" },
                        { name: "Figma Professional", cost: 15.00, lastUsed: "2 days ago" },
                    ].map((sub, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-white/5 hover:border-red-500/40 transition-colors group backdrop-blur-md">
                            <div>
                                <h4 className="font-bold">{sub.name}</h4>
                                <p className="text-xs text-muted-foreground">Last used: {sub.lastUsed}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-mono font-bold">${sub.cost}</span>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Kill It
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
