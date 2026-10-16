/**
 * AURA Pricing Configuration
 * The single source of truth for all pricing, features, and tier limits.
 * Used by: PricingPage, useEntitlements, checkout flow, webhooks
 */

export type PlanTier = 'free' | 'starter' | 'pro' | 'professional' | 'agency' | 'enterprise'

export interface PlanConfig {
    id: PlanTier
    name: string
    tagline: string
    monthlyPrice: number
    yearlyPrice: number
    yearlyMonthlyEquivalent: number // Monthly price if paid yearly
    credits: number
    stripe_price_id?: string
    lemonsqueezy_variant_id?: string
    features: PlanFeatures
    popular?: boolean
    comingSoon?: boolean
}

export interface PlanFeatures {
    // AI Capabilities
    aiModel: 'gpt-3.5-turbo' | 'gpt-4-turbo' | 'claude-3-sonnet'
    visualDebate: boolean
    customPersonas: boolean

    // Commerce
    storesPerMonth: number | 'unlimited'
    shopifyAutoPush: boolean
    bulkProductPush: boolean
    privateSuppliers: boolean

    // Spy/Intelligence
    maxCompetitors: number | 'unlimited'
    adSpyAccess: boolean
    deepDiveAnalysis: boolean

    // Affiliate
    commissionRate: number // 0.20 = 20%, 0.40 = 40%
    cookieDays: number
    vipPayouts: boolean
    customCreatives: boolean

    // Support
    supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
    onboarding: 'docs' | 'video' | 'call'
}

export const PLANS: Record<PlanTier, PlanConfig> = {
    free: {
        id: 'free',
        name: 'Free',
        tagline: 'Just exploring',
        monthlyPrice: 0,
        yearlyPrice: 0,
        yearlyMonthlyEquivalent: 0,
        credits: 50,
        features: {
            aiModel: 'gpt-3.5-turbo',
            visualDebate: false,
            customPersonas: false,
            storesPerMonth: 0,
            shopifyAutoPush: false,
            bulkProductPush: false,
            privateSuppliers: false,
            maxCompetitors: 1,
            adSpyAccess: false,
            deepDiveAnalysis: false,
            commissionRate: 0.10,
            cookieDays: 7,
            vipPayouts: false,
            customCreatives: false,
            supportLevel: 'community',
            onboarding: 'docs'
        }
    },
    starter: {
        id: 'starter',
        name: 'Starter',
        tagline: 'For aspiring entrepreneurs',
        monthlyPrice: 49,
        yearlyPrice: 470, // ~$39/mo
        yearlyMonthlyEquivalent: 39,
        credits: 500,
        lemonsqueezy_variant_id: import.meta.env.VITE_LEMONSQUEEZY_STARTER_MONTHLY_VARIANT_ID,
        features: {
            aiModel: 'gpt-3.5-turbo',
            visualDebate: false,
            customPersonas: false,
            storesPerMonth: 1,
            shopifyAutoPush: false,
            bulkProductPush: false,
            privateSuppliers: false,
            maxCompetitors: 3,
            adSpyAccess: false,
            deepDiveAnalysis: false,
            commissionRate: 0.20,
            cookieDays: 30,
            vipPayouts: false,
            customCreatives: false,
            supportLevel: 'community',
            onboarding: 'docs'
        }
    },
    pro: {
        id: 'pro',
        name: 'Professional',
        tagline: 'The sweet spot for growth',
        monthlyPrice: 99,
        yearlyPrice: 948, // ~$79/mo
        yearlyMonthlyEquivalent: 79,
        credits: 5000,
        popular: true,
        lemonsqueezy_variant_id: import.meta.env.VITE_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID,
        features: {
            aiModel: 'gpt-4-turbo',
            visualDebate: true,
            customPersonas: false,
            storesPerMonth: 5,
            shopifyAutoPush: true,
            bulkProductPush: false,
            privateSuppliers: false,
            maxCompetitors: 10,
            adSpyAccess: true,
            deepDiveAnalysis: false,
            commissionRate: 0.40, // THE LOCK - 40% only for Pro+
            cookieDays: 90,
            vipPayouts: false,
            customCreatives: false,
            supportLevel: 'priority',
            onboarding: 'video'
        }
    },
    professional: {
        id: 'professional',
        name: 'Professional',
        tagline: 'The sweet spot for growth',
        monthlyPrice: 99,
        yearlyPrice: 948,
        yearlyMonthlyEquivalent: 79,
        credits: 5000,
        popular: true,
        features: {
            aiModel: 'gpt-4-turbo',
            visualDebate: true,
            customPersonas: false,
            storesPerMonth: 5,
            shopifyAutoPush: true,
            bulkProductPush: false,
            privateSuppliers: false,
            maxCompetitors: 10,
            adSpyAccess: true,
            deepDiveAnalysis: false,
            commissionRate: 0.40,
            cookieDays: 90,
            vipPayouts: false,
            customCreatives: false,
            supportLevel: 'priority',
            onboarding: 'video'
        }
    },
    agency: {
        id: 'agency',
        name: 'Agency',
        tagline: 'Dominate the market',
        monthlyPrice: 299,
        yearlyPrice: 2868, // ~$239/mo
        yearlyMonthlyEquivalent: 239,
        credits: 12000,
        lemonsqueezy_variant_id: import.meta.env.VITE_LEMONSQUEEZY_AGENCY_MONTHLY_VARIANT_ID,
        features: {
            aiModel: 'claude-3-sonnet',
            visualDebate: true,
            customPersonas: true,
            storesPerMonth: 'unlimited',
            shopifyAutoPush: true,
            bulkProductPush: true,
            privateSuppliers: true,
            maxCompetitors: 'unlimited',
            adSpyAccess: true,
            deepDiveAnalysis: true,
            commissionRate: 0.40,
            cookieDays: 365, // Lifetime attribution
            vipPayouts: true,
            customCreatives: true,
            supportLevel: 'dedicated',
            onboarding: 'call'
        }
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: 'For large organizations',
        monthlyPrice: 999,
        yearlyPrice: 9990,
        yearlyMonthlyEquivalent: 832,
        credits: 50000,
        comingSoon: true,
        features: {
            aiModel: 'claude-3-sonnet',
            visualDebate: true,
            customPersonas: true,
            storesPerMonth: 'unlimited',
            shopifyAutoPush: true,
            bulkProductPush: true,
            privateSuppliers: true,
            maxCompetitors: 'unlimited',
            adSpyAccess: true,
            deepDiveAnalysis: true,
            commissionRate: 0.40,
            cookieDays: 365,
            vipPayouts: true,
            customCreatives: true,
            supportLevel: 'dedicated',
            onboarding: 'call'
        }
    }
}

// Helper to get plan by tier
export function getPlan(tier: PlanTier): PlanConfig {
    return PLANS[tier] || PLANS.free
}

// Helper to check if a tier has a specific feature
export function hasFeature(tier: PlanTier, feature: keyof PlanFeatures): boolean {
    const plan = getPlan(tier)
    const value = plan.features[feature]
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0
    if (value === 'unlimited') return true
    return Boolean(value)
}

// Compare tiers (returns positive if tier1 > tier2)
export function compareTiers(tier1: PlanTier, tier2: PlanTier): number {
    const order: PlanTier[] = ['free', 'starter', 'pro', 'professional', 'agency', 'enterprise']
    return order.indexOf(tier1) - order.indexOf(tier2)
}

// Get the display plans for pricing page (excludes free, merges pro/professional)
export function getDisplayPlans(): PlanConfig[] {
    return [PLANS.starter, PLANS.pro, PLANS.agency]
}
