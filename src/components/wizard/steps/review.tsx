import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, ArrowRight, Check } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface StepReviewProps {
    data: any
    onBack: () => void
    onNext: (data: any) => void
}

export function StepReview({ data, onBack, onNext }: StepReviewProps) {
    const [businessName, setBusinessName] = useState(data.generatedBusiness?.businessName || "")
    const [tagline, setTagline] = useState(data.generatedBusiness?.tagline || "")
    const [mission, setMission] = useState(data.generatedBusiness?.missionStatement || "")
    const [isRegenerating, setIsRegenerating] = useState(false)

    const handleRegenerateName = () => {
        setIsRegenerating(true)
        // Simulate regeneration
        setTimeout(() => {
            const prefixes = ["Nova", "Aura", "Zen", "Peak", "Flux", "Velvet", "Iron", "Swift", "Lumina", "Vertex", "Prisma", "Echo", "Solar", "Lunar", "Terra", "Aero"]
            const suffixes = ["Works", "Labs", "Co", "Studio", "Hub", "Flow", "Craft", "Sphere", "Systems", "Dynamics", "Ventures", "Collective", "Foundry", "Base", "Point"]
            const randomName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`
            setBusinessName(randomName)
            setIsRegenerating(false)
        }, 1000)
    }

    const handleNext = () => {
        // Update the main data object with any edits
        const updatedBusiness = {
            ...data.generatedBusiness,
            businessName,
            tagline,
            missionStatement: mission
        }
        onNext({ generatedBusiness: updatedBusiness })
    }

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Review Your Business Identity</h2>
                <p className="text-muted-foreground">Refine the AI-generated assets before we build your empire.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Brand Identity Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Brand Identity
                            <Button variant="ghost" size="sm" onClick={handleRegenerateName} disabled={isRegenerating}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                                Regenerate Name
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Business Name</Label>
                            <Input
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tagline</Label>
                            <Input
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mission Statement</Label>
                            <Textarea
                                value={mission}
                                onChange={(e) => setMission(e.target.value)}
                                className="h-24"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Strategy & Visuals Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Visual Identity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-16 w-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg relative overflow-hidden"
                                    style={{ backgroundColor: data.generatedBusiness?.colorPalette?.primary || '#000' }}
                                >
                                    {/* Dynamic Logo Pattern */}
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
                                    <span className="relative z-10">{businessName.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">Primary Color</p>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-6 rounded-full border shadow-sm" style={{ backgroundColor: data.generatedBusiness?.colorPalette?.primary }} title="Primary" />
                                        <div className="h-6 w-6 rounded-full border shadow-sm" style={{ backgroundColor: data.generatedBusiness?.colorPalette?.secondary }} title="Secondary" />
                                        <div className="h-6 w-6 rounded-full border shadow-sm" style={{ backgroundColor: data.generatedBusiness?.colorPalette?.accent }} title="Accent" />
                                    </div>
                                </div>
                            </div>
                            {data.generatedBusiness?.reasoning?.colorPsychology && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                    "{data.generatedBusiness.reasoning.colorPsychology}"
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Strategic Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.generatedBusiness?.reasoning?.nameChoice && (
                                <div className="bg-muted/50 p-3 rounded-md text-sm mb-4">
                                    <span className="font-semibold block mb-1">Why this name?</span>
                                    {data.generatedBusiness.reasoning.nameChoice}
                                </div>
                            )}

                            {data.generatedBusiness?.strategy?.uniqueSellingPoint && (
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Unique Selling Point</Label>
                                    <p className="text-sm">{data.generatedBusiness.strategy.uniqueSellingPoint}</p>
                                </div>
                            )}

                            {data.generatedBusiness?.strategy?.launchTactics && (
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Launch Tactics</Label>
                                    <ul className="space-y-1 text-sm">
                                        {data.generatedBusiness.strategy.launchTactics.map((tactic: string, i: number) => (
                                            <li key={i} className="flex gap-2 items-start">
                                                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">{tactic}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleNext} size="lg">
                    Looks Good, Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    )
}
