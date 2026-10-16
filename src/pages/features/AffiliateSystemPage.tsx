import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { DollarSign, Link2, ArrowRight, Check, BarChart, Clock } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

const features = [
    { icon: DollarSign, title: "40% Commission", description: "Industry-leading recurring commissions on every referral" },
    { icon: Link2, title: "Smart Links", description: "Auto-generated tracking links with 90-day attribution" },
    { icon: BarChart, title: "Real-Time Dashboard", description: "Track clicks, conversions, and earnings instantly" },
    { icon: Clock, title: "Auto Payouts", description: "Monthly automated payments via Stripe or PayPal" }
]

const tiers = [
    { tier: "Starter", commission: "20%", requirement: "$49/mo plan" },
    { tier: "Professional", commission: "40%", requirement: "$99/mo plan", highlighted: true },
    { tier: "Agency", commission: "40%", requirement: "$299/mo plan" }
]

const benefits = [
    "Earn recurring revenue on every customer you refer",
    "Long 90-day cookie window for attribution",
    "Dedicated affiliate dashboard with real-time stats",
    "Marketing materials and resources provided",
    "Priority support for top affiliates"
]

export default function AffiliateSystemPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>Affiliate Program | AURA Increase</title>
            <meta name="description" content="Earn 40% recurring commissions by referring entrepreneurs to AURA" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-emerald-500">40% Recurring Commission</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Earn While You Share
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        Join our affiliate program and earn up to 40% recurring commission on every customer
                        you refer. Build passive income by sharing the platform you love.
                    </motion.p>
                    <Link to="/signup">
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                            Become an Affiliate <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </section>

                {/* Commission Tiers */}
                <section className="container mx-auto px-4 mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Commission Structure</h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {tiers.map((tier, index) => (
                            <motion.div
                                key={tier.tier}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`p-6 rounded-2xl border text-center ${tier.highlighted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}
                            >
                                <div className="text-sm text-muted-foreground mb-2">{tier.tier}</div>
                                <div className={`text-5xl font-bold mb-2 ${tier.highlighted ? 'text-emerald-500' : ''}`}>
                                    {tier.commission}
                                </div>
                                <div className="text-sm text-muted-foreground">{tier.requirement}</div>
                            </motion.div>
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
                                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Earning Example */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20">
                        <h2 className="text-2xl font-bold text-center mb-8">Earning Potential</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">10 Referrals @ $99/mo</div>
                                <div className="text-3xl font-bold text-emerald-500">$396/mo</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">50 Referrals @ $99/mo</div>
                                <div className="text-3xl font-bold text-emerald-500">$1,980/mo</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">100 Referrals @ $99/mo</div>
                                <div className="text-3xl font-bold text-emerald-500">$3,960/mo</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">Why Partner With Us?</h2>
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
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Start Earning Today</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Sign up for AURA and unlock your affiliate dashboard instantly.
                        </p>
                        <Link to="/signup">
                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                                Join the Program <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
