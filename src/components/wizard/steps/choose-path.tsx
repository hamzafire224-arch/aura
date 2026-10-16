import { Flame, Shirt, Briefcase, Globe, Video, Box } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const paths = [
    {
        id: "trend-hunter",
        icon: Flame,
        title: "Trend Hunter",
        subtitle: "Arbitrage & Dropshipping",
        description: "AI scans social media and marketplaces to find high-margin viral products for you to sell immediately.",
        time: "5-10 min",
        status: "active",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "hover:border-orange-500/50"
    },
    {
        id: "agency",
        icon: Briefcase,
        title: "Agency / Consulting",
        subtitle: "Service Based",
        description: "Build a high-ticket service business. AI helps define your niche, offer, and outreach strategy.",
        time: "5 min",
        status: "active",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "hover:border-blue-500/50"
    },
    {
        id: "saas",
        icon: Globe,
        title: "SaaS / Digital Product",
        subtitle: "Software & Info",
        description: "Launch a software tool or digital course. (Coming Soon)",
        time: "Coming Soon",
        status: "coming-soon",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "hover:border-purple-500/50"
    },
    {
        id: "content-creator",
        icon: Video,
        title: "Content Creator",
        subtitle: "Personal Brand",
        description: "Grow a personal brand and monetize via content. (Coming Soon)",
        time: "Coming Soon",
        status: "coming-soon",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        border: "hover:border-pink-500/50"
    },
    {
        id: "pod",
        icon: Shirt,
        title: "Print on Demand",
        subtitle: "Merch & Apparel",
        description: "Custom designed apparel and products. (Coming Soon)",
        time: "Coming Soon",
        status: "coming-soon",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "hover:border-yellow-500/50"
    },
    {
        id: "dropshipping",
        icon: Box,
        title: "Classic Dropshipping",
        subtitle: "E-Commerce",
        description: "Source specific products from suppliers. (Coming Soon)",
        time: "Coming Soon",
        status: "coming-soon",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        border: "hover:border-indigo-500/50"
    }
]

interface StepChoosePathProps {
    onSelect: (path: string) => void
}

export function StepChoosePath({ onSelect }: StepChoosePathProps) {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Choose Your Vehicle</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Select the business model that fits your goals. AURA customizes the AI pipeline for each path.
                </p>
            </div>

            <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {paths.map((path) => (
                    <Card
                        key={path.id}
                        className={cn(
                            "relative transition-all duration-300 border-2 overflow-hidden group",
                            path.status === 'active'
                                ? `cursor-pointer hover:-translate-y-1 ${path.border} hover:shadow-2xl hover:shadow-${path.color.split('-')[1]}-500/10`
                                : "opacity-60 cursor-not-allowed border-dashed bg-muted/20"
                        )}
                        onClick={() => path.status === 'active' && onSelect(path.id)}
                    >
                        {path.status === 'coming-soon' && (
                            <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground uppercase tracking-wider">
                                    Coming Soon
                                </Badge>
                            </div>
                        )}

                        <CardContent className="p-6 flex flex-col h-full gap-4">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", path.bg, path.color)}>
                                <path.icon className="h-7 w-7" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{path.title}</h3>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{path.subtitle}</p>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {path.description}
                            </p>

                            {path.status === 'active' && (
                                <div className="pt-4 mt-auto border-t border-border/50 flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        ⏱ Status:
                                    </span>
                                    <Badge variant="outline" className={cn("bg-background", path.color, "border-current opacity-70")}>
                                        Ready
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </motion.div>
        </div>
    )
}
