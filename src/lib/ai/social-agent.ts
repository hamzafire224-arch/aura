
export type SocialPlatform = 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok'

export interface PostResult {
    success: boolean
    id?: string
    error?: string
    scheduledTime?: string
    platformErrors?: string[]
}

const AYRSHARE_KEY = import.meta.env.VITE_AYRSHARE_API_KEY

export class SocialAgent {

    async post(content: string, platforms: SocialPlatform[], mediaUrls?: string[]): Promise<PostResult> {

        // 1. Simulation Mode (Default)
        if (!AYRSHARE_KEY) {
            await new Promise(r => setTimeout(r, 1500))
            return {
                success: true,
                id: `sim_post_${Date.now()}`
            }
        }

        // 2. Real Mode (Ayrshare via Proxy or Direct)
        // Ideally we use a backend proxy to keep the key secret, but for this "Pro" integration 
        // we will demonstrate the logic. In prod, use `supabase.functions.invoke('social-proxy')`

        try {
            const { supabase } = await import("@/lib/supabase")

            // Invoke our Edge Function which holds the *Secret* Ayrshare Key
            const { data, error } = await supabase.functions.invoke('social-proxy', {
                body: {
                    action: 'post',
                    payload: {
                        post: content,
                        platforms: platforms,
                        mediaUrls: mediaUrls
                    }
                }
            })

            if (error) throw new Error(error.message)
            if (data?.error) throw new Error(data.error)

            return {
                success: true,
                id: data.id || data.postIds?.[0]?.id
            }

        } catch (error: any) {
            console.error("SocialAgent: Real Post Failed", error)
            return {
                success: false,
                error: error.message || "Failed to post to social networks."
            }
        }
    }

    async schedule(content: string, platforms: SocialPlatform[], date: string, mediaUrls?: string[]): Promise<PostResult> {
        console.log(`SocialAgent: Scheduling for ${date}...`)

        if (!AYRSHARE_KEY) {
            await new Promise(r => setTimeout(r, 1000))
            return {
                success: true,
                id: `sim_sched_${Date.now()}`,
                scheduledTime: date
            }
        }

        try {
            const { supabase } = await import("@/lib/supabase")
            const { data, error } = await supabase.functions.invoke('social-proxy', {
                body: {
                    action: 'schedule',
                    payload: { post: content, platforms, mediaUrls, scheduleDate: date }
                }
            })

            if (error) throw new Error(error.message)
            if (!data || !data.id) throw new Error("Invalid response from scheduling server")

            return { success: true, id: data.id, scheduledTime: date }

        } catch (e: any) {
            return { success: false, error: e.message }
        }
    }

    async getHistory(): Promise<any[]> {
        if (!AYRSHARE_KEY) {
            return [
                { id: '1', post: 'Just launched our new collection! #fashion', platforms: ['instagram'], status: 'sent', date: new Date().toISOString() },
                { id: '2', post: 'Behind the scenes at the studio.', platforms: ['linkedin'], status: 'sent', date: new Date(Date.now() - 86400000).toISOString() }
            ]
        }

        try {
            const { supabase } = await import("@/lib/supabase")
            const { data } = await supabase.functions.invoke('social-proxy', {
                body: { action: 'history' }
            })
            return data || []
        } catch (e) {
            return []
        }
    }
}
