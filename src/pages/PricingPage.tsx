import { motion } from "framer-motion"
import { Check, X, HelpCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { pricingFeatures, plans } from "@/lib/pricing-data"

export default function PricingPage() {
    const navigate = useNavigate()

    const handlePlanSelect = (planId: string) => {
        if (planId === 'agency') {
            navigate('/contact?subject=Enterprise')
        } else {
            navigate(`/signup?plan=${planId}`)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/20 font-sans">
            <Navbar />

            <main className="pt-32 pb-20">
                {/* Header */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Invest in Your Empire
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Simple, transparent pricing. No hidden fees. Upgrade as you grow.
                    </motion.p>
                </section>

                {/* Pricing Cards */}
                <section className="container mx-auto px-4 mb-32">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-primary bg-primary/5 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]' : 'border-white/10 bg-white/5'} flex flex-col`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <p className="text-muted-foreground">{plan.description}</p>
                                </div>
                                <Button
                                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
                                    size="lg"
                                    onClick={() => handlePlanSelect(plan.id)}
                                >
                                    {plan.cta}
                                </Button>

                                {/* Commission Lock Indicator - Key selling point for affiliate upgrade */}
                                {plan.id === 'professional' && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            40% Commission Unlocked
                                        </span>
                                    </div>
                                )}
                                {plan.id === 'starter' && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        20% Commission • Upgrade for 40%
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Feature Comparison Matrix */}
                <section className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Detailed Feature Breakdown</h2>

                        <div className="overflow-x-auto relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-6 font-semibold w-1/3 min-w-[200px]">Features</th>
                                        <th className="p-6 font-semibold w-1/5 min-w-[150px] text-center">Starter</th>
                                        <th className="p-6 font-semibold w-1/5 min-w-[150px] text-center text-primary">Pro</th>
                                        <th className="p-6 font-semibold w-1/5 min-w-[150px] text-center">Agency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricingFeatures.map((category) => (
                                        <>
                                            <tr key={category.category} className="bg-white/5">
                                                <td colSpan={4} className="p-4 px-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                                    {category.category}
                                                </td>
                                            </tr>
                                            {category.features.map((feature, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 flex items-center gap-2">
                                                        <span>{feature.name}</span>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <HelpCircle className="h-4 w-4 text-muted-foreground/50" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>More info about {feature.name}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </td>
                                                    <td className="p-6 text-center text-muted-foreground text-sm">
                                                        {renderValue(feature.starter)}
                                                    </td>
                                                    <td className="p-6 text-center font-medium text-white text-sm">
                                                        {renderValue(feature.pro)}
                                                    </td>
                                                    <td className="p-6 text-center text-muted-foreground text-sm">
                                                        {renderValue(feature.agency)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Enterprise CTA */}
                <section className="container mx-auto px-4 mt-32">
                    <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden p-12 text-center border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                For large teams and agencies, we offer custom model training, dedicated infrastructure, and SLA-backed support.
                            </p>
                            <Button size="lg" variant="secondary" className="px-8">
                                Talk to Sales
                            </Button>
                        </div>
                        {/* Abstract Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/20 blur-[100px] -z-10 text-center" />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

function renderValue(value: string | boolean) {
    if (typeof value === "boolean") {
        return value ? (
            <div className="flex justify-center"><Check className="h-5 w-5 text-green-500" /></div>
        ) : (
            <div className="flex justify-center"><X className="h-5 w-5 text-muted-foreground/30" /></div>
        )
    }
    return value
}
