import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StoreBuilder } from "@/lib/ai/store-builder"
import { marketIntelligence } from "@/lib/ai/market-intelligence"
import type { BuilderLog, StoreTheme } from "@/lib/ai/store-builder"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    // Radar, // Researcher
    // BarChart3, // Analyst
    // Paintbrush, // Designer 
    // Crown, // Strategist
    Terminal, // System
    ArrowRight
    //     Check, ArrowRight, Loader2, ShieldCheck, Globe, Pencil
} from "lucide-react"
// import { EditThemeDialog } from "./EditThemeDialog"
import { Badge } from "@/components/ui/badge"
import { Database } from "lucide-react"

interface StepBuilderProps {
    data: any
    onGenerate: (config: any) => void
    onComplete: (theme: StoreTheme) => void
}

export function StepBuilder({ data, onGenerate, onComplete }: StepBuilderProps) {
    const [logs, setLogs] = useState<BuilderLog[]>([])
    const [theme, setTheme] = useState<StoreTheme | null>(null)
    const [isDebating, setIsDebating] = useState(true)
    // const [isEditing, setIsEditing] = useState(false)
    const [constructionStep, setConstructionStep] = useState(0)
    const logsEndRef = useRef<HTMLDivElement>(null)
    const [hasStarted, setHasStarted] = useState(false)

    // Using "theme_config" from the context data
    // War Room Intergration
    // const [streamIndex, setStreamIndex] = useState(0)

    // Using "theme_config" from the context data
    const themeConfig = data.themeConfig

    const constructionSteps = [
        "Compiling Next.js Storefront Architecture...",
        "Securing Stripe Payment Gateway (SSL Enforced)...",
        "Optimizing Assets for Edge Delivery (Global CDN)...",
        "Syncing Inventory to 'AURA_MASTER' Database...",
        "Finalizing Launch Matrix...",
        "Empire Ready."
    ]

    // 1. ORCHESTRATION: Market Intelligence -> Boardroom -> Build
    useEffect(() => {
        const runBoardroom = async () => {
            if (hasStarted || themeConfig) return
            setHasStarted(true)

            const builder = new StoreBuilder()

            // A. Market Intelligence (The "Deep Research")
            setLogs(prev => [...prev, { agent: 'system', message: `Initializing Deep Research Protocol for niche: ${data.niche}...` }])

            // This is where we get REAL data
            const marketReport = await marketIntelligence.analyzeNiche(data.niche)

            // B. The Executive Boardroom Debate
            // We pass a callback to stream logs in REAL-TIME to the UI
            const result = await builder.generateStoreTheme(
                data.generatedBusiness, // Strategy from previous step
                data.niche,
                marketReport,
                (log) => {
                    setLogs(prev => [...prev, log])
                    // Scroll to bottom
                    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
                }
            )

            // C. Save the result
            const fullConfig = {
                logs: logs, // Save the transcript
                theme: result.theme
            }
            onGenerate(fullConfig) // Persist to parent
            setTheme(result.theme)
            setIsDebating(false) // Trigger construction phase
        }

        // If we already have a config (navigated back/forth), just show it
        if (themeConfig) {
            setLogs(themeConfig.logs || [])
            setTheme(themeConfig.theme)
            setIsDebating(false)
            setConstructionStep(constructionSteps.length) // Skip animation
        } else {
            runBoardroom()
        }

    }, [hasStarted, themeConfig, data.niche])


    // 2. Construction Phase (The Build)
    useEffect(() => {
        if (!isDebating && theme && constructionStep < constructionSteps.length) {
            // Only animate if we didn't skip (i.e. if we just finished debating)
            if (themeConfig) return

            const timeout = setTimeout(() => {
                setConstructionStep(prev => prev + 1)
            }, 2000) // 2s per step

            return () => clearTimeout(timeout)
        }
    }, [isDebating, constructionStep, theme])

    const isFullyReady = !isDebating && constructionStep >= constructionSteps.length

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-emerald-500" />
                        AURA COMMAND CENTER
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {isDebating ? "Agents are establishing strategy consensus..." : "Strategy locked. Execution in progress."}
                    </p>
                </div>
                {!isFullyReady && (
                    <Badge variant="outline" className="animate-pulse border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                        LIVE SESSION
                    </Badge>
                )}
            </div>

            <div className="grid lg:grid-cols-12 gap-6 h-[700px]">
                {/* LEFT: Strategy Map (Visualize the "Brain") */}
                <div className="lg:col-span-8 space-y-6 flex flex-col">
                    <Card className="flex-1 bg-black/90 border-white/10 relative overflow-hidden p-6 shadow-2xl backdrop-blur-3xl flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-50" />
                        <div className="text-center space-y-4">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin" />
                                <div className="absolute inset-2 border-r-2 border-blue-500 rounded-full animate-spin reverse" />
                                <div className="absolute inset-4 border-b-2 border-purple-500 rounded-full animate-spin" />
                                <Database className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h3 className="text-lg font-mono text-emerald-400">Neural Network Active</h3>
                            <p className="text-sm text-gray-500">Constructing Empire Architecture...</p>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: War Room Console (The Chat) */}
                <div className="lg:col-span-4 flex flex-col">
                    <Card className="flex-1 bg-black border-white/10 p-4 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                            <Terminal className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-mono text-emerald-500 uppercase">System Logs</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-2 text-gray-400">
                                    <span className="text-emerald-500/50">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={log.agent === 'system' ? 'text-blue-400' : 'text-gray-300'}>
                                        <span className="opacity-50 uppercase mr-2">{log.agent}:</span>
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Result Card (Hidden until ready) */}
            <AnimatePresence>
                {theme && isFullyReady && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-10 right-10 z-50"
                    >
                        <Card className="w-96 bg-gray-900 border-white/20 shadow-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Strategy Finalized</h3>
                            <p className="text-gray-400 text-sm mb-4">The Boardroom has generated a production-ready assets package.</p>
                            <Button onClick={() => onComplete(theme)} className="w-full bg-white text-black hover:bg-gray-200">
                                Launch Empire <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    )
}


