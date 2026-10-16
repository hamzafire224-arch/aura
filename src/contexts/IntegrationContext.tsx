import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export type IntegrationProvider = 'shopify' | 'stripe' | 'paypal' | 'binance'

export type Integration = {
    id: string
    provider: IntegrationProvider
    status: 'active' | 'inactive' | 'error'
    metadata: Record<string, any>
    created_at: string
}

type IntegrationContextType = {
    integrations: Integration[]
    isLoading: boolean
    connectIntegration: (provider: IntegrationProvider, credentials: any) => Promise<boolean>
    disconnectIntegration: (id: string) => Promise<void>
    getIntegration: (provider: IntegrationProvider) => Integration | undefined
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined)

export const useIntegration = () => {
    const context = useContext(IntegrationContext)
    if (!context) throw new Error("useIntegration must be used within a IntegrationProvider")
    return context
}

export function IntegrationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [integrations, setIntegrations] = useState<Integration[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setIntegrations([])
            setIsLoading(false)
            return
        }
        fetchIntegrations()
        
        // Subscription for realtime updates
        const channel = supabase
            .channel('integrations_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'integrations', filter: `user_id=eq.${user.id}` }, 
                () => { fetchIntegrations() }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    const fetchIntegrations = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('integrations')
            .select('id, provider, status, metadata, created_at') // Exclude credentials for security
            .eq('user_id', user?.id)

        if (error) {
            console.error("Error fetching integrations:", error)
        } else {
            // @ts-ignore - Supabase types might not match exactly yet
            setIntegrations(data || [])
        }
        setIsLoading(false)
    }

    const connectIntegration = async (provider: IntegrationProvider, credentials: any): Promise<boolean> => {
        if (!user) return false

        try {
            // 1. Verify credentials first (if applicable)
            // For Shopify, we re-verify or trust the caller. Ideally caller verified.
            // In a high-end system, we might double check here or assumes caller did 'verify-shopify'

            let metadata = {}
            
            if (provider === 'shopify') {
               // We anticipate the frontend passed the verified shop object in credentials.meta or similar
               // checking if credentials contains the shop info to save into metadata
               if (credentials.shop) {
                   metadata = credentials.shop
               }
            }

            // 2. Upsert into DB
            const { error } = await supabase.from('integrations').upsert({
                user_id: user.id,
                provider,
                credentials, // In prod, encrypt this!
                metadata,
                status: 'active'
            }, { onConflict: 'user_id, provider' })

            if (error) throw error

            toast.success(`Connected to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`)
            await fetchIntegrations()
            return true

        } catch (error: any) {
            console.error(error)
            toast.error(`Failed to connect ${provider}: ${error.message}`)
            return false
        }
    }

    const disconnectIntegration = async (id: string) => {
        const { error } = await supabase.from('integrations').delete().eq('id', id)
        if (error) {
            toast.error("Failed to disconnect.")
        } else {
            setIntegrations(prev => prev.filter(i => i.id !== id))
            toast.success("Integration disconnected.")
        }
    }

    const getIntegration = (provider: IntegrationProvider) => {
        return integrations.find(i => i.provider === provider)
    }

    return (
        <IntegrationContext.Provider value={{
            integrations,
            isLoading,
            connectIntegration,
            disconnectIntegration,
            getIntegration
        }}>
            {children}
        </IntegrationContext.Provider>
    )
}
