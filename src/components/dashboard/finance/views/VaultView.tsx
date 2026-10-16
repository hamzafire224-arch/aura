import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle2, RefreshCw, CreditCard, Building2, Wallet } from "lucide-react"
import { toast } from "sonner"
import type { MarketData } from "@/hooks/use-market-data"

interface VaultProps {
    data: MarketData
    updateWealth: (data: any) => void
}

export function VaultView({ data, updateWealth }: VaultProps) {
    const [connectors, setConnectors] = useState([
        { id: 'stripe', name: 'Stripe', type: 'Revenue', connected: false, icon: CreditCard, color: 'text-indigo-400' },
        { id: 'mercury', name: 'Mercury Bank', type: 'Banking', connected: false, icon: Building2, color: 'text-blue-400' },
        { id: 'binance', name: 'Binance', type: 'Crypto', connected: true, icon: Wallet, color: 'text-yellow-400' },
        { id: 'paypal', name: 'PayPal', type: 'Float', connected: false, icon: CreditCard, color: 'text-blue-600' },
    ])

    const handleConnect = (id: string) => {
        const loadingToast = toast.loading("Initiating SimpleAuth handskake...")

        setTimeout(() => {
            setConnectors(prev => prev.map(c => c.id === id ? { ...c, connected: true } : c))
            toast.dismiss(loadingToast)
            toast.success(`Secure link established with ${id.charAt(0).toUpperCase() + id.slice(1)}`)

            // Simulate data injection
            if (id === 'stripe') {
                updateWealth((prev: any) => ({ ...prev, cash: prev.cash + 12500, profitMonth: prev.profitMonth + 4200 }))
            }
        }, 2000)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

            {/* SECURITY HEADER */}
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-emerald-500" />
                    <div>
                        <h3 className="font-bold text-emerald-500 text-sm">Vault Security Active</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>End-to-end 256-bit encryption.</span>
                            <span className="text-emerald-500/50">|</span>
                            <span>Secured Assets: ${data.business.cash.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5">
                    <Lock className="h-3 w-3 mr-1" /> SECURE
                </Badge>
            </div>

            {/* INTEGRATION GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {connectors.map((connector) => (
                    <Card key={connector.id} className="bg-card/40 backdrop-blur-md border-white/5 relative overflow-hidden group">
                        {connector.connected && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                        )}
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-full bg-white/5 ${connector.color} group-hover:scale-110 transition-transform duration-300`}>
                                <connector.icon className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="font-bold">{connector.name}</h3>
                                <p className="text-xs text-muted-foreground">{connector.type}</p>
                            </div>
                            <Button
                                variant={connector.connected ? "outline" : "default"}
                                size="sm"
                                className="w-full"
                                onClick={() => !connector.connected && handleConnect(connector.id)}
                                disabled={connector.connected}
                            >
                                {connector.connected ? "Synced" : "Connect"}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* REVENUE MAPPING (The "User Input Plans" Logic) */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-card/40 backdrop-blur-md border-white/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 text-indigo-400" />
                            Plan Revenue Attribution
                        </CardTitle>
                        <CardDescription>Automated mapping of Stripe products to Aura Revenue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Pro Monthly", price: "$49.00", active: 124, rev: "$6,076", source: "Stripe" },
                                { name: "Enterprise Annual", price: "$499.00", active: 12, rev: "$5,988", source: "Stripe" },
                                { name: "Consulting Hour", price: "$150.00", active: 8, rev: "$1,200", source: "PayPal" },
                            ].map((plan, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                            {plan.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{plan.name}</p>
                                            <p className="text-xs text-muted-foreground">{plan.active} active subs</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold">{plan.rev}</p>
                                        <Badge variant="secondary" className="text-[10px] h-5">{plan.source}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border-white/5">
                    <CardHeader>
                        <CardTitle>Compliance Log</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { event: "Stripe Webhook Verified", time: "2 min ago", status: "success" },
                            { event: "Data Encrypted (At Rest)", time: "1 hour ago", status: "success" },
                            { event: "Bank Feed Sync", time: "4 hours ago", status: "warning" },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                                <div className={`mt-0.5 h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <div>
                                    <p className="font-medium">{log.event}</p>
                                    <p className="text-xs text-muted-foreground">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
