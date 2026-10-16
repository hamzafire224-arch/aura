import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/hooks/useAuth"
import { Wallet } from "lucide-react"
import { toast } from "sonner"

export function PayoutSettings() {
    const { user } = useAuth()
    const [method, setMethod] = useState("crypto")
    const [details, setDetails] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user) loadSettings()
    }, [user])

    const loadSettings = async () => {
        const { data } = await supabase
            .from('affiliates')
            .select('payout_method, payout_details')
            .eq('user_id', user?.id)
            .single()

        if (data) {
            setMethod(data.payout_method || "crypto")
            // Extract the main detail value based on method
            if (data.payout_details) {
                setDetails(data.payout_details.address || data.payout_details.email || "")
            }
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const payoutPayload = method === 'crypto'
                ? { address: details, network: 'USDT (TRC20)' }
                : { email: details }

            const { error } = await supabase
                .from('affiliates')
                .update({
                    payout_method: method,
                    payout_details: payoutPayload
                })
                .eq('user_id', user?.id)

            if (error) throw error
            toast.success("Payout Settings Saved")
        } catch (e) {
            toast.error("Failed to save settings")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="bg-black/40 border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                Payout Method
            </h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-gray-400">Preferred Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="bg-slate-900 border-white/10 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="crypto">Crypto (USDT)</SelectItem>
                            <SelectItem value="wise">Wise (Bank Transfer)</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-400">
                        {method === 'crypto' ? 'USDT (TRC20) Address' :
                            method === 'wise' ? 'Wise Email' : 'PayPal Email'}
                    </Label>
                    <Input
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="bg-slate-900 border-white/10 text-white font-mono"
                        placeholder={method === 'crypto' ? "T..." : "user@example.com"}
                    />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {isLoading ? "Saving..." : "Save Payout Details"}
                </Button>

                <p className="text-xs text-center text-gray-500">
                    Payouts are processed on the 1st of every month via Batch Transfer.
                </p>
            </div>
        </Card>
    )
}
