import { useBusiness } from "@/contexts/BusinessContext"
import { getPlan, hasFeature, compareTiers, type PlanTier, type PlanFeatures } from "@/lib/pricing-config"

/**
 * useEntitlements Hook
 * Provides feature gating based on user's subscription tier.
 * All limits and features are defined in pricing-config.ts
 */
export function useEntitlements() {
    const { businesses } = useBusiness()
    // For now, we assume the first business dictates the tier
    const tier = (businesses[0]?.tier || "starter") as PlanTier
    const plan = getPlan(tier)
    const features = plan.features

    const isStarter = tier === "starter"
    const isPro = tier === "pro" || tier === "professional"
    const isAgency = tier === "agency"
    const isEnterprise = tier === "enterprise"

    return {
        // Tier Info
        tier,
        plan,
        isStarter,
        isPro,
        isAgency,
        isEnterprise,
        credits: plan.credits,

        // ========== AI CAPABILITIES ==========
        canAccessVisualDebate: () => features.visualDebate,
        canUseCustomPersonas: () => features.customPersonas,
        getAIModel: () => features.aiModel,

        // ========== COMMERCE ==========
        getMaxStoreGenerations: () => {
            const limit = features.storesPerMonth
            return limit === 'unlimited' ? 999 : limit
        },
        canAutoPushToShopify: () => features.shopifyAutoPush,
        canBulkPush: () => features.bulkProductPush,
        hasPrivateSuppliers: () => features.privateSuppliers,

        // ========== INTELLIGENCE/SPY ==========
        getMaxCompetitors: () => {
            const limit = features.maxCompetitors
            return limit === 'unlimited' ? 999 : limit
        },
        hasAdSpyAccess: () => features.adSpyAccess,
        hasDeepDiveAnalysis: () => features.deepDiveAnalysis,

        // ========== AFFILIATE ==========
        getCommissionRate: () => features.commissionRate,
        getCookieDuration: () => features.cookieDays,
        hasVIPPayouts: () => features.vipPayouts,
        hasCustomCreatives: () => features.customCreatives,

        // ========== SUPPORT ==========
        getSupportLevel: () => features.supportLevel,
        getOnboardingType: () => features.onboarding,

        // ========== GENERIC HELPERS ==========
        hasFeature: (feature: keyof PlanFeatures) => hasFeature(tier, feature),
        canUpgradeTo: (targetTier: PlanTier) => compareTiers(targetTier, tier) > 0,

        // Check if user needs to upgrade for a specific feature
        requiresUpgradeFor: (requiredTier: PlanTier) => compareTiers(requiredTier, tier) > 0,

        // Get the upgrade prompt tier (next tier up)
        getUpgradeTier: (): PlanTier => {
            if (isStarter) return 'pro'
            if (isPro) return 'agency'
            return tier // Already at max
        }
    }
}

