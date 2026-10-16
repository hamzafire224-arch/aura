import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { TrendingUp, DollarSign, Clock, ArrowRight, Star, Quote } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const metrics = [
    { value: "$847M+", label: "Revenue Generated", icon: DollarSign },
    { value: "12,500+", label: "Businesses Launched", icon: TrendingUp },
    { value: "4.2 hrs", label: "Avg. Time to First Sale", icon: Clock },
    { value: "94%", label: "Customer Satisfaction", icon: Star }
]

const caseStudies = [
    {
        name: "Sarah Chen",
        company: "Luxe Home Decor",
        avatar: "/avatars/sarah.jpg",
        revenue: "$127,000/mo",
        timeframe: "6 months",
        quote: "AURA's AI validated my niche idea in minutes. What would have taken weeks of research happened before my morning coffee.",
        metrics: { before: "$0", after: "$127K/mo", growth: "∞" }
    },
    {
        name: "Marcus Johnson",
        company: "FitGear Pro",
        avatar: "/avatars/marcus.jpg",
        revenue: "$89,000/mo",
        timeframe: "4 months",
        quote: "The multi-agent debate system challenged my assumptions and found a positioning I never would have considered. Game-changer.",
        metrics: { before: "$12K/mo", after: "$89K/mo", growth: "641%" }
    },
    {
        name: "Elena Rodriguez",
        company: "Pet Paradise",
        avatar: "/avatars/elena.jpg",
        revenue: "$215,000/mo",
        timeframe: "8 months",
        quote: "From idea to $200K+ monthly revenue in under a year. AURA handled everything from product research to Shopify automation.",
        metrics: { before: "$0", after: "$215K/mo", growth: "∞" }
    }
]

const features = [
    { title: "AI Market Research", description: "Validate ideas with deep competitive analysis" },
    { title: "Multi-Agent Strategy", description: "Get perspectives from AI analysts, designers & chiefs" },
    { title: "One-Click Store Setup", description: "Launch a Shopify store in minutes, not weeks" },
    { title: "Automated Content", description: "Generate product descriptions & marketing copy" }
]

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>Our Results | AURA Increase</title>
            <meta name="description" content="See real results from AURA users - revenue generated, businesses launched, and success stories" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Real Results. Real Revenue.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        See how entrepreneurs are building successful businesses with AURA's AI-powered platform.
                    </motion.p>
                </section>

                {/* Key Metrics */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
                            >
                                <metric.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{metric.value}</div>
                                <div className="text-sm text-muted-foreground">{metric.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Case Studies */}
                <section className="container mx-auto px-4 mb-24">
                    <h2 className="text-3xl font-bold text-center mb-4">Success Stories</h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        From zero to significant monthly revenue. Here's how our users are building empires.
                    </p>
                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {caseStudies.map((study, index) => (
                            <motion.div
                                key={study.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-14 w-14">
                                        <AvatarImage src={study.avatar} />
                                        <AvatarFallback className="bg-primary/20 text-primary">
                                            {study.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold">{study.name}</h3>
                                        <p className="text-sm text-muted-foreground">{study.company}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">Before</div>
                                        <div className="font-bold">{study.metrics.before}</div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">After</div>
                                        <div className="font-bold text-primary">{study.metrics.after}</div>
                                    </div>
                                    <div className="ml-auto text-center">
                                        <div className="text-xs text-muted-foreground">Growth</div>
                                        <div className="font-bold text-green-400">{study.metrics.growth}</div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <Quote className="h-6 w-6 text-primary/30 mb-2" />
                                    <p className="text-muted-foreground italic">{study.quote}</p>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-sm">
                                    <span className="text-muted-foreground">Revenue: <span className="text-white font-medium">{study.revenue}</span></span>
                                    <span className="text-muted-foreground">Time: <span className="text-white font-medium">{study.timeframe}</span></span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">How AURA Delivers Results</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <div className="text-4xl font-bold text-primary/30 mb-4">{index + 1}</div>
                                <h3 className="font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Join thousands of entrepreneurs already building profitable businesses with AURA.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/signup">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/pricing">
                                <Button size="lg" variant="outline" className="border-white/20">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
