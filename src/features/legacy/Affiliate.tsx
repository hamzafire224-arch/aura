import { useState, useEffect } from "react"
import {
    Users,
    DollarSign,
    Copy,
    Share2,
    Download,
    CreditCard,
    Check,
    Trophy,
    Target,
    MousePointer,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

const MOCK_EARNINGS_DATA = [
    { name: "Jan", earnings: 0 },
    { name: "Feb", earnings: 0 },
    { name: "Mar", earnings: 0 },
    { name: "Apr", earnings: 0 },
    { name: "May", earnings: 0 },
    { name: "Jun", earnings: 0 },
    { name: "Jul", earnings: 0 },
]

export default function Affiliate() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("overview")
    const [copied, setCopied] = useState(false)

    // State
    const [isLoading, setIsLoading] = useState(true)
    const [affiliateData, setAffiliateData] = useState<any>(null)
    const [referrals, setReferrals] = useState<any[]>([])

    // Dynamic referral code based on user
    const referralCode = affiliateData?.referral_code || user?.email?.split('@')[0] || 'johndoe'
    const referralLink = `https://aura.ai/ref/${referralCode}`

    useEffect(() => {
        if (!user) return
        fetchAffiliateData()
    }, [user])

    const fetchAffiliateData = async () => {
        try {
            // 1. Fetch Affiliate Record
            const { data: aff, error: affError } = await supabase
                .from('affiliates')
                .select('*')
                .eq('user_id', user?.id)
                .single()

            if (affError && affError.code !== 'PGRST116') { // PGRST116 is "Row not found"
                console.error("Error fetching affiliate:", affError)
            }

            setAffiliateData(aff)

            // 2. Fetch Referrals if affiliate exists
            if (aff) {
                const { data: refs, error: refsError } = await supabase
                    .from('referrals')
                    .select('*')
                    .eq('affiliate_id', aff.id)
                    .order('created_at', { ascending: false })

                if (refsError) console.error("Error fetching referrals:", refsError)
                setReferrals(refs || [])
            }

        } catch (error) {
            console.error("Affiliate load error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const copyLink = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(referralLink)
                setCopied(true)
                toast.success("Referral link copied to clipboard!")
                setTimeout(() => setCopied(false), 2000)
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement("textarea")
                textArea.value = referralLink

                // Ensure it's not visible but part of DOM
                textArea.style.position = "fixed"
                textArea.style.left = "-9999px"
                textArea.style.top = "0"
                document.body.appendChild(textArea)

                textArea.focus()
                textArea.select()

                const successful = document.execCommand('copy')
                document.body.removeChild(textArea)

                if (successful) {
                    setCopied(true)
                    toast.success("Referral link copied to clipboard!")
                    setTimeout(() => setCopied(false), 2000)
                } else {
                    throw new Error("Clipboard copy failed")
                }
            }
        } catch (err) {
            console.error("Failed to copy:", err)
            toast.error("Failed to copy link. Please copy manually.")
        }
    }

    const handleShare = () => {
        // In a real app, use Web Share API
        if (navigator.share) {
            navigator.share({
                title: 'Join AURA',
                text: 'Check out this amazing platform!',
                url: referralLink,
            }).catch(console.error)
        } else {
            toast.info("Share URL copied to clipboard")
            copyLink()
        }
    }

    const handleApply = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('affiliates')
                .insert([{
                    user_id: user?.id,
                    referral_code: user?.email?.split('@')[0] + '-' + Math.floor(Math.random() * 1000),
                    status: 'pending'
                }])
                .select()
                .single()

            if (error) throw error

            setAffiliateData(data)
            toast.success("Application submitted! Welcome to the program.")
        } catch (error: any) {
            toast.error("Application failed: " + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    const isApplied = !!affiliateData
    const isPending = affiliateData?.status === 'pending'
    const isActive = affiliateData?.status === 'active'

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Affiliate Program <span className="text-2xl">💸</span>
                        </h1>
                        <Badge variant="outline" className={isActive ? "border-green-500/50 text-green-500 bg-green-500/10" : isPending ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" : "border-gray-500/50"}>
                            {isActive ? "Active Partner" : isPending ? "Application Pending" : "Join Now"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Earn 40% recurring commission for every referral.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {!isApplied && (
                        <Button onClick={handleApply} className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white border-0">
                            Apply for Access
                        </Button>
                    )}
                    {(isApplied) && (
                        <>
                            <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded-lg border">
                                <span className="text-xs font-medium px-2 text-muted-foreground truncate max-w-[150px]">
                                    {referralLink.replace('https://', '')}
                                </span>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copyLink}>
                                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                </Button>
                            </div>
                            <Button variant="outline" onClick={handleShare}>
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Section A: Quick Stats */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${affiliateData?.total_earnings || "0.00"}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Lifetime commissions
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{affiliateData?.total_referrals || 0}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="font-medium">{affiliateData?.successful_conversions || 0}</span> conversions
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${affiliateData?.pending_earnings || "0.00"}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Min payout: $50
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Status</CardTitle>
                                <Trophy className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold capitalize">{affiliateData?.status || "Guest"}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Standard Commission (40%)
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Section B: Performance Chart */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Earnings Over Time</CardTitle>
                                <CardDescription>Your commission growth over the last 6 months.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={MOCK_EARNINGS_DATA}>
                                        <defs>
                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                                            itemStyle={{ color: "hsl(var(--foreground))" }}
                                        />
                                        <Area type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEarnings)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Section D: Top Performing Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Traffic Sources</CardTitle>
                                <CardDescription>Where your clicks are coming from.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2"><Target className="h-4 w-4 text-blue-400" /> Twitter</span>
                                        <span className="font-medium">127 clicks</span>
                                    </div>
                                    <Progress value={65} className="h-1.5" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2"><MousePointer className="h-4 w-4 text-orange-400" /> Blog</span>
                                        <span className="font-medium">89 clicks</span>
                                    </div>
                                    <Progress value={45} className="h-1.5" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab 2: Referrals */}
                <TabsContent value="referrals" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Referrals</CardTitle>
                                    <CardDescription>Track the status of everyone you've referred.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Referral Code Used</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Commission</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referrals.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No referrals yet. Share your link to get started!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        referrals.map((referral) => (
                                            <TableRow key={referral.id}>
                                                <TableCell className="font-medium">{referral.referral_code}</TableCell>
                                                <TableCell>
                                                    <Badge variant={referral.commission_status === "paid" ? "default" : "secondary"}>
                                                        {referral.commission_status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(referral.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-medium text-green-500">${referral.commission_amount}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Earnings */}
                <TabsContent value="earnings" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Payout History</CardTitle>
                                <CardDescription>View your past payouts.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-10 text-muted-foreground">
                                    No payouts generated yet.
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 border rounded-lg bg-secondary/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">Method</span>
                                        <Badge variant="outline">{affiliateData?.payment_method || 'None'}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Configure in Settings</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab 4: Resources */}
                <TabsContent value="resources" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Marketing Assets</CardTitle>
                                <CardDescription>Banners, logos, and social graphics.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center">
                                            <Share2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Social Media Kit</p>
                                            <p className="text-xs text-muted-foreground">Instagram, Twitter, LinkedIn</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tips & Best Practices</CardTitle>
                                <CardDescription>How to maximize your earnings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Create Tutorials</h4>
                                    <p className="text-xs text-muted-foreground">Video tutorials showing how you use AURA convert 3x better than standard links.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Share Your Results</h4>
                                    <p className="text-xs text-muted-foreground">Share screenshots of your business growth. Social proof drives action.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
