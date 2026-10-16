import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Terminal, Zap, AlertTriangle, Search, Brain, LineChart } from "lucide-react"

export function NeuralStrategyView() {
    const [logs, setLogs] = useState<string[]>([])
    const [simulating, setSimulating] = useState(false)
    const [progress, setProgress] = useState(0)

    // Initial boot logs
    useEffect(() => {
        const bootSequence = [
            "Initializing Neural Core...",
            "Connecting to Global Market Firehose...",
            "Loading 1,400+ Hedge Fund Strategy Templates...",
            "System Ready. Awaiting Command."
        ]

        let i = 0
        const interval = setInterval(() => {
            if (i < bootSequence.length) {
                setLogs(prev => [...prev, bootSequence[i]])
                i++
            } else {
                clearInterval(interval)
            }
        }, 800)
        return () => clearInterval(interval)
    }, [])

    const runSimulation = () => {
        setSimulating(true)
        setProgress(0)
        setLogs(prev => [...prev, "> INITIATING MONTE CARLO SIMULATION (N=10,000)..."])

        // Simulation loop
        let p = 0
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 10) + 5
            if (p >= 100) {
                p = 100
                setSimulating(false)
                clearInterval(interval)
                setLogs(prev => [
                    ...prev,
                    "Parsing 14,020 Scenarios...",
                    "Found 3 Alpha Opportunities.",
                    "> OPTIMIZATION COMPLETE."
                ])
            }
            setProgress(p)
            setLogs(prev => [...prev, `Simulating Scenario #${Math.floor(Math.random() * 9000) + 1000}...`].slice(-6)) // Keep last 6 logs
        }, 400)
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Top Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card/40 backdrop-blur-md border-purple-500/20 bg-purple-500/5">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Strategies</p>
                            <p className="text-2xl font-bold text-purple-400">1,402</p>
                        </div>
                        <Brain className="h-8 w-8 text-purple-500 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-card/40 backdrop-blur-md border-white/5">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Simulations / Hr</p>
                            <p className="text-2xl font-bold">42,000</p>
                        </div>
                        <Zap className="h-8 w-8 text-yellow-500 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-card/40 backdrop-blur-md border-white/5">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Alpha Detected</p>
                            <p className="text-2xl font-bold text-green-400">+4.2%</p>
                        </div>
                        <LineChart className="h-8 w-8 text-green-500 opacity-50" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Main Console */}
                <Card className="md:col-span-2 bg-black/80 border-white/10 font-mono text-sm shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/10 bg-white/5 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-emerald-500" />
                                <span className="text-emerald-500 font-bold">NEURAL_STRATEGY_ENGINE_V1</span>
                            </div>
                            {simulating && (
                                <Badge variant="outline" className="text-yellow-500 border-yellow-500 animate-pulse">Running</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 h-[400px] flex flex-col">
                        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-white/80 border-l-2 border-transparent pl-2 hover:border-white/20"
                                >
                                    <span className="text-emerald-500 mr-2">$</span>
                                    {log}
                                </motion.div>
                            ))}
                            {simulating && (
                                <div className="space-y-2 mt-4">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Crunching Data Points...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-1 bg-white/10" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <Button
                                onClick={runSimulation}
                                disabled={simulating}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-widest"
                            >
                                {simulating ? "PROCESSING..." : "RUN STRATEGY FINDER"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Detected Opportunities */}
                <div className="space-y-4">
                    <Card className="bg-card/40 backdrop-blur-md border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Search className="h-4 w-4 text-blue-400" />
                                Detected Alpha
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "Undervalued Asset", desc: "SOL is 12% below mov. avg.", risk: "Med", type: "Buy" },
                                { title: "Yield Gap", desc: "Aave offering 8% on USDC.", risk: "Low", type: "Stake" },
                            ].map((opp, i) => (
                                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant="outline" className={opp.type === 'Buy' ? 'text-green-400 border-green-500/30' : 'text-blue-400 border-blue-500/30'}>
                                            {opp.type}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{opp.risk} Risk</span>
                                    </div>
                                    <h4 className="font-bold text-sm">{opp.title}</h4>
                                    <p className="text-xs text-muted-foreground">{opp.desc}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-md border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Budget Optimizer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="text-sm font-bold text-amber-500">Unused Sub Detected</p>
                                    <p className="text-xs text-muted-foreground">Adobe Creative Cloud ($54/mo)</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                                View Audit
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
