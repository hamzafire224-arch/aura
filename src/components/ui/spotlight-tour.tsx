import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, X, Check } from "lucide-react"

interface Step {
    targetId: string
    title: string
    description: string
    position?: "top" | "bottom" | "left" | "right"
}

interface SpotlightTourProps {
    steps: Step[]
    isOpen: boolean
    onComplete: () => void
    onSkip: () => void
}

export function SpotlightTour({ steps, isOpen, onComplete, onSkip }: SpotlightTourProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [rect, setRect] = useState<DOMRect | null>(null)
    const currentStep = steps[currentStepIndex]

    useEffect(() => {
        if (!isOpen) return

        const updateRect = () => {
            const element = document.getElementById(currentStep.targetId)
            if (element) {
                const r = element.getBoundingClientRect()
                setRect(r)
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }

        updateRect()
        window.addEventListener("resize", updateRect)
        return () => window.removeEventListener("resize", updateRect)
    }, [currentStepIndex, isOpen, currentStep.targetId])

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        } else {
            onComplete()
        }
    }

    const getTooltipStyle = (rect: DOMRect, position: Step['position'] = 'bottom') => {
        const spacing = 24
        const cardWidth = 320
        const cardHeight = 200 // Approx

        switch (position) {
            case 'right':
                return {
                    top: rect.top + (rect.height / 2) - 100, // Center vertically roughly
                    left: rect.right + spacing,
                }
            case 'left':
                return {
                    top: rect.top + (rect.height / 2) - 100,
                    left: rect.left - cardWidth - spacing,
                }
            case 'top':
                return {
                    top: rect.top - cardHeight - spacing,
                    left: rect.left + (rect.width / 2) - (cardWidth / 2),
                }
            case 'bottom':
            default:
                return {
                    top: rect.bottom + spacing,
                    left: Math.max(16, Math.min(window.innerWidth - 340, rect.left)),
                }
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {/* Backdrop with Hole */}
            <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
                {rect && (
                    <motion.div
                        initial={false}
                        animate={{
                            top: rect.top - 8,
                            left: rect.left - 8,
                            width: rect.width + 16,
                            height: rect.height + 16,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                        }}
                        className="absolute rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] ring-2 ring-primary/50 pointer-events-auto transition-none"
                    />
                )}
            </div>

            {/* Content Card */}
            <div className="fixed inset-0 z-[101] pointer-events-none">
                {rect && (
                    <motion.div
                        key={currentStep.title}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            ...getTooltipStyle(rect, currentStep.position)
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="absolute pointer-events-auto"
                    >
                        <div className="w-[320px] bg-card/95 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <div className="text-xs font-mono text-primary uppercase tracking-wider">
                                        Step {currentStepIndex + 1} / {steps.length}
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">{currentStep.title}</h3>
                                </div>
                                <button onClick={onSkip} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                {currentStep.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted'}`}
                                        />
                                    ))}
                                </div>
                                <Button onClick={handleNext} size="sm" className="gap-2 shadow-lg shadow-primary/20">
                                    {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                                    {currentStepIndex === steps.length - 1 ? <Check size={14} /> : <ChevronRight size={14} />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    )
}
