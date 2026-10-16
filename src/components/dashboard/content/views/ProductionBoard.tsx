import { useState } from "react"
import { BroadcastEngine } from "@/lib/publishing/broadcast-engine"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ProductionBoard() {
    const engine = new BroadcastEngine()
    const [isBroadcasting, setIsBroadcasting] = useState(false)
    const [logs, setLogs] = useState<string[]>([])

    const runProductionTest = async () => {
        setIsBroadcasting(true)
        setLogs(prev => [...prev, "🚀 Initializing Broadcast Engine..."])

        // Simulate a post
        const result = await engine.scheduleBroadcast({
            id: 'test-1',
            text: 'This is a test broadcast from AURA Content Studio.',
            platforms: ['twitter', 'linkedin'],
            scheduledFor: new Date()
        })

        setLogs(prev => [...prev, ...result.map(r => r.success ? `✅ [${r.platform}] Published: ${r.id}` : `❌ [${r.platform}] Failed`)])
        setIsBroadcasting(false)
    }

    return (
        <div className="p-6 h-full flex flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Production Control</h2>
                <p className="text-muted-foreground">Master Feed & Broadcast Status</p>
            </div>

            <Card className="w-full max-w-2xl bg-card/40 backdrop-blur-md border-white/5 p-6 min-h-[300px] flex flex-col">
                <div className="flex-1 space-y-2 font-mono text-sm overflow-auto max-h-[400px]">
                    {logs.length === 0 && <span className="text-muted-foreground opacity-50">System Idle. Ready to broadcast.</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="animate-in fade-in slide-in-from-left-2 text-green-400">
                            {log}
                        </div>
                    ))}
                    {isBroadcasting && (
                        <div className="text-blue-400 flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" /> Processing...
                        </div>
                    )}
                </div>
            </Card>

            <Button onClick={runProductionTest} disabled={isBroadcasting} className="bg-pink-600 hover:bg-pink-700 h-12 px-8">
                Run Production Test
            </Button>
        </div>
    )
}
