import type { ReactNode } from "react"
import { useBusiness } from "@/contexts/BusinessContext"
import { PricingDialog } from "@/components/pricing/PricingDialog"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaywallGuardProps {
    children: ReactNode
    requiredTier: 'starter' | 'pro' | 'professional' | 'agency' | 'enterprise'
    fallback?: ReactNode
}

export function PaywallGuard({ children, requiredTier, fallback }: PaywallGuardProps) {
    const { businesses } = useBusiness()
    // Check first business for now (Single tenant logic mostly)
    const currentTier = businesses[0]?.tier || 'free'

    const tiers: Record<string, number> = {
        free: 0,
        starter: 1,
        pro: 2,
        professional: 2,
        agency: 3,
        enterprise: 4,
        organization: 5
    }

    const hasAccess = (tiers[currentTier] || 0) >= (tiers[requiredTier] || 0)

    if (hasAccess) {
        return <>{children}</>
    }

    if (fallback) {
        return <>{fallback}</>
    }

    // Default Fallback: Blur Overlay
    return (
        <div className="relative w-full h-full min-h-[200px] border border-white/10 rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                    {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Feature
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    Upgrade your plan to unlock this advanced feature and take your business to the next level.
                </p>
                <PricingDialog>
                    <Button variant="default" className="shadow-[0_0_20px_-5px_rgba(51,102,255,0.5)]">
                        Upgrade Now
                    </Button>
                </PricingDialog>
            </div>
            {/* Show a faint preview of content behind if desired, or just hide */}
            <div className="opacity-20 pointer-events-none filter blur-sm">
                {children}
            </div>
        </div>
    )
}
