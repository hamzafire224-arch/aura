import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Link as LinkIcon, ShieldCheck } from "lucide-react"

const brokers = [
    { name: "Robinhood", status: "connected", logo: "RH" },
    { name: "Coinbase", status: "disconnected", logo: "CB" },
    { name: "Binance", status: "disconnected", logo: "BN" },
    { name: "Fidelity", status: "disconnected", logo: "FI" },
]

export function BrokerConnect() {
    return (
        <Card className="bg-card/40 backdrop-blur-md border-white/5 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Connected Brokers</CardTitle>
                        <CardDescription>
                            Securely link your accounts via Plaid/OAuth.
                        </CardDescription>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {brokers.map((broker) => (
                        <div key={broker.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                                    {broker.logo}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{broker.name}</div>
                                    <div className={`text-[10px] uppercase font-bold tracking-wider ${broker.status === 'connected' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                        {broker.status}
                                    </div>
                                </div>
                            </div>
                            {broker.status === 'disconnected' ? (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                        </div>
                    ))}
                    <Button className="w-full mt-4" variant="outline">
                        Add New Connection <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
