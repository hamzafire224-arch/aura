import { Area, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export interface TrafficData {
    date: string
    visitors: number
    revenue?: number
}

interface TrafficChartProps {
    data: TrafficData[]
}

export function TrafficChart({ data }: TrafficChartProps) {
    return (
        <Card className="bg-card/40 backdrop-blur-md border-white/5 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Revenue vs Traffic</CardTitle>
                        <CardDescription>
                            Correlation between site visitors and actual sales.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 gap-1">
                            <TrendingUp className="h-3 w-3" /> +12.5% Conversion
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-0">
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#e5e5e5' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar yAxisId="right" dataKey="visitors" name="Visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.6} />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
