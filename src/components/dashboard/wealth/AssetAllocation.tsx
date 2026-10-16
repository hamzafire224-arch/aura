import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
    { name: "Crypto", value: 45, color: "#f59e0b" }, // Amber
    { name: "Stocks", value: 30, color: "#3b82f6" }, // Blue
    { name: "Cash", value: 15, color: "#10b981" },   // Emerald
    { name: "Real Estate", value: 10, color: "#8b5cf6" }, // Purple
]

export function AssetAllocation() {
    return (
        <Card className="bg-card/40 backdrop-blur-md border-white/5 h-full">
            <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>
                    Portfolio distribution by class.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#e5e5e5' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
