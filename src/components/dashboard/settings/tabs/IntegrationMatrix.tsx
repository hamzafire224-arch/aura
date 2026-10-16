import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Key, CheckCircle2, AlertCircle, ShoppingBag, CreditCard, Coins, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useIntegration, IntegrationProvider } from "@/contexts/IntegrationContext"
import { supabase } from "@/lib/supabase"

export function IntegrationMatrix() {
    const { integrations, connectIntegration, disconnectIntegration } = useIntegration()
    const [connecting, setConnecting] = useState<string | null>(null)

    // Form states
    const [shopifyUrl, setShopifyUrl] = useState("")
    const [shopifyToken, setShopifyToken] = useState("")

    // Helper to check status
    const getStatus = (provider: IntegrationProvider) => {
        return integrations.find(i => i.provider === provider)
    }

    const handleConnectShopify = async () => {
        if (!shopifyUrl || !shopifyToken) return toast.error("Please enter both Store URL and Access Token")

        setConnecting('shopify')
        try {
            // Verify with Edge Function
            const { data, error } = await supabase.functions.invoke('verify-shopify', {
                body: { shopUrl: shopifyUrl, accessToken: shopifyToken }
            })

            if (error || !data.success) throw new Error(data?.error || error?.message || "Verification failed")

            // Save to Context (DB)
            await connectIntegration('shopify', {
                accessToken: shopifyToken,
                shopUrl: shopifyUrl,
                shop: data.shop // Metadata
            })

            setShopifyUrl("")
            setShopifyToken("")
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setConnecting(null)
        }
    }

    const handleDisconnect = async (id: string) => {
        if (confirm("Are you sure? This will disconnect the integration.")) {
            await disconnectIntegration(id)
        }
    }

    const shopify = getStatus('shopify')

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Integration Matrix</h2>
                    <p className="text-muted-foreground">Manage API keys and external connections across the Aura ecosystem.</p>
                </div>
                <Badge variant="outline" className="h-8 border-yellow-500/20 text-yellow-500 bg-yellow-500/5 gap-2">
                    <Shield className="h-4 w-4" />
                    Client-Side Encryption Active
                </Badge>
            </div>

            <div className="grid gap-6">
                {/* SHOPIFY CARD */}
                <Card className={`bg-card/40 backdrop-blur-md border-white/5 overflow-hidden transition-all ${shopify ? 'border-green-500/20 bg-green-500/5' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 text-green-400`}>
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Shopify</CardTitle>
                                <CardDescription>Product tagging in Content Studio.</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {shopify ? (
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-muted-foreground">Disconnected</Badge>
                            )}
                            <Switch
                                checked={!!shopify}
                                onCheckedChange={() => shopify ? handleDisconnect(shopify.id) : null}
                                disabled={!shopify} // Switch only disconnects here, connect is manual below
                            />
                        </div>
                    </CardHeader>

                    {/* CONFIG PANEL */}
                    <div className={`grid transition-all duration-300 ${!shopify ? 'grid-rows-[1fr] opacity-100 p-6 pt-0' : 'grid-rows-[0fr] opacity-0 p-0'}`}>
                        <div className="overflow-hidden space-y-4 pt-4 border-t border-white/5">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Store Domain</Label>
                                    <Input
                                        placeholder="your-store.myshopify.com"
                                        value={shopifyUrl}
                                        onChange={(e) => setShopifyUrl(e.target.value)}
                                        className="bg-black/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Admin Access Token</Label>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            placeholder="shpat_..."
                                            value={shopifyToken}
                                            onChange={(e) => setShopifyToken(e.target.value)}
                                            className="bg-black/20 pr-10"
                                        />
                                        <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                                    </div>
                                </div>
                                <Button onClick={handleConnectShopify} disabled={connecting === 'shopify'} className="w-full">
                                    {connecting === 'shopify' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Connect Store
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* STRIPE CARD (Placeholder) */}
                <Card className="bg-card/20 border-white/5 opacity-60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-indigo-400">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Stripe</CardTitle>
                                <CardDescription>Revenue attribution & subscription management.</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                    </CardHeader>
                </Card>

                {/* BINANCE CARD (Placeholder) */}
                <Card className="bg-card/20 border-white/5 opacity-60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-yellow-400">
                                <Coins className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Binance</CardTitle>
                                <CardDescription>Live crypto portfolio syncing.</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                    </CardHeader>
                </Card>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
                <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-400">Deployment Notice</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        For production environments, API keys are encrypted using AES-GCM before storage in Supabase Vault.
                        Direct client-side usage is restricted to development mode. Ensure `process.env.SUPABASE_ANON_KEY` is configured correctly.
                    </p>
                </div>
            </div>
        </div>
    )
}
