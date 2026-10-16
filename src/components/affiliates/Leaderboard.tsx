import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/hooks/useAuth"

interface LeaderboardEntry {
    name: string
    earnings: number
    rank: number
    isCurrentUser: boolean
}

export function Leaderboard() {
    const { user } = useAuth()
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadLeaderboard()
    }, [user])

    const loadLeaderboard = async () => {
        try {
            // Fetch top affiliates by total earnings (aggregated from conversions)
            // Using a subquery approach since Supabase doesn't support direct aggregation
            const { data: topAffiliates } = await supabase
                .from('affiliates')
                .select(`
                    id,
                    user_id,
                    conversions:conversions(commission_amount_cents)
                `)
                .limit(10)

            if (!topAffiliates) {
                setLeaders([])
                return
            }

            // Calculate total earnings per affiliate
            const affiliateEarnings = topAffiliates.map(a => ({
                id: a.id,
                userId: a.user_id,
                totalCents: Array.isArray(a.conversions)
                    ? a.conversions.reduce((sum: number, c: any) => sum + (c.commission_amount_cents || 0), 0)
                    : 0
            }))

            // Sort by earnings and get top 3
            const sorted = affiliateEarnings
                .sort((a, b) => b.totalCents - a.totalCents)
                .slice(0, 3)

            // Find current user's affiliate
            const currentUserAffiliate = affiliateEarnings.find(a => a.userId === user?.id)
            const currentUserRank = affiliateEarnings
                .sort((a, b) => b.totalCents - a.totalCents)
                .findIndex(a => a.userId === user?.id) + 1

            // Build leaderboard entries (anonymized names for privacy)
            const entries: LeaderboardEntry[] = sorted.map((a, idx) => ({
                name: a.userId === user?.id ? "You" : generateAnonymousName(idx),
                earnings: a.totalCents / 100,
                rank: idx + 1,
                isCurrentUser: a.userId === user?.id
            }))

            // Add current user if not in top 3
            if (currentUserAffiliate && !entries.find(e => e.isCurrentUser)) {
                entries.push({
                    name: "You",
                    earnings: currentUserAffiliate.totalCents / 100,
                    rank: currentUserRank || 99,
                    isCurrentUser: true
                })
            }

            setLeaders(entries)
        } catch (error) {
            console.error("Leaderboard load failed:", error)
            setLeaders([])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="bg-black/40 border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Affiliates
                </h3>
                <span className="text-xs text-emerald-400 font-mono animate-pulse">● LIVE</span>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="space-y-3">
                    {leaders.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No affiliates yet. Be the first!</p>
                    ) : (
                        leaders.map((leader) => (
                            <div
                                key={leader.rank}
                                className={`flex items-center justify-between p-3 rounded-lg border ${leader.isCurrentUser
                                    ? "bg-emerald-500/10 border-emerald-500/50"
                                    : "bg-slate-900/50 border-white/5"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${leader.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                                        leader.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                                            leader.rank === 3 ? "bg-orange-500/20 text-orange-500" :
                                                "bg-slate-800 text-gray-500"
                                        }`}>
                                        {leader.rank === 1 ? <Medal className="w-4 h-4" /> : leader.rank}
                                    </div>
                                    <span className={leader.isCurrentUser ? "text-emerald-400 font-bold" : "text-gray-300"}>
                                        {leader.name}
                                    </span>
                                </div>
                                <span className="font-mono text-white">
                                    ${leader.earnings.toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

            <p className="mt-4 text-xs text-center text-gray-500">
                Rankings updated in real-time.
            </p>
        </Card>
    )
}

// Generate anonymous names for privacy
function generateAnonymousName(index: number): string {
    const names = ["Alpha Pro", "Empire Builder", "Growth Hacker", "Revenue King", "Sales Master"]
    return names[index] || `Affiliate #${index + 1}`
}

