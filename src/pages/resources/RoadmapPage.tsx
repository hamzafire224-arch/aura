import { motion } from "framer-motion"
import { Rocket, Check, Clock, Sparkles, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const roadmapItems = [
    {
        quarter: "Q1 2026",
        status: "completed",
        items: [
            { title: "Multi-Agent Debate System", description: "AI agents that challenge and validate business ideas" },
            { title: "Shopify Deep Integration", description: "One-click product sync and store management" },
            { title: "Affiliate Program Launch", description: "40% recurring commissions for partners" }
        ]
    },
    {
        quarter: "Q2 2026",
        status: "in-progress",
        items: [
            { title: "Mobile App (iOS & Android)", description: "Full-featured mobile experience" },
            { title: "Advanced Analytics Dashboard", description: "Deeper insights into business performance" },
            { title: "Workflow Automation Builder", description: "Visual no-code automation creator" }
        ]
    },
    {
        quarter: "Q3 2026",
        status: "planned",
        items: [
            { title: "AI Video Generation", description: "Create product videos automatically" },
            { title: "Multi-Store Management", description: "Manage multiple stores from one dashboard" },
            { title: "Team Collaboration", description: "Invite team members with role-based access" }
        ]
    },
    {
        quarter: "Q4 2026",
        status: "planned",
        items: [
            { title: "AI Voice Assistants", description: "Voice-activated business commands" },
            { title: "Marketplace Integrations", description: "Amazon, eBay, Etsy connections" },
            { title: "Custom AI Training", description: "Train AI on your brand voice and data" }
        ]
    }
]

const statusColors = {
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    "in-progress": "bg-primary/20 text-primary border-primary/30",
    planned: "bg-white/10 text-muted-foreground border-white/20"
}

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>Product Roadmap | AURA Increase</title>
            <meta name="description" content="See what's coming next for AURA - our product roadmap and upcoming features" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Rocket className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary">Building the Future</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Product Roadmap
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        See what we're building and what's coming next. Your feedback shapes our priorities.
                    </motion.p>
                </section>

                {/* Legend */}
                <section className="container mx-auto px-4 mb-12">
                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-sm text-muted-foreground">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            <span className="text-sm text-muted-foreground">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-white/30" />
                            <span className="text-sm text-muted-foreground">Planned</span>
                        </div>
                    </div>
                </section>

                {/* Roadmap */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {roadmapItems.map((quarter, qIndex) => (
                            <motion.div
                                key={quarter.quarter}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: qIndex * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-bold">{quarter.quarter}</h2>
                                    <Badge className={statusColors[quarter.status as keyof typeof statusColors]}>
                                        {quarter.status === "in-progress" ? "In Progress" : quarter.status === "completed" ? "Completed" : "Planned"}
                                    </Badge>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {quarter.items.map((item) => (
                                        <div
                                            key={item.title}
                                            className={`p-6 rounded-xl border ${quarter.status === "completed" ? "bg-green-500/5 border-green-500/20" : quarter.status === "in-progress" ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/10"}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {quarter.status === "completed" ? (
                                                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                                ) : quarter.status === "in-progress" ? (
                                                    <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                ) : (
                                                    <Sparkles className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                                                )}
                                                <div>
                                                    <h3 className="font-semibold mb-1">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Have a Feature Request?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            We'd love to hear from you. Your feedback directly shapes our roadmap.
                        </p>
                        <Link to="/contact">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Submit Feedback <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
