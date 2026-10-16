export const LEMONSQUEEZY_VARIANTS = {
    STARTER: {
        monthly: import.meta.env.VITE_LEMONSQUEEZY_STARTER_MONTHLY_VARIANT_ID || '',
        yearly: import.meta.env.VITE_LEMONSQUEEZY_STARTER_YEARLY_VARIANT_ID || '',
    },
    PRO: {
        monthly: import.meta.env.VITE_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID || '',
        yearly: import.meta.env.VITE_LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID || '',
    },
    ENTERPRISE: {
        monthly: import.meta.env.VITE_LEMONSQUEEZY_ENTERPRISE_MONTHLY_VARIANT_ID || '',
        yearly: import.meta.env.VITE_LEMONSQUEEZY_ENTERPRISE_YEARLY_VARIANT_ID || '',
    }
}

interface CheckoutOptions {
    variantId: string
    userId: string
    businessId?: string
    userEmail?: string
    affiliateCode?: string | null
}

export function getCheckoutUrl({ variantId, userId, businessId, userEmail, affiliateCode }: CheckoutOptions) {
    if (!variantId) {
        console.warn("LemonSqueezy Variant ID is missing.")
        return "#"
    }

    const checkoutUrl = `https://store.lemonsqueezy.com/checkout/buy/${variantId}`

    const params = new URLSearchParams()

    // Pass custom data for webhook fulfillment (including affiliate attribution)
    const customData: Record<string, string | undefined> = {
        user_id: userId,
        business_id: businessId,
    }

    // Include affiliate code if present (for commission attribution)
    if (affiliateCode) {
        customData.affiliate_code = affiliateCode
        console.log(`💰 Checkout includes affiliate code: ${affiliateCode}`)
    }

    params.append('checkout[custom][data]', JSON.stringify(customData))

    if (userEmail) {
        params.append('checkout[email]', userEmail)
    }

    return `${checkoutUrl}?${params.toString()}`
}

// Legacy function signature for backward compatibility
export function getLegacyCheckoutUrl(variantId: string, userId: string, businessId?: string, userEmail?: string) {
    return getCheckoutUrl({ variantId, userId, businessId, userEmail })
}
