import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Users, Target, Zap, Globe, ArrowRight } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$2.4B", label: "Revenue Tracked" },
    { value: "180+", label: "Countries" },
    { value: "99.9%", label: "Uptime" }
]

const values = [
    {
        icon: Target,
        title: "Mission-Driven",
        description: "We're building the future of autonomous business operations, making entrepreneurship accessible to everyone."
    },
    {
        icon: Zap,
        title: "Innovation First",
        description: "We push boundaries with cutting-edge AI to solve problems that haven't been solved before."
    },
    {
        icon: Users,
        title: "Customer Obsessed",
        description: "Every feature we build starts with understanding our users' real pain points."
    },
    {
        icon: Globe,
        title: "Global Impact",
        description: "We're democratizing business tools for entrepreneurs worldwide, regardless of background."
    }
]

const timeline = [
    { year: "2024", event: "AURA founded with a vision to democratize AI business tools" },
    { year: "2025", event: "Reached 10,000 active users and $100M in tracked revenue" },
    { year: "2026", event: "Launched multi-agent AI system and expanded globally" }
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>About Us | AURA Increase</title>
            <meta name="description" content="Learn about AURA - the AI-powered platform revolutionizing e-commerce entrepreneurship" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Building the Future of Business
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        AURA is an AI-powered platform that empowers entrepreneurs to build, scale, and automate
                        their businesses with unprecedented ease. We believe everyone deserves access to the
                        tools that make success possible.
                    </motion.p>
                </section>

                {/* Stats */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Mission */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            To democratize access to AI-powered business tools, enabling anyone with an idea
                            to build a thriving business. We're not just building software—we're building
                            the infrastructure for the next generation of entrepreneurs.
                        </p>
                    </div>
                </section>

                {/* Values */}
                <section className="container mx-auto px-4 mb-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <value.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Timeline */}
                <section className="container mx-auto px-4 mb-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Journey</h2>
                    <div className="max-w-2xl mx-auto">
                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-6 mb-8 last:mb-0"
                            >
                                <div className="text-2xl font-bold text-primary w-20 shrink-0">{item.year}</div>
                                <div className="flex-1 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-muted-foreground">{item.event}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Be part of the future of autonomous business. Start building your empire today.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/signup">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/careers">
                                <Button size="lg" variant="outline" className="border-white/20">
                                    View Careers
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
