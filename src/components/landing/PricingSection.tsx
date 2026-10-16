import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { plans } from "@/lib/pricing-data"

export default function PricingSection() {
    const [isYearly, setIsYearly] = useState(false)

    // Enrich existing plans with highlight features for the landing page card view
    const cardPlans = plans.map(p => ({
        ...p,
        highlights: p.name === "Starter" ? [
            "1 Business Project",
            "Basic AI Agents",
            "Community Support"
        ] : p.name === "Pro" ? [
            "5 Business Projects",
            "Unlimited AI Workflows",
            "Advanced Lead Finder",
            "Priority Support"
        ] : [
            "Unlimited Businesses",
            "Custom AI Fine-tuning",
            "Dedicated Account Manager",
            "API Access"
        ]
    }))

    return (
        <section className="w-full py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        Simple Pricing, <span className="text-primary">Massive ROI</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Start for free. Upgrade as your empire grows.
                    </p>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Label htmlFor="billing-toggle" className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Monthly
                        </Label>
                        <Switch
                            id="billing-toggle"
                            checked={isYearly}
                            onCheckedChange={setIsYearly}
                        />
                        <Label htmlFor="billing-toggle" className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Yearly <span className="text-xs text-primary ml-1 font-bold">(Save 20%)</span>
                        </Label>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {cardPlans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm shadow-lg shadow-primary/20">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg shadow-primary/10 scale-105 z-10' : 'border-white/10 bg-white/5'}`}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">
                                            {plan.price === "Custom" ? "Custom" : (isYearly && plan.price !== "$0" ?
                                                "$" + Math.round(Number(plan.price.replace("$", "")) * 12 * 0.8) :
                                                plan.price
                                            )}
                                        </span>
                                        {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                                    </div>

                                    <div className="space-y-3">
                                        {plan.highlights.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link to={plan.cta === "Contact Sales" ? "/contact" : "/signup"} className="w-full">
                                        <Button
                                            className="w-full"
                                            variant={plan.popular ? "default" : "outline"}
                                            size="lg"
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/pricing">
                        <Button variant="link" className="text-muted-foreground hover:text-white group">
                            Compare all features in detail <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
