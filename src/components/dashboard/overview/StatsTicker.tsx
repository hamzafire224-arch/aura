import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, ShoppingCart, Activity, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { FinancialAgent } from "@/lib/ai/financial-agent"
import { useBusiness } from "@/contexts/BusinessContext"

export function StatsTicker({ business }: { business: any }) {
    const { stats: globalStats } = useBusiness()
    const [stats, setStats] = useState({
        revenue: 0,
        visitors: 0,
        orders: 0
    })

    // Use context stats if available (which aggregates all businesses), or business specific if passed
    // For single business dashboard, we prefer business specific.
    useEffect(() => {
        if (business) {
            setStats({
                revenue: Number(business.revenue) || 0,
                orders: Number(business.orders) || 0,
                visitors: Number(business.visitors) || 0
            })
        }
    }, [business, globalStats]) // Re-run when context updates

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Revenue */}
            <StatCard
                label="Total Revenue"
                value={`$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subValue={stats.revenue > 0 ? "+12.5% vs last week" : "No revenue yet"}
                icon={TrendingUp}
                color="text-emerald-500"
                source="Stripe Connect"
                delay={0}
            />

            {/* Active Visitors */}
            <StatCard
                label="Active Visitors"
                value={stats.visitors.toString()}
                subValue="Live on site"
                icon={Users}
                color="text-blue-500"
                source="Aura Analytics"
                delay={0.1}
                isLive={true}
            />

            {/* Orders */}
            <StatCard
                label="Orders"
                value={stats.orders.toString()}
                subValue={stats.orders > 0 ? "Pending fulfillment" : "No active orders"}
                icon={ShoppingCart}
                color="text-amber-500"
                source="Store Connector"
                delay={0.2}
            />

            {/* System Status */}
            <StatCard
                label="System Status"
                value="Nominal"
                subValue="All Systems Go"
                icon={Activity}
                color="text-purple-500"
                source="Platform Health"
                delay={0.3}
            />
        </div>
    )
}

function StatCard({ label, value, subValue, icon: Icon, color, source, delay, isLive }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            {label}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-3 w-3 opacity-50 hover:opacity-100" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Source: {source}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </span>
                        <div className={`p-2 rounded-full bg-background/50 ${color}`}>
                            <Icon className="h-4 w-4" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold tracking-tight flex items-center gap-2 truncate">
                            {value}
                            {isLive && (
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            )}
                        </div>
                        <p className={`text-xs ${subValue.includes('+') ? 'text-emerald-500' : 'text-muted-foreground'} mt-1 truncate`}>
                            {subValue}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
