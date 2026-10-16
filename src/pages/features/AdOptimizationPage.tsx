import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Target, TrendingUp, ArrowRight, Check, BarChart, Eye } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

const features = [
    { icon: Target, title: "AI Creative Generation", description: "Generate ad creatives that convert with AI-powered design" },
    { icon: Eye, title: "Audience Insights", description: "Discover hidden audience segments for better targeting" },
    { icon: BarChart, title: "ROAS Optimization", description: "Automatically optimize campaigns for maximum return" },
    { icon: TrendingUp, title: "Performance Tracking", description: "Real-time dashboards for all your ad platforms" }
]

const platforms = ["Meta Ads", "Google Ads", "TikTok Ads", "Pinterest Ads"]

const benefits = [
    "Generate 50+ ad variations in minutes",
    "A/B test creatives automatically",
    "Reduce CAC by 35% on average",
    "AI-optimized audience targeting",
    "Unified dashboard for all platforms"
]

export default function AdOptimizationPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>Ad Optimization | AURA Increase</title>
            <meta name="description" content="AI-powered ad creative generation and ROAS optimization for e-commerce" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary">Pixel Perfect AI</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Ads That Actually Convert
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        Generate high-converting ad creatives, optimize targeting, and maximize ROAS
                        with AI that learns from millions of successful campaigns.
                    </motion.p>
                    <Link to="/signup">
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            Optimize Your Ads <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </section>

                {/* Platforms */}
                <section className="container mx-auto px-4 mb-12">
                    <div className="flex flex-wrap justify-center gap-4">
                        {platforms.map((platform) => (
                            <div key={platform} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm">
                                {platform}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Stats */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-bold text-primary mb-2">35%</div>
                            <div className="text-muted-foreground">Lower CAC</div>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-bold text-primary mb-2">2.4x</div>
                            <div className="text-muted-foreground">Average ROAS Improvement</div>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-bold text-primary mb-2">50+</div>
                            <div className="text-muted-foreground">Ad Variations per Campaign</div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">Why Pixel Perfect?</h2>
                        <div className="space-y-3">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-3 p-4 rounded-lg bg-white/5"
                                >
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <span>{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Stop Wasting Ad Spend</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Let AI optimize your campaigns for maximum return.
                        </p>
                        <Link to="/signup">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Start Optimizing <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
