import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MapPin, Clock, ArrowRight, Heart, Zap, Users, Globe } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const benefits = [
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage" },
    { icon: Zap, title: "Unlimited PTO", description: "Take the time you need to recharge" },
    { icon: Users, title: "Remote-First", description: "Work from anywhere in the world" },
    { icon: Globe, title: "Equity", description: "Meaningful ownership in what we're building" }
]

const positions = [
    {
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        location: "Remote - Global",
        type: "Full-time",
        description: "Build the core platform powering thousands of businesses worldwide."
    },
    {
        title: "AI/ML Engineer",
        department: "AI Research",
        location: "Remote - Global",
        type: "Full-time",
        description: "Develop cutting-edge AI models for business automation."
    },
    {
        title: "Product Designer",
        department: "Design",
        location: "Remote - Global",
        type: "Full-time",
        description: "Shape the future of AI-powered business tools."
    },
    {
        title: "Growth Marketing Manager",
        department: "Marketing",
        location: "Remote - Global",
        type: "Full-time",
        description: "Drive user acquisition and engagement at scale."
    }
]

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>Careers | AURA Increase</title>
            <meta name="description" content="Join the AURA team - help us build the future of AI-powered business" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Build the Future with Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        We're on a mission to democratize AI for entrepreneurs. Join our team of
                        builders, dreamers, and innovators.
                    </motion.p>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Why AURA?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
                            >
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <benefit.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-bold mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Open Positions */}
                <section className="container mx-auto px-4 mb-24">
                    <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
                    <p className="text-center text-muted-foreground mb-12">
                        Find your next opportunity at AURA
                    </p>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {positions.map((position, index) => (
                            <motion.div
                                key={position.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {position.title}
                                            </h3>
                                            <Badge variant="outline" className="border-white/20">
                                                {position.department}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mb-3">{position.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {position.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {position.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Button className="shrink-0">
                                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            We're always looking for exceptional talent. Send us your resume and tell us how you'd contribute to AURA.
                        </p>
                        <Link to="/contact">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
