import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Sparkles, LayoutDashboard, Swords, Brain, Workflow, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"


interface WalkthroughProps {
    run: boolean
    onComplete: () => void
}

export interface Step {
    title: string
    description: string
    icon: React.ComponentType<any>
    color: string
}

export function Walkthrough({ run, onComplete }: WalkthroughProps) {
    const { subscription_tier } = useAuth()
    const [currentStep, setCurrentStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [steps, setSteps] = useState<Step[]>([])

    useEffect(() => {
        if (run) {
            setIsOpen(true)
            generateSteps()
        }
    }, [run, subscription_tier])


    const generateSteps = () => {
        // Base steps for all users
        const baseSteps = [
            {
                title: "Welcome to AURA",
                description: "Your Universal Business Operating System. Let's get you oriented.",
                icon: Sparkles,
                color: "text-primary"
            },
            {
                title: "The Dashboard",
                description: "Command center for revenue, traffic, and actionable insights.",
                icon: LayoutDashboard,
                color: "text-blue-500"
            }
        ]

        // Pro / Enterprise Features - only show to users with higher tiers
        const isPaidUser = subscription_tier === 'pro' || subscription_tier === 'enterprise'

        const advancedSteps = [
            {
                title: "Intelligent Workflows",
                description: isPaidUser
                    ? "Automate complex tasks with AI Agents. Build Flows or use our Recipe Library."
                    : "Upgrade to Pro to unlock AI-powered automation workflows.",
                icon: Workflow,
                color: "text-purple-500"
            },
            {
                title: "The Brain (Agents)",
                description: isPaidUser
                    ? "Deploy autonomous agents like Content Strategist and Visual Designer to work for you."
                    : "AI Agents are available on Pro and Enterprise plans.",
                icon: Brain,
                color: "text-amber-500"
            },
            {
                title: "Competitor Spy",
                description: isPaidUser
                    ? "The War Room lets you analyze competitors and steal their strategies."
                    : "Competitive intelligence unlocks with Pro subscription.",
                icon: Swords,
                color: "text-red-500"
            }
        ]

        // Affiliate features available to all
        const businessSteps = [
            {
                title: "Affiliate Program",
                description: isPaidUser
                    ? "Earn 40% recurring commissions by referring others to AURA."
                    : "Earn 20% commissions now, or upgrade to Pro for 40% recurring.",
                icon: Users,
                color: "text-green-500"
            }
        ]

        setSteps([...baseSteps, ...advancedSteps, ...businessSteps])
    }

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleClose()
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        onComplete()
    }

    if (steps.length === 0) return null

    const StepIcon = steps[currentStep].icon

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center text-center space-y-6 py-6"
                    >
                        <div className={`w-20 h-20 rounded-full bg-secondary flex items-center justify-center ${steps[currentStep].color} bg-opacity-10`}>
                            <StepIcon className={`w-10 h-10 ${steps[currentStep].color}`} />
                        </div>

                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-bold">{steps[currentStep].title}</DialogTitle>
                            <DialogDescription className="text-base max-w-sm mx-auto">
                                {steps[currentStep].description}
                            </DialogDescription>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                    <div className="flex-1 flex items-center justify-center sm:justify-start gap-1 mb-4 sm:mb-0">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-2 rounded-full transition-colors ${i === currentStep ? "bg-primary" : "bg-secondary"}`}
                            />
                        ))}
                    </div>
                    <Button variant="ghost" onClick={handleClose}>Skip</Button>
                    <Button onClick={handleNext}>
                        {currentStep === steps.length - 1 ? (
                            <>Get Started <Check className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
