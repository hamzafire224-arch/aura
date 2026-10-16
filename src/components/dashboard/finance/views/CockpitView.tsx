import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, DollarSign, Wallet, Activity } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"
import type { MarketData } from "@/hooks/use-market-data"

interface ViewProps {
    data: MarketData
}

// Custom Active Shape for Donut
const renderActiveShape = (props: any) => {
    const { cx, cy, fill } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={8} stroke={fill} fill="none" />
            <path d={props.d} stroke={fill} fill={fill} />
        </g>
    );
};

// Generate Chart Data based on current Net Worth to look realistic
const generateHistory = (currentNetWorth: number) => {
    const data = []
    let value = currentNetWorth * 0.85 // Start 15% lower 30 days ago
    for (let i = 30; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        // Add some noise
        const noise = (Math.random() - 0.4) * (currentNetWorth * 0.02)
        value = value * 1.005 + noise // Subtle upward trend
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: Math.floor(value)
        })
    }
    // Ensure last point matches current
    data[data.length - 1].value = currentNetWorth
    return data
}

export function CockpitView({ data }: ViewProps) {
    const assetData = [
        { name: "Crypto", value: (data.crypto.btc.price * 0.5 + data.crypto.eth.price * 4), color: "#8b5cf6" },
        { name: "Stocks", value: data.stocks.netWorth * 0.4, color: "#3b82f6" },
        { name: "Business", value: data.business.cash, color: "#10b981" },
    ]

    const chartData = useMemo(() => generateHistory(data.stocks.netWorth), [data.stocks.netWorth])

    const kpiCards = [
        {
            title: "Total Net Worth",
            value: `$${(data.stocks.netWorth).toLocaleString([], { maximumFractionDigits: 0 })}`,
            change: "+12.4%",
            trend: "up",
            icon: Wallet,
            color: "text-emerald-500"
        },
        {
            title: "Daily P&L",
            value: "+$1,240.50",
            change: "+1.2%",
            trend: "up",
            icon: TrendingUp,
            color: "text-blue-500"
        },
        {
            title: "Monthly Burn",
            value: `-$${data.business.burnRate.toLocaleString()}`,
            change: "-2.5%",
            trend: "down", // Down is good for burn, but we show red for cost
            icon: DollarSign,
            color: "text-rose-500"
        },
        {
            title: "Runway",
            value: `${data.business.runwayDays} Days`,
            change: "Stable",
            trend: "up",
            icon: Activity,
            color: "text-amber-500"
        }
    ]

    return (
        <div className="space-y-6 h-full p-6 max-w-[1600px] mx-auto animate-in fade-in">

            {/* KPI GRID - MATCHING ANALYTICS.TSX */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((kpi, i) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-card/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {kpi.title}
                                </CardTitle>
                                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold font-mono">{kpi.value}</div>
                                <p className={`text-xs ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'} flex items-center mt-1`}>
                                    {kpi.change} from last period
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* MAIN CHART AREA - MATCHING ANALYTICS.TSX */}
            <div className="grid gap-6 md:grid-cols-3 h-[400px]">
                {/* WEALTH GROWTH CHART */}
                <Card className="md:col-span-2 bg-card/40 backdrop-blur-md border-white/5 flex flex-col">
                    <CardHeader>
                        <CardTitle>Portfolio Growth</CardTitle>
                        <CardDescription>30-Day performance across all assets</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#666"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#666"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0E14CC', borderColor: '#333', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* ASSET ALLOCATION DONUT */}
                <Card className="h-full bg-card/40 border-white/5 backdrop-blur-md flex flex-col relative overflow-hidden">
                    <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                        <CardDescription>Current diversification</CardDescription>
                    </CardHeader>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    activeShape={renderActiveShape}
                                >
                                    {assetData.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0E14CC', borderColor: '#333', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-10">
                            <span className="text-xs text-muted-foreground uppercase">Top Asset</span>
                            <span className="text-xl font-bold text-white">Crypto</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
