import { useMemo, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface RevenueChartProps {
    data: Array<{
        date: string
        revenue: number
        orders: number
        visitors: number
    }>
    isLoading?: boolean
}

export function RevenueChart({ data, isLoading = false }: RevenueChartProps) {
    const [timeRange, setTimeRange] = useState('30d')
    const [selectedMetrics, setSelectedMetrics] = useState({
        revenue: true,
        orders: true,
        visitors: false
    })

    const chartData = useMemo(() => {
        // Filter data based on time range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
        return data.slice(-days)
    }, [data, timeRange])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value)
    }

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium mb-2">{label}</p>
                    {payload.map((entry: any) => (
                        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-medium">
                                {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : formatNumber(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-9 w-32" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[400px] w-full" />
                    <div className="flex justify-center gap-4 mt-4">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                    No data available for this period.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Revenue Overview</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                                <SelectItem value="90d">Last 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                            <XAxis
                                dataKey="date"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(value) => `$${value / 1000}K`}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {selectedMetrics.revenue && (
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name="Revenue"
                                />
                            )}

                            {selectedMetrics.orders && (
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="hsl(var(--secondary))"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                    name="Orders"
                                />
                            )}

                            {selectedMetrics.visitors && (
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="hsl(var(--accent))"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorVisitors)"
                                    name="Visitors"
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Metric toggles */}
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                        onClick={() => setSelectedMetrics(prev => ({ ...prev, revenue: !prev.revenue }))}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${selectedMetrics.revenue ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        <div className="w-2 h-2 rounded-full bg-current" />
                        Revenue
                    </button>

                    <button
                        onClick={() => setSelectedMetrics(prev => ({ ...prev, orders: !prev.orders }))}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${selectedMetrics.orders ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25' : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        <div className="w-2 h-2 rounded-full bg-current" />
                        Orders
                    </button>

                    <button
                        onClick={() => setSelectedMetrics(prev => ({ ...prev, visitors: !prev.visitors }))}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${selectedMetrics.visitors ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25' : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        <div className="w-2 h-2 rounded-full bg-current" />
                        Visitors
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
