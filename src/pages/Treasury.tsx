import { useState, useEffect, useCallback } from "react"
import { 
    DollarSign, 
    TrendingUp, 
    CreditCard, 
    Wallet, 
    Receipt, 
    Users, 
    RefreshCw, 
    Loader2, 
    ShieldCheck, 
    Building2,
    Calendar,
    CircleDollarSign
} from "lucide-react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useBusiness } from "@/contexts/BusinessContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export interface OrderRecord {
    id: string
    business_id: string
    customer_email: string | null
    customer_name: string | null
    total_amount: number
    currency: string
    status: string
    created_at: string
    stripe_session_id?: string | null
    items?: any
}

interface TreasuryMetrics {
    grossVolume: number
    netProfit: number
    liquidBalance: number
    activeSubscriptions: number
    totalExpenses: number
    thirtyDayVolume: number
    profitMargin: number
}

interface DailyTimeSeriesPoint {
    date: string
    fullDate: string
    volume: number
    ordersCount: number
}

export default function Treasury() {
    const { businesses } = useBusiness()
    const activeBusiness = businesses[0]

    const [metrics, setMetrics] = useState<TreasuryMetrics>({
        grossVolume: 0,
        netProfit: 0,
        liquidBalance: 0,
        activeSubscriptions: 0,
        totalExpenses: 0,
        thirtyDayVolume: 0,
        profitMargin: 0
    })

    const [chartData, setChartData] = useState<DailyTimeSeriesPoint[]>([])
    const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Formatter utility
    const formatCurrency = (amount: number, currency = "USD") => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    // 1. DATA AGGREGATION HELPER (Last 30 Days Continuous Timeseries)
    const buildThirtyDayTimeline = (orders: OrderRecord[]): DailyTimeSeriesPoint[] => {
        const daysMap = new Map<string, { volume: number; count: number }>()
        const now = new Date()

        const datePoints: { key: string; display: string }[] = []
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i)
            const key = d.toISOString().split("T")[0] // "YYYY-MM-DD"
            const display = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            datePoints.push({ key, display })
            daysMap.set(key, { volume: 0, count: 0 })
        }

        orders.forEach((order) => {
            if (!order.created_at) return
            const orderDateKey = new Date(order.created_at).toISOString().split("T")[0]
            if (daysMap.has(orderDateKey)) {
                const current = daysMap.get(orderDateKey)!
                current.volume += Number(order.total_amount) || 0
                current.count += 1
            }
        })

        return datePoints.map(({ key, display }) => {
            const data = daysMap.get(key) || { volume: 0, count: 0 }
            return {
                fullDate: key,
                date: display,
                volume: Math.round(data.volume * 100) / 100,
                ordersCount: data.count,
            }
        })
    }

    // 2. REAL-TIME DATA FETCHING
    const loadFinancialData = useCallback(async (showFullLoader = false) => {
        if (!activeBusiness?.id) {
            setIsLoading(false)
            return
        }

        if (showFullLoader) setIsLoading(true)
        else setIsRefreshing(true)

        try {
            // A. Fetch Business Financials directly from businesses table
            const { data: businessData, error: businessError } = await supabase
                .from("businesses")
                .select("total_revenue, revenue, expenses, profit, margin")
                .eq("id", activeBusiness.id)
                .single()

            if (businessError) {
                console.error("Error fetching business financials:", businessError)
            }

            // B. Fetch Last 30 Days of Paid Orders for Chart Aggregation
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            const { data: orders30Days, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .eq("business_id", activeBusiness.id)
                .eq("status", "paid")
                .gte("created_at", thirtyDaysAgo.toISOString())
                .order("created_at", { ascending: true })

            if (ordersError) {
                console.error("Error fetching 30-day orders:", ordersError)
            }

            // C. Fetch Recent Transactions (last 10 orders regardless of status for audit visibility)
            const { data: recentTransactions, error: recentError } = await supabase
                .from("orders")
                .select("*")
                .eq("business_id", activeBusiness.id)
                .order("created_at", { ascending: false })
                .limit(10)

            if (recentError) {
                console.error("Error fetching recent transactions:", recentError)
            }

            // D. Fetch Active Subscriptions Count
            const { count: activeSubsCount } = await supabase
                .from("subscriptions")
                .select("*", { count: "exact", head: true })
                .eq("status", "active")

            // E. Compute Aggregated Metrics
            const verifiedOrders = orders30Days || []
            const thirtyDaySum = verifiedOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)

            const lifetimeRevenue = Number(businessData?.total_revenue || businessData?.revenue || thirtyDaySum)
            const totalExpenses = Number(businessData?.expenses || 0)
            const computedProfit = businessData?.profit !== undefined && businessData?.profit !== null
                ? Number(businessData.profit)
                : lifetimeRevenue - totalExpenses

            const computedLiquidBalance = lifetimeRevenue - totalExpenses
            const marginCalc = lifetimeRevenue > 0 
                ? (computedProfit / lifetimeRevenue) * 100 
                : 0

            setMetrics({
                grossVolume: lifetimeRevenue,
                netProfit: computedProfit,
                liquidBalance: Math.max(0, computedLiquidBalance),
                activeSubscriptions: activeSubsCount || 0,
                totalExpenses: totalExpenses,
                thirtyDayVolume: thirtyDaySum,
                profitMargin: Math.round(marginCalc * 10) / 10,
            })

            // Generate timeline for recharts
            const timeline = buildThirtyDayTimeline(verifiedOrders)
            setChartData(timeline)

            // Set recent orders
            setRecentOrders(recentTransactions || [])

        } catch (err: any) {
            console.error("Failed to load financial telemetry:", err)
            toast.error("Telemetry sync failed: " + (err.message || "Unknown error"))
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [activeBusiness?.id])

    // Subscription & initial load
    useEffect(() => {
        if (!activeBusiness?.id) {
            setIsLoading(false)
            return
        }

        let isMounted = true
        loadFinancialData(true)

        // Real-Time Postgres Channel: Orders & Businesses Updates
        const channel = supabase
            .channel(`treasury_telemetry_${activeBusiness.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                    filter: `business_id=eq.${activeBusiness.id}`,
                },
                () => {
                    if (isMounted) loadFinancialData(false)
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "businesses",
                    filter: `id=eq.${activeBusiness.id}`,
                },
                () => {
                    if (isMounted) loadFinancialData(false)
                }
            )
            .subscribe()

        return () => {
            isMounted = false
            supabase.removeChannel(channel)
        }
    }, [activeBusiness?.id, loadFinancialData])

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload as DailyTimeSeriesPoint
            return (
                <div className="rounded-xl border border-white/10 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md">
                    <p className="text-xs font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-cyan-400" />
                        {label} ({dataPoint.fullDate})
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <span className="text-xs text-zinc-300">Gross Volume:</span>
                        <span className="text-sm font-bold text-white font-mono">
                            {formatCurrency(payload[0].value)}
                        </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono mt-1">
                        {dataPoint.ordersCount} verified order{dataPoint.ordersCount !== 1 ? "s" : ""}
                    </p>
                </div>
            )
        }
        return null
    }

    // Loading State View
    if (isLoading) {
        return (
            <div className="h-full w-full p-6 pt-12 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-4" />
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                    Aggregating Financial Telemetry // Reconciling Ledger...
                </p>
            </div>
        )
    }

    // No Business Guard View
    if (!activeBusiness) {
        return (
            <div className="h-full w-full p-6 pt-12 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                    <Building2 className="h-10 w-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Active Business Profile</h2>
                <p className="text-zinc-400 text-sm max-w-md">
                    Please select or provision an active business to view financial metrics and telemetry.
                </p>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-6 pt-10 overflow-y-auto space-y-8 max-w-7xl mx-auto">
            {/* 1. Header Command Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                            <Wallet className="h-7 w-7 text-cyan-400" />
                            Treasury & Revenue Aggregator
                        </h1>
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase tracking-wider">
                            Live Telemetry
                        </Badge>
                    </div>
                    <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        Entity: <span className="text-zinc-200 font-semibold">{activeBusiness.name}</span>
                        <span className="text-zinc-600">//</span>
                        <span>Zero-Liability Settlement Architecture</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadFinancialData(false)}
                        disabled={isRefreshing}
                        className="border-white/10 hover:bg-white/5 text-zinc-300 h-9 font-mono text-xs"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                        Re-Audit
                    </Button>
                </div>
            </div>

            {/* 2. Top Metric Cards (Gross Volume, Net Profit, Liquid Balance, Active Subscriptions) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gross Volume */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-cyan-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Gross Volume
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <DollarSign className="h-4 w-4 text-cyan-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-white">
                            {formatCurrency(metrics.grossVolume)}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-zinc-400">
                            <span className="text-cyan-400 font-semibold">{formatCurrency(metrics.thirtyDayVolume)}</span>
                            <span>last 30d</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Net Profit */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-emerald-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Net Profit
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-emerald-400">
                            {formatCurrency(metrics.netProfit)}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-zinc-400">
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] px-1.5 py-0">
                                {metrics.profitMargin}% margin
                            </Badge>
                            <span>after COGS</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Liquid Balance */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-purple-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Liquid Balance
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <CircleDollarSign className="h-4 w-4 text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-purple-300">
                            {formatCurrency(metrics.liquidBalance)}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-zinc-400">
                            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                            <span>Vault Unallocated</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Subscriptions */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-amber-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Active Subscriptions
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Users className="h-4 w-4 text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-white">
                            {metrics.activeSubscriptions}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-zinc-400">
                            <span className="text-amber-400 font-semibold">Active ARR Streams</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Dynamic Data Visualization: 30-Day Gross Volume Area Chart */}
            <Card className="bg-zinc-950/60 border-white/5">
                <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-cyan-400" />
                                Gross Volume Telemetry
                            </CardTitle>
                            <CardDescription className="text-zinc-400 text-xs font-mono mt-1">
                                Verified order transactions aggregated daily across connected payment gateways
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-white/5 text-zinc-300 font-mono text-xs border border-white/5">
                                30-Day Window
                            </Badge>
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-xs">
                                Settled: {formatCurrency(metrics.thirtyDayVolume)}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="grossVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#71717a" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={{ stroke: '#27272a' }}
                                    minTickGap={25}
                                />
                                <YAxis 
                                    stroke="#71717a" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="volume" 
                                    stroke="#06b6d4" 
                                    strokeWidth={2.5}
                                    fillOpacity={1} 
                                    fill="url(#grossVolumeGradient)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Recent Transactions Table */}
            <Card className="bg-zinc-950/60 border-white/5">
                <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-cyan-400" />
                            Recent Ingress Transactions
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-xs font-mono mt-1">
                            Audited ledger records emitted from verified Stripe, Lemon Squeezy & Shopify webhooks
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-zinc-400 text-xs font-mono">
                        {recentOrders.length} Records
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-black/40 border-b border-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-zinc-400 font-mono text-xs uppercase">Order / Session</TableHead>
                                <TableHead className="text-zinc-400 font-mono text-xs uppercase">Customer</TableHead>
                                <TableHead className="text-zinc-400 font-mono text-xs uppercase">Gateway / Type</TableHead>
                                <TableHead className="text-zinc-400 font-mono text-xs uppercase">Timestamp</TableHead>
                                <TableHead className="text-zinc-400 font-mono text-xs uppercase">Status</TableHead>
                                <TableHead className="text-zinc-400 font-mono text-xs uppercase text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-zinc-500 font-mono text-xs">
                                        No transactions recorded yet. Incoming verified webhooks will appear here in real-time.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recentOrders.map((order) => {
                                    const dateStr = new Date(order.created_at).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    const orderLabel = order.stripe_session_id 
                                        ? `STRIPE-${order.stripe_session_id.slice(-6).toUpperCase()}`
                                        : `ORD-${order.id.slice(0, 8).toUpperCase()}`

                                    return (
                                        <TableRow key={order.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="font-mono text-xs text-zinc-200">
                                                {orderLabel}
                                            </TableCell>
                                            <TableCell className="text-xs text-zinc-300">
                                                <div>{order.customer_name || order.customer_email || "Anonymous Customer"}</div>
                                                {order.customer_email && order.customer_name && (
                                                    <div className="text-[11px] text-zinc-500 font-mono">{order.customer_email}</div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs font-mono text-zinc-400">
                                                {order.stripe_session_id ? "Stripe Checkout" : "Direct Webhook"}
                                            </TableCell>
                                            <TableCell className="text-xs font-mono text-zinc-400">
                                                {dateStr}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                                                        order.status === "paid"
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                            : order.status === "shipped"
                                                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                                                            : order.status === "pending"
                                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                                                    }`}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-semibold text-sm text-zinc-100">
                                                {formatCurrency(Number(order.total_amount), order.currency || "USD")}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
