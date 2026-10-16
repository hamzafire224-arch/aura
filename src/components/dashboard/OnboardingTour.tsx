import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, Check } from 'lucide-react'

// Define the steps for the tour
const TOUR_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to AURA',
        description: 'Your autonomous growth engine. Let us show you around directly.',
        target: 'center'
    },
    {
        id: 'sidebar',
        title: 'Command Center',
        description: 'Access your Businesses, Content Studio, and Analytics here.',
        target: 'sidebar' // We'll assume a fixed position or use a portal if needed, but for MVP centering or absolute positioning works
    },
    {
        id: 'workflows',
        title: 'Intelligent Workflows',
        description: 'The heart of AURA. Create persistent, self-healing agent workflows.',
        target: 'workflows-nav'
    },
    {
        id: 'yc',
        title: 'Startup School',
        description: 'New! Access YC wisdom and Paul Graham essays instantly.',
        target: 'yc-nav'
    },
    {
        id: 'credits',
        title: 'AI Credits',
        description: 'Track your usage here. Upgrade if you need more power.',
        target: 'credits-box'
    }
]

export function OnboardingTour() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        // Check if user has seen tour
        const hasSeenTour = localStorage.getItem('aura_onboarding_seen')
        if (!hasSeenTour) {
            // Little delay for effect
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleClose()
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('aura_onboarding_seen', 'true')
    }

    if (!isVisible) return null

    const step = TOUR_STEPS[currentStep]

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal Card */}
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative z-10 w-full max-w-md bg-card border border-white/10 p-6 rounded-2xl shadow-2xl"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                                <span className="font-bold text-lg">{currentStep + 1}</span>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div className="flex gap-1">
                                    {TOUR_STEPS.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <Button onClick={handleNext} className="gap-2">
                                    {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
                                    {currentStep === TOUR_STEPS.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
