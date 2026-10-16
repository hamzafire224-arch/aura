import { motion } from "framer-motion"
import { Bot, Zap, BarChart3, Globe, Shield, Cpu } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"

const features = [
    {
        icon: Bot,
        title: "AI Content Studio",
        description: "Generate viral social media posts, blogs, and ad copy in seconds using advanced LLMs.",
        link: "/features/content-studio"
    },
    {
        icon: Zap,
        title: "Business Wizard",
        description: "Launch a fully functional business from scratch. From naming to business plan in 5 minutes.",
        link: "/features/business-wizard"
    },
    {
        icon: BarChart3,
        title: "Financial Hub",
        description: "Track revenue, expenses, and profit margins with real-time analytics and forecasting.",
        link: "/features/financial-hub"
    },
    {
        icon: Globe,
        title: "Global Affiliate System",
        description: "Scale your reach with a built-in affiliate network. Track referrals and automate payouts.",
        link: "/features/affiliate-system"
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade encryption and data protection for your business assets.",
        link: "/security"
    },
    {
        icon: Cpu,
        title: "Smart Automation",
        description: "Automate repetitive tasks and workflows with our intelligent agent system.",
        link: "/workflows" // Assuming this links to login/dashboard or a dedicated page if I had one
    }
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/20">
            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Power Beyond Limits
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        AURA provides the most comprehensive suite of AI tools ever assembled for entrepreneurs.
                    </motion.p>
                </section>

                {/* Grid */}
                <section className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Link to={feature.link} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-8 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                                        {feature.title}
                                        {feature.link !== "#" && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-sm">→</span>}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
