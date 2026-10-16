import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shirt, TrendingUp, Users, Wallet, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"

export function QuickActions({ isService }: { isService: boolean }) {
    const actions = [
        {
            label: "New Product",
            icon: Shirt,
            path: "?tab=merch",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            show: !isService
        },
        {
            label: "Market Scan",
            icon: TrendingUp,
            path: "?tab=trends",
            color: "text-pink-400",
            bg: "bg-pink-500/10",
            show: true
        },
        {
            label: "Find Leads",
            icon: Users,
            path: "?tab=leads",
            color: "text-blue-400",
            bg: "bg-blue-500/10", // Fixed missing bg
            show: isService
        },
        {
            label: "Financials",
            icon: Wallet,
            path: "?tab=finance",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            show: true
        }
    ]

    return (
        <Card className="h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-lg">Quick Launch</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 flex-1">
                {actions.filter(a => a.show).slice(0, 4).map((action, i) => (
                    <Link to={action.path} key={i} className="contents">
                        <Button
                            variant="outline"
                            className="h-full flex-col gap-3 border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
                        >
                            <div className={`p-3 rounded-full ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                <action.icon className="h-6 w-6" />
                            </div>
                            <span className="font-medium">{action.label}</span>
                            <ArrowUpRight className="absolute top-3 right-3 h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
