import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Sparkles, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useBusiness } from "@/contexts/BusinessContext"
import { getCheckoutUrl, LEMONSQUEEZY_VARIANTS } from "@/lib/lemonsqueezy"
import { getAffiliateCode } from "@/lib/affiliate-middleware"
import { Badge } from "@/components/ui/badge"

export function PricingDialog({ children, open, onOpenChange }: { children?: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const { user } = useAuth()
    const { businesses } = useBusiness()

    // Use the first business ID for checkout attribution
    const businessId = businesses[0]?.id || ""

    // Get affiliate code for attribution
    const affiliateCode = getAffiliateCode()

    const handleUpgrade = (variantId: string) => {
        if (!user) return
        const url = getCheckoutUrl({
            variantId,
            userId: user.id,
            businessId,
            userEmail: user.email || undefined,
            affiliateCode
        })
        window.location.href = url
    }

    const plans = [
        {
            name: "Starter",
            price: 49,
            originalPrice: 79, // Decoy: Shows perceived value
            priceLabel: "/mo",
            description: "For testing the waters",
            features: [
                { text: "1 Store Generation", included: true },
                { text: "Basic AI (GPT-3.5)", included: true },
                { text: "20% Affiliate Commission", included: true },
                { text: "Visual Debate Mode", included: false },
                { text: "Auto Shopify Push", included: false },
            ],
            cta: "Start Building",
            variant: LEMONSQUEEZY_VARIANTS.STARTER?.monthly,
            popular: false,
            highlight: false,
        },
        {
            name: "Professional",
            price: 99,
            originalPrice: 199, // Decoy: 50% savings anchor
            priceLabel: "/mo",
            description: "The sweet spot for growth",
            features: [
                { text: "5 Stores / month", included: true },
                { text: "GPT-4 Turbo (Reasoning)", included: true },
                { text: "40% Affiliate Commission", included: true, highlight: true },
                { text: "Visual Debate Mode", included: true },
                { text: "1-Click Shopify Push", included: true },
            ],
            cta: "Go Pro",
            variant: LEMONSQUEEZY_VARIANTS.PRO.monthly,
            popular: true,
            highlight: true,
            savings: "50% OFF",
        },
        {
            name: "Agency",
            price: 299,
            originalPrice: 499,
            priceLabel: "/mo",
            description: "Dominate the market",
            features: [
                { text: "Unlimited Stores", included: true },
                { text: "Claude 3.5 Sonnet", included: true },
                { text: "40% + VIP Payouts", included: true },
                { text: "Custom AI Personas", included: true },
                { text: "Dedicated Support", included: true },
            ],
            cta: "Scale Empire",
            variant: LEMONSQUEEZY_VARIANTS.ENTERPRISE.monthly, // Using ENTERPRISE variant for Agency
            popular: false,
            highlight: false,
        },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="max-w-[95vw] w-full lg:max-w-5xl bg-[#0A0A0A] border-white/10 text-white overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Invest in Your Empire
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        Unlock the full potential of AI commerce. No hidden fees.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-xl flex flex-col relative transition-all duration-300 ${plan.popular
                                ? 'border-2 border-primary bg-primary/10 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] scale-105 z-10'
                                : 'border border-white/10 bg-white/5'
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> MOST POPULAR
                                </div>
                            )}

                            {/* Savings Badge */}
                            {plan.savings && (
                                <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-white border-0 text-xs">
                                    {plan.savings}
                                </Badge>
                            )}

                            <div className="mb-4">
                                <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-primary' : ''}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    {/* Original Price (Strikethrough - Decoy Effect) */}
                                    {plan.originalPrice && (
                                        <span className="text-lg text-gray-500 line-through">${plan.originalPrice}</span>
                                    )}
                                    <span className="text-3xl font-bold">${plan.price}</span>
                                    <span className="text-sm text-gray-400">{plan.priceLabel}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-sm">
                                {plan.features.map((feature, fidx) => (
                                    <li key={fidx} className={`flex gap-2 ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {feature.included ? (
                                            <Check className={`h-4 w-4 flex-shrink-0 ${'highlight' in feature && feature.highlight ? 'text-emerald-400' : 'text-primary'}`} />
                                        ) : (
                                            <X className="h-4 w-4 text-gray-700 flex-shrink-0" />
                                        )}
                                        <span className={'highlight' in feature && feature.highlight ? 'font-semibold text-emerald-400' : ''}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${plan.popular
                                    ? 'bg-primary hover:bg-primary/90 text-white'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                                onClick={() => plan.variant && handleUpgrade(plan.variant)}
                                disabled={!plan.variant}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Trust Signal */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    🔒 Secure checkout via LemonSqueezy. Cancel anytime.
                </p>
            </DialogContent>
        </Dialog>
    )
}

