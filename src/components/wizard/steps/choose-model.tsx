import { motion } from "framer-motion"
import { ShoppingBag, Laptop, Users, Video, Printer, TrendingUp, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StepChooseModelProps {
    onSelect: (model: string) => void
}

export function StepChooseModel({ onSelect }: StepChooseModelProps) {
    const models = [
        {
            id: 'dropshipping',
            title: 'Dropshipping',
            description: 'Sell products without holding inventory. Source from global suppliers.',
            icon: ShoppingBag,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-400/20',
            active: true
        },
        {
            id: 'saas',
            title: 'SaaS / Digital',
            description: 'Build software or sell digital assets.',
            icon: Laptop,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/20',
            active: false
        },
        {
            id: 'agency',
            title: 'Agency',
            description: 'Offer high-ticket services or consulting.',
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-400/20',
            active: false
        },
        {
            id: 'creator',
            title: 'Content Creator',
            description: 'Monetize an audience on social media.',
            icon: Video,
            color: 'text-pink-400',
            bg: 'bg-pink-400/10',
            border: 'border-pink-400/20',
            active: false
        },
        {
            id: 'pod',
            title: 'Print on Demand',
            description: 'Custom designs on apparel and merch.',
            icon: Printer,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            border: 'border-orange-400/20',
            active: false
        },
        {
            id: 'arbitrage',
            title: 'Trend Arbitration',
            description: 'Capitalize on viral market gaps.',
            icon: TrendingUp,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            border: 'border-yellow-400/20',
            active: false
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Choose Your Business Model</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Select the architecture for your new venture. The AURA Engine will adapt its intelligence to your choice.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {models.map((model) => (
                    <motion.div
                        key={model.id}
                        whileHover={model.active ? { y: -5, scale: 1.02 } : {}}
                        whileTap={model.active ? { scale: 0.98 } : {}}
                        className={`relative group ${!model.active ? 'opacity-50 grayscale-[0.5] cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => model.active && onSelect(model.id)}
                    >
                        <Card className={`h-full p-6 border-2 transition-all duration-300 relative overflow-hidden ${model.active ? `${model.border} bg-card/50 hover:bg-card/80 hover:shadow-2xl hover:shadow-${model.color}/20` : 'border-white/5'}`}>

                            {/* Background Glow */}
                            {model.active && (
                                <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${model.bg}`} />
                            )}

                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-xl ${model.bg} ${model.color}`}>
                                        <model.icon className="h-6 w-6" />
                                    </div>
                                    {!model.active && (
                                        <Badge variant="secondary" className="bg-black/40 text-xs border-white/10 gap-1">
                                            <Lock className="h-3 w-3" /> Coming Soon
                                        </Badge>
                                    )}
                                    {model.active && (
                                        <Badge className={`${model.bg} ${model.color} border-0`}>Available</Badge>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-1">{model.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {model.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
