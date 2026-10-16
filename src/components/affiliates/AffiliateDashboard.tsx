import { useEffect, useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { 
    Copy, 
    Check, 
    Users, 
    TrendingUp, 
    Sparkles, 
    Share2, 
    Award, 
    Zap, 
    Clock, 
    Coins, 
    RefreshCw, 
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { MarketingAssets } from "./MarketingAssets"
import { Leaderboard } from "./Leaderboard"

export interface AffiliateProfile {
    id: string
    user_id: string
    referral_code: string
    status: 'active' | 'banned'
    payout_method: string
    payout_details: any
    created_at: string
}

export interface ConversionRecord {
    id: string
    affiliate_id: string
    referral_id: string | null
    external_order_id: string
    amount_cents: number
    commission_amount_cents: number
    currency: string
    status: 'pending' | 'paid' | 'refunded'
    created_at: string
}

interface AffiliateMetrics {
    totalClicks: number
    totalConversions: number
    conversionRate: number
    grossSalesDollars: number
    pendingCommissions: number
    paidCommissions: number
    totalEarnings: number
}

export function AffiliateDashboard() {
    const { user } = useAuth()

    const [profile, setProfile] = useState<AffiliateProfile | null>(null)
    const [conversions, setConversions] = useState<ConversionRecord[]>([])
    const [metrics, setMetrics] = useState<AffiliateMetrics>({
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0,
        grossSalesDollars: 0,
        pendingCommissions: 0,
        paidCommissions: 0,
        totalEarnings: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [copiedLink, setCopiedLink] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    // Currency Formatter
    const formatCurrency = (amount: number, currency = "USD") => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    // 1. TIER PROGRESSION ENGINE
    const tierData = useMemo(() => {
        const sales = metrics.grossSalesDollars

        if (sales < 2500) {
            const target = 2500
            const progress = Math.min(100, Math.max(0, Math.round((sales / target) * 100)))
            const remaining = target - sales
            return {
                currentTierName: "Starter Tier",
                commissionRate: 20,
                badgeStyle: "border-zinc-500/40 text-zinc-300 bg-zinc-500/10",
                nextTierName: "Growth Operator",
                nextCommissionRate: 30,
                progress,
                remaining,
                targetAmount: target,
                isMaxTier: false,
            }
        } else if (sales < 10000) {
            const min = 2500
            const target = 10000
            const progress = Math.min(100, Math.max(0, Math.round(((sales - min) / (target - min)) * 100)))
            const remaining = target - sales
            return {
                currentTierName: "Growth Operator",
                commissionRate: 30,
                badgeStyle: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
                nextTierName: "Elite VIP",
                nextCommissionRate: 40,
                progress,
                remaining,
                targetAmount: target,
                isMaxTier: false,
            }
        } else {
            return {
                currentTierName: "Elite VIP",
                commissionRate: 40,
                badgeStyle: "border-amber-500/40 text-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.25)]",
                nextTierName: null,
                nextCommissionRate: 40,
                progress: 100,
                remaining: 0,
                targetAmount: 10000,
                isMaxTier: true,
            }
        }
    }, [metrics.grossSalesDollars])

    // 2. FETCH AFFILIATE DATA & REAL-TIME RECONCILIATION
    const loadAffiliateData = useCallback(async (showFullLoader = false) => {
        if (!user) {
            setIsLoading(false)
            return
        }

        if (showFullLoader) setIsLoading(true)
        else setIsRefreshing(true)

        try {
            // A. Fetch or auto-provision affiliate profile
            let { data: affiliateData } = await supabase
                .from("affiliates")
                .select("*")
                .eq("user_id", user.id)
                .maybeSingle()

            if (!affiliateData) {
                // Auto-provision deterministic affiliate code based on user credentials
                const cleanPrefix = (user.email?.split("@")[0] || "AURA")
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toUpperCase()
                    .slice(0, 6)
                const generatedCode = `${cleanPrefix}${Math.floor(100 + Math.random() * 900)}`

                const { data: newProfile, error: createError } = await supabase
                    .from("affiliates")
                    .insert({
                        user_id: user.id,
                        referral_code: generatedCode,
                        status: "active",
                        payout_method: "wise",
                    })
                    .select()
                    .single()

                if (createError) {
                    console.error("Failed to provision affiliate profile:", createError)
                } else {
                    affiliateData = newProfile
                }
            }

            if (!affiliateData) {
                setIsLoading(false)
                setIsRefreshing(false)
                return
            }

            setProfile(affiliateData)

            // B. Fetch Total Clicks from referrals table
            const { count: clicksCount, error: clicksError } = await supabase
                .from("referrals")
                .select("*", { count: "exact", head: true })
                .eq("affiliate_id", affiliateData.id)

            if (clicksError) {
                console.error("Error fetching referral clicks:", clicksError)
            }

            // C. Fetch Conversions for this affiliate
            const { data: convData, error: convError } = await supabase
                .from("conversions")
                .select("*")
                .eq("affiliate_id", affiliateData.id)
                .order("created_at", { ascending: false })

            if (convError) {
                console.error("Error fetching conversions:", convError)
            }

            const verifiedConversions = convData || []
            setConversions(verifiedConversions)

            // D. Calculate Financial Aggregates
            const totalClicks = clicksCount || 0
            const totalConversions = verifiedConversions.length
            const conversionRate = totalClicks > 0 
                ? Math.round((totalConversions / totalClicks) * 1000) / 10 
                : 0

            const grossSalesCents = verifiedConversions.reduce((sum, c) => sum + (c.amount_cents || 0), 0)
            const grossSalesDollars = grossSalesCents / 100

            const pendingCents = verifiedConversions
                .filter((c) => c.status === "pending")
                .reduce((sum, c) => sum + (c.commission_amount_cents || 0), 0)

            const paidCents = verifiedConversions
                .filter((c) => c.status === "paid")
                .reduce((sum, c) => sum + (c.commission_amount_cents || 0), 0)

            const totalEarnings = (pendingCents + paidCents) / 100

            setMetrics({
                totalClicks,
                totalConversions,
                conversionRate,
                grossSalesDollars,
                pendingCommissions: pendingCents / 100,
                paidCommissions: paidCents / 100,
                totalEarnings,
            })
        } catch (err: any) {
            console.error("Affiliate telemetry error:", err)
            toast.error("Failed to load affiliate telemetry: " + (err.message || "Unknown error"))
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [user])

    useEffect(() => {
        if (!user) {
            setIsLoading(false)
            return
        }

        let isMounted = true
        loadAffiliateData(true)

        // Real-Time Postgres Channel: Listen for new conversions and referral clicks
        const channel = supabase
            .channel(`affiliate_realtime_${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversions",
                },
                () => {
                    if (isMounted) loadAffiliateData(false)
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "referrals",
                },
                () => {
                    if (isMounted) loadAffiliateData(false)
                }
            )
            .subscribe()

        return () => {
            isMounted = false
            supabase.removeChannel(channel)
        }
    }, [user, loadAffiliateData])

    // Copy Referral Link Handler
    const affiliateUrl = useMemo(() => {
        if (!profile?.referral_code) return ""
        const origin = typeof window !== "undefined" ? window.location.origin : "https://aura.build"
        return `${origin}/?ref=${profile.referral_code}`
    }, [profile?.referral_code])

    const handleCopyLink = () => {
        if (!affiliateUrl) return
        navigator.clipboard.writeText(affiliateUrl)
        setCopiedLink(true)
        toast.success("Affiliate link copied to clipboard!", {
            description: "30-day sticky tracking enabled automatically."
        })
        setTimeout(() => setCopiedLink(false), 2500)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-16">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-400 mb-4" />
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                    Synchronizing Affiliate Matrix // Reconciling Conversions...
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* 1. HERO BANNER & REFERRAL LINK GENERATOR */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-black p-6 sm:p-8 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`font-mono text-xs uppercase px-2.5 py-0.5 border ${tierData.badgeStyle}`}>
                                <Award className="h-3 w-3 mr-1" />
                                {tierData.currentTierName} • {tierData.commissionRate}% Commission
                            </Badge>
                            <span className="text-zinc-500 font-mono text-xs">// 30-Day Attribution</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            Autonomous Affiliate Command
                        </h2>
                        <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
                            Share your verified referral link to capture automated commissions on all recurring and one-time subscriptions.
                        </p>
                    </div>

                    {/* Copy Link Terminal */}
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-black/60 border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-2 px-3 py-1.5 overflow-hidden">
                            <Share2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="font-mono text-xs text-zinc-200 truncate max-w-[260px] sm:max-w-[320px]">
                                {affiliateUrl || "Generating Code..."}
                            </span>
                        </div>
                        <Button 
                            onClick={handleCopyLink}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs h-9 px-4 shrink-0 transition-all shadow-md shadow-emerald-500/20"
                        >
                            {copiedLink ? (
                                <>
                                    <Check className="h-3.5 w-3.5 mr-1.5" /> Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* 2. TIERED PAYOUT PROGRESS BAR */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
                        <div className="text-zinc-300 flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-amber-400" />
                            <span>
                                Driven Gross Sales: <strong className="text-white font-bold">{formatCurrency(metrics.grossSalesDollars)}</strong>
                            </span>
                        </div>

                        {!tierData.isMaxTier ? (
                            <span className="text-zinc-400">
                                Drive <span className="text-emerald-400 font-semibold">{formatCurrency(tierData.remaining)}</span> more to unlock <span className="text-amber-400 font-semibold">{tierData.nextTierName} ({tierData.nextCommissionRate}%)</span>
                            </span>
                        ) : (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5" /> Maximum VIP 40% Tier Active
                            </span>
                        )}
                    </div>

                    <div className="relative">
                        <Progress 
                            value={tierData.progress} 
                            className="h-2.5 bg-zinc-900 border border-white/5 rounded-full overflow-hidden" 
                        />
                    </div>

                    {/* Tier Milestones Indicator */}
                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500 pt-1">
                        <span>Starter (20%)</span>
                        <span>$2,500 • Growth (30%)</span>
                        <span>$10,000+ • VIP (40%)</span>
                    </div>
                </div>
            </div>

            {/* 3. CORE METRIC TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Clicks */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-cyan-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Unique Clicks
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <Users className="h-4 w-4 text-cyan-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-white">
                            {metrics.totalClicks.toLocaleString()}
                        </div>
                        <p className="text-xs font-mono text-zinc-500 mt-1">
                            Audited from referrals log
                        </p>
                    </CardContent>
                </Card>

                {/* Total Conversions */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-purple-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Conversions
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <TrendingUp className="h-4 w-4 text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-purple-300">
                            {metrics.totalConversions}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-zinc-400">
                            <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-[10px] px-1.5 py-0">
                                {metrics.conversionRate}% CTR
                            </Badge>
                            <span>click-to-sale</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Commissions */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-amber-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Pending Payout
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Clock className="h-4 w-4 text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-amber-400">
                            {formatCurrency(metrics.pendingCommissions)}
                        </div>
                        <p className="text-xs font-mono text-zinc-500 mt-1">
                            In 30-day clearing escrow
                        </p>
                    </CardContent>
                </Card>

                {/* Total Settled / Paid */}
                <Card className="bg-zinc-950/60 border-white/5 hover:border-emerald-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                            Total Earned
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Coins className="h-4 w-4 text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono text-emerald-400">
                            {formatCurrency(metrics.totalEarnings)}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-zinc-400">
                            <span className="text-emerald-400 font-semibold">{formatCurrency(metrics.paidCommissions)}</span>
                            <span>settled to bank</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 4. TABS NAVIGATION (LEDGER / SWIPE COPY / LEADERBOARD) */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <TabsList className="bg-zinc-950 border border-white/10 p-1">
                        <TabsTrigger value="overview" className="text-xs font-mono data-[state=active]:bg-white/10">
                            Conversion Ledger
                        </TabsTrigger>
                        <TabsTrigger value="assets" className="text-xs font-mono data-[state=active]:bg-white/10">
                            Swipe Copy & Media
                        </TabsTrigger>
                        <TabsTrigger value="leaderboard" className="text-xs font-mono data-[state=active]:bg-white/10">
                            Affiliate Leaderboard
                        </TabsTrigger>
                    </TabsList>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadAffiliateData(false)}
                        disabled={isRefreshing}
                        className="text-zinc-400 hover:text-white text-xs font-mono h-8"
                    >
                        <RefreshCw className={`h-3 w-3 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
                        Sync Telemetry
                    </Button>
                </div>

                {/* TAB 1: CONVERSION LEDGER & RECENT ACTIVITY */}
                <TabsContent value="overview" className="space-y-6 m-0">
                    <Card className="bg-zinc-950/60 border-white/5">
                        <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <Coins className="h-5 w-5 text-emerald-400" />
                                    Audited Conversion Ledger
                                </CardTitle>
                                <CardDescription className="text-zinc-400 text-xs font-mono mt-1">
                                    Verified transactions cryptographically signed and credited to your affiliate wallet
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="border-white/10 text-zinc-400 text-xs font-mono">
                                {conversions.length} Total Conversions
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-black/40 border-b border-white/5">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-zinc-400 font-mono text-xs uppercase">Date</TableHead>
                                        <TableHead className="text-zinc-400 font-mono text-xs uppercase">Order Reference</TableHead>
                                        <TableHead className="text-zinc-400 font-mono text-xs uppercase">Sale Value</TableHead>
                                        <TableHead className="text-zinc-400 font-mono text-xs uppercase">Commission</TableHead>
                                        <TableHead className="text-zinc-400 font-mono text-xs uppercase">Effective Rate</TableHead>
                                        <TableHead className="text-zinc-400 font-mono text-xs uppercase text-right">Payout Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {conversions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-16 text-zinc-500 font-mono text-xs">
                                                <div className="max-w-md mx-auto space-y-3">
                                                    <Sparkles className="h-8 w-8 text-zinc-600 mx-auto" />
                                                    <p className="text-zinc-300 font-medium text-sm">No conversions recorded yet</p>
                                                    <p className="text-zinc-500 text-xs">
                                                        Deploy your referral link across Twitter, YouTube, or client stores to start accumulating commissions.
                                                    </p>
                                                    <Button 
                                                        onClick={handleCopyLink}
                                                        size="sm"
                                                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs"
                                                    >
                                                        <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Referral Link
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        conversions.map((conv) => {
                                            const dateFormatted = new Date(conv.created_at).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                            const saleDollars = conv.amount_cents / 100
                                            const commDollars = conv.commission_amount_cents / 100
                                            const ratePct = saleDollars > 0 
                                                ? Math.round((commDollars / saleDollars) * 100) 
                                                : tierData.commissionRate

                                            return (
                                                <TableRow key={conv.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="font-mono text-xs text-zinc-400">
                                                        {dateFormatted}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-zinc-200">
                                                        ORD-{conv.external_order_id.slice(-8).toUpperCase()}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-zinc-300">
                                                        {formatCurrency(saleDollars, conv.currency || "USD")}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm font-bold text-emerald-400">
                                                        {formatCurrency(commDollars, conv.currency || "USD")}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-zinc-400">
                                                        <Badge variant="outline" className="border-white/10 text-zinc-300 text-[10px]">
                                                            {ratePct}%
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                                                                conv.status === "paid"
                                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                                    : conv.status === "pending"
                                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                                                    : "bg-red-500/10 text-red-400 border-red-500/30"
                                                            }`}
                                                        >
                                                            {conv.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: PROMOTIONAL ASSETS */}
                <TabsContent value="assets" className="m-0">
                    <MarketingAssets />
                </TabsContent>

                {/* TAB 3: LEADERBOARD */}
                <TabsContent value="leaderboard" className="m-0">
                    <Leaderboard />
                </TabsContent>
            </Tabs>
        </div>
    )
}
