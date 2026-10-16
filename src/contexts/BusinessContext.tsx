import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

export type Business = {
    user_id: string
    id: string
    name: string
    slug: string
    status: "Active" | "Setup"
    industry?: string
    type?: "dropship" | "saas" | "service" | "creator" | "pod" | "trend"

    // Credits & Plan (Added Phase 3)
    credits_balance: number
    tier: "free" | "starter" | "pro" | "professional" | "agency" | "enterprise"
    subscription_status?: "active" | "past_due" | "cancelled" | "expired"
    next_billing_date?: string

    // Financials
    revenue: number
    expenses: number
    profit: number
    margin: number

    // Traffic
    visitors: number
    orders: number
    conversionRate: number
    progress: number

    // History (for charts)
    history: { date: string; revenue: number; expenses: number; visitors: number }[]

    // Meta
    lastBoardMeeting: string | null
    tasks: { id: string; title: string; status: "pending" | "done" }[]
    platform?: "Shopify" | "Wix" | "WordPress" | "AURA"

    // Branding (Phase 8)
    branding?: {
        hideFooter: boolean
        customLogo?: string
        brandColor?: string
    }
    theme_config?: any // Added for Phase 3 Store Builder
    competitors?: string[] // Added for Workflow Integration
}

export type Order = {
    id: string
    business_id: string
    customer_email: string
    total_amount: number
    status: 'pending' | 'paid' | 'shipped' | 'cancelled'
    items: any[]
    created_at: string
}

export type DashboardStats = {
    revenue: { value: number; change: number; trend: "up" | "down" }
    orders: { value: number; change: number; trend: "up" | "down" }
    visitors: { value: number; change: number; trend: "up" | "down" }
    credits: { value: number; total: number; resetDays: number }
}

type BusinessContextType = {
    businesses: Business[]
    orders: Order[]
    stats: DashboardStats
    addBusiness: (business: Partial<Business>) => Promise<{ success: boolean; error?: string; id?: string }>
    updateBusiness: (id: string, updates: Partial<Business>) => Promise<void>
    importBusiness: (platform: string, data: any) => Promise<void>
    disconnectBusiness: (id: string) => Promise<void>
    deductCredits: (id: string, amount: number) => Promise<boolean>
    addCompetitorToBusiness: (businessId: string, competitorUrl: string) => Promise<{ success: boolean; error?: string }>
    chartData: { name: string; total: number }[]
    isLoading: boolean
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export const useBusiness = () => {
    const context = useContext(BusinessContext)
    if (!context) throw new Error("useBusiness must be used within a BusinessProvider")
    return context
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()

    const [businesses, setBusinesses] = useState<Business[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [stats, setStats] = useState<DashboardStats>({
        revenue: { value: 0, change: 0, trend: "up" },
        orders: { value: 0, change: 0, trend: "up" },
        visitors: { value: 0, change: 0, trend: "up" },
        credits: { value: 50, total: 500, resetDays: 30 },
    })

    // Update stats whenever businesses or orders change
    useEffect(() => {
        // Calculate aggregations from REAL orders if available, else fallback to business.revenue metadata
        const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0)
        const totalOrders = orders.length

        // Use business stats for visitors since we don't track pageviews in a table yet
        const totalVisitors = businesses.reduce((acc, b) => acc + (Number(b.visitors) || 0), 0)

        setStats(prev => ({
            ...prev,
            revenue: { ...prev.revenue, value: totalRevenue }, // Real Transaction Revenue
            orders: { ...prev.orders, value: totalOrders }, // Real Order Count
            visitors: { ...prev.visitors, value: totalVisitors },
            credits: { ...prev.credits, value: businesses.reduce((acc, b) => acc + (b.credits_balance || 0), 0) }
        }))
    }, [businesses, orders])

    const [chartData] = useState<{ name: string; total: number }[]>([
        { name: "Mon", total: 0 },
        { name: "Tue", total: 0 },
        { name: "Wed", total: 0 },
        { name: "Thu", total: 0 },
        { name: "Fri", total: 0 },
        { name: "Sat", total: 0 },
        { name: "Sun", total: 0 },
    ])

    const [isLoading, setIsLoading] = useState(true)

    // Fetch businesses from Supabase when user logs in & Subscribe to Realtime Changes
    useEffect(() => {
        if (!user) {
            setBusinesses([])
            setOrders([])
            setIsLoading(false)
            return
        }

        const fetchBusinesses = async () => {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error("Error fetching businesses:", error)
            } else {
                setBusinesses(data || [])

                // Fetch Orders for these businesses
                const businessIds = data?.map(b => b.id) || []
                if (businessIds.length > 0) {
                    const { data: orderData } = await supabase
                        .from('orders')
                        .select('*')
                        .in('business_id', businessIds)
                        .order('created_at', { ascending: false })
                    setOrders(orderData || [])
                }
            }
            setIsLoading(false)
        }

        fetchBusinesses()

        // Realtime Subscription
        const channel = supabase
            .channel('business-updates')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen for INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'businesses',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    console.log('Realtime update:', payload)
                    if (payload.eventType === 'UPDATE') {
                        setBusinesses(prev => prev.map(b => b.id === payload.new.id ? { ...b, ...payload.new } : b))
                    } else if (payload.eventType === 'INSERT') {
                        setBusinesses(prev => [payload.new as Business, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBusinesses(prev => prev.filter(b => b.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    const addBusiness = async (business: Partial<Business> & { products?: any[] }) => {
        if (!user) return { success: false, error: "User not authenticated" }

        const newBusinessId = crypto.randomUUID()

        const newBusiness = {
            user_id: user.id,
            id: newBusinessId,
            name: business.name || "New Business",
            slug: (business.name || "New Business").toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + newBusinessId.slice(0, 8),
            status: "Active",
            type: business.type || "dropship",
            industry: business.industry || "E-commerce",
            revenue: 0,
            expenses: 0,
            profit: 0,
            margin: 0,
            visitors: 0,
            orders: 0,
            conversionRate: 0,
            progress: 0,
            history: [],
            tasks: [],
            credits_balance: 10, // Default Free Tier
            tier: "free",
            lastBoardMeeting: null,
            // @ts-ignore
            theme_config: business.theme_config, // Persist Theme
            branding: {
                hideFooter: false,
                brandColor: "#3b82f6"
            },
            ...business // This might overwrite id, so be careful if business has id
        }

        // Ensure ID is set correctly
        if (business.id) newBusiness.id = business.id
        else newBusiness.id = newBusinessId

        // Optimistic UI update
        // @ts-ignore
        setBusinesses(prev => [newBusiness as Business, ...prev])

        const { error } = await supabase
            .from('businesses')
            // @ts-ignore
            .insert([newBusiness])

        if (error) {
            console.error("Error creating business:", error)
            // Revert on error
            setBusinesses(prev => prev.filter(b => b.id !== newBusiness.id))
            return { success: false, error: error.message }
        }

        // Insert Products if any
        if (business.products && business.products.length > 0) {
            const productsToInsert = business.products.map(p => ({
                business_id: newBusiness.id,
                title: p.title,
                description: p.description,
                cost_price: p.cost,
                selling_price: p.suggestedPrice,
                images: [p.imageUrl],
                external_id: p.source === 'cj' ? 'cj_mock_id' : 'ali_mock_id',
                supplier_info: {
                    name: p.supplierName,
                    url: p.supplierUrl,
                    source: p.source
                }
            }))

            const { error: productsError } = await supabase
                .from('products')
                .insert(productsToInsert)

            if (productsError) {
                console.error("Error adding initial products:", productsError)
                // Don't fail the whole business creation for product failure, but log it
            }
        }

        return { success: true, id: newBusiness.id }
    }

    const updateBusiness = async (id: string, updates: Partial<Business>) => {
        if (!user) return

        // Optimistic UI update
        setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))

        const { error } = await supabase
            .from('businesses')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id) // Security check

        if (error) {
            console.error("Error updating business:", error)
            // Could revert here if needed, but for minor edits maybe not critical
        }
    }

    const importBusiness = async (platform: string, data: any) => {
        setIsLoading(true)

        try {
            if (platform === 'Shopify') {
                await verifyShopifyCredentials(data.url, data.accessToken)
            } else if (platform === 'Wix') {
                await verifyWixCredentials(data.url, data.apiKey)
            }

            // If verification passes, add the business
            const name = data.url.replace(/^https?:\/\//, "").split(".")[0]
            const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)

            await addBusiness({
                name: capitalizedName,
                platform: platform as any,
                industry: "E-commerce" // Default
            })

        } catch (error: any) {
            console.error("Import failed:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const verifyShopifyCredentials = async (url: string, token: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('verify-shopify', {
                body: { url, token }
            })

            if (error) {
                // If it's a function invocation error or custom error returned
                const message = error.message || "Failed to verify Shopify credentials"
                // Try to parse if it's a JSON string error from our function
                try {
                    const parsed = JSON.parse(message)
                    if (parsed.error) throw new Error(parsed.error)
                } catch (e) {
                    // ignore parse error
                }
                throw new Error(message)
            }

            if (data?.error) {
                throw new Error(data.error)
            }

            return data.shop
        } catch (error: any) {
            throw error
        }
    }

    const verifyWixCredentials = async (url: string, apiKey: string) => {
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (!url.includes("wix.com") && !url.includes("wixsite.com")) {
            throw new Error("Invalid Wix URL. Must contain wix.com or wixsite.com")
        }

        if (apiKey.length < 10) {
            throw new Error("Invalid API Key. Key is too short.")
        }
    }

    const disconnectBusiness = async (id: string) => {
        if (!user) return

        // Optimistic update
        setBusinesses(prev => prev.filter(b => b.id !== id))

        const { error } = await supabase
            .from('businesses')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error("Error deleting business:", error)
        }
    }

    const deductCredits = async (businessId: string, amount: number) => {
        if (!user) return false

        const business = businesses.find(b => b.id === businessId)
        if (!business) return false

        if (business.credits_balance < amount) {
            return false
        }

        // Optimistic UI update
        const newBalance = business.credits_balance - amount
        setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, credits_balance: newBalance } : b))

        // Try RPC first
        const { error } = await supabase.rpc('deduct_credits', {
            business_id: businessId,
            amount: amount
        })

        if (error) {
            console.warn("RPC failed, trying direct update:", error.message)
            // Fallback: Direct Update
            const { error: updateError } = await supabase
                .from('businesses')
                .update({ credits_balance: newBalance })
                .eq('id', businessId)

            if (updateError) {
                console.error("Error deducting credits:", updateError)
                setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, credits_balance: business.credits_balance } : b))
                return false
            }
        }

        return true
    }

    const addCompetitorToBusiness = async (businessId: string, competitorUrl: string) => {
        if (!user) return { success: false, error: "Not authenticated" }

        const business = businesses.find(b => b.id === businessId)
        if (!business) return { success: false, error: "Business not found" }

        const currentCompetitors = business.competitors || []

        if (currentCompetitors.length >= 2) {
            return { success: false, error: "Maximum 2 competitors allowed per workflow." }
        }

        if (currentCompetitors.includes(competitorUrl)) {
            return { success: false, error: "Competitor already added." }
        }

        const newCompetitors = [...currentCompetitors, competitorUrl]

        // Optimistic UI
        setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, competitors: newCompetitors } : b))

        // Persist (Handling dynamic column update or JSONB field if exists, otherwise assume 'competitors' column exists)
        // For safety in this environment ensuring no SQL errors, we might wrap in try/catch or assume JSONB 'metadata' if clear schema existed.
        // Assuming 'competitors' column or JSONB field exists as per standard "Peak Tech" flexibility.
        const { error } = await supabase
            .from('businesses')
            .update({ competitors: newCompetitors } as any) // Type check bypass for schema flexibility
            .eq('id', businessId)

        if (error) {
            console.error("Error adding competitor:", error)
            // Revert
            setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, competitors: currentCompetitors } : b))
            return { success: false, error: error.message }
        }

        return { success: true }
    }

    return (
        <BusinessContext.Provider value={{ businesses, orders, stats, addBusiness, updateBusiness, importBusiness, disconnectBusiness, deductCredits, addCompetitorToBusiness, chartData, isLoading }}>
            {children}
        </BusinessContext.Provider>
    )
}
