import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type SubscriptionTier = 'free' | 'pro' | 'enterprise'

type AuthContextType = {
    user: User | null
    loading: boolean
    subscription_tier: SubscriptionTier
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    subscription_tier: 'free',
    signOut: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [tier, setTier] = useState<SubscriptionTier>('free')

    useEffect(() => {
        // Check active sessions and subscribe to auth changes
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                // Fetch real subscription tier from profiles table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('plan_tier')
                    .eq('id', session.user.id)
                    .single()

                if (profile?.plan_tier) {
                    setTier(profile.plan_tier as SubscriptionTier)
                } else {
                    setTier('free') // Default to free if no subscription found
                }
            }
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                // Fetch real subscription tier on auth state change
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('plan_tier')
                    .eq('id', session.user.id)
                    .single()

                if (profile?.plan_tier) {
                    setTier(profile.plan_tier as SubscriptionTier)
                } else {
                    setTier('free')
                }
            } else {
                setTier('free')
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        setTier('free')
    }

    return (
        <AuthContext.Provider value={{ user, loading, subscription_tier: tier, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
