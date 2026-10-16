import { motion } from "framer-motion"
import { Briefcase, Zap, TrendingUp, Rocket, Wand2, BrainCircuit } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const problems = [
    {
        icon: Briefcase,
        title: "Stuck in 9-5 corporate prison",
        description: "Dreaming of freedom but don't know where to start. The path to entrepreneurship feels overwhelming and risky."
    },
    {
        icon: Zap,
        title: "Marketing is overwhelming",
        description: "Instagram, TikTok, SEO, ads... where do you even begin? Trying to learn it all leads to burnout."
    },
    {
        icon: TrendingUp,
        title: "Money management is stressful",
        description: "Should you reinvest? Save? Hire? No idea. Financial uncertainty kills more businesses than bad products."
    }
]

const solutions = [
    {
        icon: Rocket,
        title: "Launch in 1 hour, not 6 months",
        description: "AI builds your entire business from one sentence. Branding, store, products - done instantly.",
        badge: "90% time saved"
    },
    {
        icon: Wand2,
        title: "AI creates all your content",
        description: "Social posts, ads, blogs - done. Every. Single. Day. Your brand grows while you sleep.",
        badge: "30 days in 5 mins"
    },
    {
        icon: BrainCircuit,
        title: "Smart money moves, explained",
        description: "AI analyzes your profits and tells you exactly what to do next. Like a CFO in your pocket.",
        badge: "140% ROI increase"
    }
]

export default function ProblemSolutionSection() {
    return (
        <section className="relative w-full py-24 overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Problem Side (Darker) */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                                The Old Way: <br />
                                <span className="text-muted-foreground">Hard, Lonely, & Risky</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Most entrepreneurs fail because they try to wear every hat at once. It's not your fault—it's the system.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {problems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="bg-card/50 border-white/5 hover:bg-card/80 transition-colors">
                                        <CardContent className="flex items-start gap-4 p-6">
                                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Solution Side (Lighter/Accent) */}
                    <div className="space-y-8 relative">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />

                        <div className="space-y-4 relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                                The AURA Way: <br />
                                <span className="text-primary">Fast, Automated, & Smart</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Replace an entire team of experts with one intelligent system. Focus on your vision, let AI handle the rest.
                            </p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {solutions.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3">
                                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/20 text-primary">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <CardContent className="flex items-start gap-4 p-6">
                                            <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
