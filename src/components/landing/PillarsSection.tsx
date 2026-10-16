import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Zap, TrendingUp, Users } from "lucide-react"

const pillars = [
    {
        id: "intelligence",
        icon: Brain,
        title: "Intelligence",
        subtitle: "Autonomous Agents",
        description: "Your specialized AI workforce. From content strategists to visual designers, these agents don't just chat—they execute complex tasks autonomously.",
        features: [
            "Content Strategist Agent",
            "Visual Designer (DALL-E 3)",
            "Competitor Spy Agent",
            "Strategic Advisor"
        ],
        cta: "Meet Your Team",
        visual: "bg-gradient-to-br from-purple-500/20 to-blue-500/20"
    },
    {
        id: "operations",
        icon: Zap,
        title: "Operations",
        subtitle: "Smart Workflows",
        description: "Connect your tools and automate the mundane. Build complex logic flows that run 24/7 without your intervention.",
        features: [
            "Visual Workflow Builder",
            "Pre-built Recipes",
            "Cross-app Integrations",
            "Self-healing Errors"
        ],
        cta: "Automate Now",
        visual: "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"
    },
    {
        id: "growth",
        icon: TrendingUp,
        title: "Growth",
        subtitle: "Leads & Outreach",
        description: "Fuel your business with high-quality leads. Find, enrich, and contact potential customers on autopilot.",
        features: [
            "B2B Lead Finder",
            "Contact Enrichment",
            "Viral Hook Discovery",
            "Automatic CRM Sync"
        ],
        cta: "Find Leads",
        visual: "bg-gradient-to-br from-orange-500/20 to-amber-500/20"
    },
    {
        id: "monetization",
        icon: Users,
        title: "Monetization",
        subtitle: "Affiliates & Finance",
        description: "Turn users into partners and track every dollar. A complete financial command center.",
        features: [
            "Native Affiliate System",
            "Commission Tracking",
            "Financial Modeling",
            "Profit & Loss Analysis"
        ],
        cta: "Start Scaling",
        visual: "bg-gradient-to-br from-pink-500/20 to-rose-500/20"
    }
]

export default function PillarsSection() {
    return (
        <section className="w-full py-32 bg-black/40 border-y border-white/5">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        The 4 Pillars of <span className="text-primary">AURA</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        A complete operating system for your business. Four interconnected engines working in harmony to drive results.
                    </p>
                </div>

                <Tabs defaultValue="intelligence" className="w-full">
                    <div className="flex justify-center mb-16 overflow-x-auto pb-4 scrollbar-none">
                        <TabsList className="bg-white/5 border border-white/10 p-1.5 h-auto flex-wrap justify-center gap-2 rounded-full">
                            {pillars.map((pillar) => (
                                <TabsTrigger
                                    key={pillar.id}
                                    value={pillar.id}
                                    className="px-8 py-3 rounded-full text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                                >
                                    <pillar.icon className="mr-2 h-4 w-4" />
                                    {pillar.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {pillars.map((pillar) => (
                        <TabsContent key={pillar.id} value={pillar.id} className="mt-0 focus-visible:ring-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border-white/10 bg-card/30 backdrop-blur-sm overflow-hidden rounded-3xl">
                                    <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
                                        <div className="p-10 md:p-16 flex flex-col justify-center space-y-8">
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
                                                    <pillar.icon className="h-4 w-4" />
                                                    {pillar.subtitle}
                                                </div>
                                                <h3 className="text-4xl md:text-5xl font-bold leading-tight">{pillar.title}</h3>
                                                <p className="text-muted-foreground text-xl leading-relaxed">{pillar.description}</p>
                                            </div>

                                            <ul className="space-y-4">
                                                {pillar.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-lg">
                                                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="pt-6">
                                                <Link to="/signup">
                                                    <Button size="lg" className="h-12 px-8 text-base">
                                                        {pillar.cta}
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className={`relative ${pillar.visual} flex items-center justify-center p-12 overflow-hidden`}>
                                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                                            {/* Abstract Glass Card representing the "Engine" */}
                                            <div className="relative w-full aspect-square max-w-md bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-8 text-center group hover:scale-[1.02] transition-transform duration-500">
                                                <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                                                    <pillar.icon className="h-10 w-10 text-primary" />
                                                </div>
                                                <h4 className="text-2xl font-bold mb-2">{pillar.subtitle} Active</h4>
                                                <p className="text-sm text-muted-foreground">System Status: <span className="text-green-500 font-mono">ONLINE</span></p>

                                                {/* Animated Activity Bars */}
                                                <div className="flex gap-1 mt-8 h-12 items-end">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-2 bg-primary/40 rounded-t-sm"
                                                            style={{
                                                                height: `${Math.random() * 80 + 20}%`
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}
