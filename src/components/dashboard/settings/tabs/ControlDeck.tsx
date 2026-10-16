import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap, Bell } from "lucide-react"
import { toast } from "sonner"

export function ControlDeck() {
    const handleToggle = (feature: string) => {
        toast.info(`${feature} preference updated`)
    }

    return (
        <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-400" /> System Preferences
                    </CardTitle>
                    <CardDescription>Configure your global command center settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">High-Fidelity Animations</Label>
                            <p className="text-sm text-muted-foreground">Enable particle effects and 3D transitions.</p>
                        </div>
                        <Switch defaultChecked onCheckedChange={() => handleToggle("Graphics")} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Agent Autonomy</Label>
                            <p className="text-sm text-muted-foreground">Allow agents to execute low-risk actions without approval.</p>
                        </div>
                        <Switch onCheckedChange={() => handleToggle("Autonomy")} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-400" /> Signal Alerts
                    </CardTitle>
                    <CardDescription>Manage incoming intelligence feeds.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Trend Spikes</Label>
                            <p className="text-sm text-muted-foreground">Notify when a niche topic exceeds 10k vol/hr.</p>
                        </div>
                        <Switch defaultChecked onCheckedChange={() => handleToggle("Trend Alerts")} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Financial Pulse</Label>
                            <p className="text-sm text-muted-foreground">Daily burn rate and cash flow summaries.</p>
                        </div>
                        <Switch defaultChecked onCheckedChange={() => handleToggle("Finance Alerts")} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
