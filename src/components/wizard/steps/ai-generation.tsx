import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Terminal, Search, Scale, PenTool, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Progress } from '@/components/ui/progress'
import { FlowEngine, type FlowLog, type FlowStep } from '@/lib/ai/flow-engine'

interface Stage {
    id: FlowStep | 'complete'
    icon: React.ElementType
    title: string
    description: string
    progress: number
}

const stages: Stage[] = [
    {
        id: 'researcher',
        icon: Search,
        title: 'The Researcher',
        description: 'Gathering market facts & trends',
        progress: 25
    },
    {
        id: 'analyst',
        icon: Brain,
        title: 'The Analyst',
        description: 'Formulating "Blue Ocean" strategy',
        progress: 50
    },
    {
        id: 'creator',
        icon: PenTool,
        title: 'The Creator',
        description: 'Designing brand assets',
        progress: 75
    },
    {
        id: 'critic',
        icon: Scale,
        title: 'The Critic',
        description: 'Reviewing & refining output',
        progress: 90
    },
    {
        id: 'complete',
        icon: CheckCircle,
        title: 'Finalizing',
        description: 'Preparing your business',
        progress: 100
    }
]

interface StepAIGenerationProps {
    data: any
    onComplete: (generated: any) => void
}

export function StepAIGeneration({ data: _data, onComplete }: StepAIGenerationProps) {
    const [currentStageId, setCurrentStageId] = useState<FlowStep | 'complete'>('researcher')
    const [logs, setLogs] = useState<string[]>([])
    const logContainerRef = useRef<HTMLDivElement>(null)
    const hasStarted = useRef(false)

    useEffect(() => {
        if (hasStarted.current) return
        hasStarted.current = true

        const runFlow = async () => {
            const engine = new FlowEngine((log: FlowLog) => {
                setLogs(prev => [...prev, `[${log.step.toUpperCase()}] ${log.message}`])
                setCurrentStageId(log.step)

                // Auto-scroll
                if (logContainerRef.current) {
                    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
                }
            })

            try {
                // Contextual Prompting based on Wizard Data
                const concept = _data.model === 'dropshipping'
                    ? `Dropshipping store in the "${_data.niche}" niche. Sourcing via ${_data.sourcing}. Targeting ${_data.targetMarket}.`
                    : _data.details || "New Business"

                const industryContext = _data.niche || _data.industry || "E-commerce"

                setLogs(prev => [...prev, `> Initializing FLOW Engine (Mode: ${_data.model?.toUpperCase() || 'GENERAL'})...`])

                const result = await engine.run({
                    idea: concept,
                    niche: industryContext,
                    budget: _data?.budget?.[0],
                    businessModel: _data?.model || 'general',
                    excludeNames: []
                })

                setCurrentStageId('complete')
                setLogs(prev => [...prev, `> FLOW Complete. Launching business...`])

                // Success animation
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })

                setTimeout(() => {
                    onComplete(result)
                }, 1500)

            } catch (error: any) {
                console.error("FLOW Error:", error)
                setLogs(prev => [...prev, `> ERROR: ${error.message}`])
                // In a real app, show a retry button here
            }
        }

        runFlow()
    }, [])

    const currentStageIndex = stages.findIndex(s => s.id === currentStageId)
    const currentStageData = stages[currentStageIndex !== -1 ? currentStageIndex : stages.length - 1]
    const Icon = currentStageData.icon

    return (
        <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center space-y-8 w-full max-w-2xl mx-auto"
        >
            {/* Animated Icon */}
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                {/* @ts-ignore */}
                <Icon className="h-16 w-16 text-primary animate-bounce relative z-10" />
            </div>

            {/* Current Stage */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">{currentStageData.title}...</h2>
                <p className="text-muted-foreground">{currentStageData.description}</p>
            </div>

            {/* Progress */}
            <div className="w-full space-y-2">
                <Progress value={currentStageData.progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                    {currentStageData.progress}% complete
                </p>
            </div>

            {/* Terminal Log */}
            <div className="w-full bg-black/80 rounded-lg border border-white/10 p-4 font-mono text-xs text-left h-48 overflow-hidden flex flex-col shadow-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2 text-muted-foreground">
                    <Terminal className="h-3 w-3" />
                    <span>aura-flow-engine --v2.0</span>
                </div>
                <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1 text-green-400">
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="break-words"
                            >
                                {log}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-4 bg-green-400 inline-block align-middle ml-1"
                    />
                </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-primary/5 px-4 py-2 rounded-full text-sm text-primary/80">
                💡 FLOW is analyzing thousands of data points to find your winning angle.
            </div>
        </motion.div>
    )
}
