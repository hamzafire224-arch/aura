import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, DollarSign, Globe, Package, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepDropshippingProps {
    onBack: () => void
    onNext: (data: any) => void
}

export function StepDropshipping({ onBack, onNext }: StepDropshippingProps) {
    const [selectedNiche, setSelectedNiche] = useState("")
    const [customNiche, setCustomNiche] = useState("") // usage: if selectedNiche === 'custom', this is the category name
    const [description, setDescription] = useState("") // New: Detailed user vision
    const [budget, setBudget] = useState([500])
    const [sourcing, setSourcing] = useState("aliexpress")
    const [experience, setExperience] = useState("beginner")
    const [targetMarket, setTargetMarket] = useState("global")

    // Computed niche value
    const finalNiche = selectedNiche === 'custom' ? customNiche : selectedNiche

    const handleNext = () => {
        onNext({
            niche: finalNiche,
            description: description || `A dropshipping business specializing in ${finalNiche}`,
            budget,
            sourcing,
            experience,
            targetMarket,
            model: 'dropshipping'
        })
    }

    const niches = [
        "Home & Garden", "Beauty & Personal Care", "Tech Accessories",
        "Pet Supplies", "Fitness & Wellness", "Kids & Babies",
        "Fashion & Jewelry", "Car Accessories", "Outdoor & Survival"
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Dropshipping Setup</h2>
                <p className="text-muted-foreground">Configure the parameters for your product sourcing and market strategy.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Core Inputs */}
                <div className="space-y-6">

                    {/* Niche Selection */}
                    <div className="space-y-3">
                        <Label className="text-base">Target Niche</Label>
                        <Select onValueChange={setSelectedNiche} value={selectedNiche}>
                            <SelectTrigger className="h-12 bg-white/5 border-white/10">
                                <SelectValue placeholder="Select a profitable niche..." />
                            </SelectTrigger>
                            <SelectContent>
                                {niches.map(n => (
                                    <SelectItem key={n} value={n}>{n}</SelectItem>
                                ))}
                                <SelectItem value="custom">Other / Custom Niche</SelectItem>
                            </SelectContent>
                        </Select>

                        {selectedNiche === 'custom' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <Input
                                    placeholder="Enter your specific niche..."
                                    className="mt-2 bg-white/5 border-white/10"
                                    value={customNiche}
                                    onChange={(e) => setCustomNiche(e.target.value)}
                                />
                            </motion.div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            <Target className="inline h-3 w-3 mr-1" />
                            AURA will analyze sub-niches within this category.
                        </p>
                    </div>

                    {/* Business Description */}
                    <div className="space-y-3 pt-2">
                        <Label className="text-base">Business Concept & Vision</Label>
                        <div className="relative">
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                placeholder="Describe your specific idea (e.g., 'Minimalist leather bags for digital nomads' or 'Eco-friendly pet toys'). The more detail, the better the AI strategy."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between">
                            <Label className="text-base">Initial Ad Budget</Label>
                            <span className="font-mono text-emerald-400 font-bold">${budget[0]}</span>
                        </div>
                        <Slider
                            value={budget}
                            onValueChange={setBudget}
                            max={5000}
                            step={100}
                            className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Bootstrapped ($100)</span>
                            <span>Aggressive ($5k+)</span>
                        </div>
                    </div>

                    {/* Target Market */}
                    <div className="space-y-3 pt-2">
                        <Label className="text-base">Target Market</Label>
                        <RadioGroup defaultValue="global" onValueChange={setTargetMarket} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="global" id="global" className="peer sr-only" />
                                <Label htmlFor="global" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    <Globe className="mb-2 h-6 w-6" />
                                    Global / Generic
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="us-eu" id="us-eu" className="peer sr-only" />
                                <Label htmlFor="us-eu" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    <Target className="mb-2 h-6 w-6" />
                                    Tier 1 (US/EU/UK)
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                {/* Right Column: Sourcing & Experience */}
                <div className="space-y-6">

                    {/* Sourcing Strategy */}
                    <div className="space-y-3">
                        <Label className="text-base">Sourcing Strategy</Label>
                        <RadioGroup defaultValue="aliexpress" onValueChange={setSourcing} className="flex flex-col gap-3">
                            <Label className="flex items-center space-x-3 space-y-0 rounded-md border border-white/10 p-4 hover:bg-white/5 cursor-pointer has-[:checked]:border-emerald-500/50 has-[:checked]:bg-emerald-500/5 transition-all">
                                <RadioGroupItem value="aliexpress" id="ali" />
                                <div className="flex-1">
                                    <div className="font-medium">Direct from China</div>
                                    <div className="text-xs text-muted-foreground">AliExpress / CJ Dropshipping. High margin, longer shipping.</div>
                                </div>
                                <Package className="h-5 w-5 text-muted-foreground" />
                            </Label>
                            <Label className="flex items-center space-x-3 space-y-0 rounded-md border border-white/10 p-4 hover:bg-white/5 cursor-pointer has-[:checked]:border-emerald-500/50 has-[:checked]:bg-emerald-500/5 transition-all">
                                <RadioGroupItem value="us-supplier" id="us" />
                                <div className="flex-1">
                                    <div className="font-medium">US/EU Suppliers</div>
                                    <div className="text-xs text-muted-foreground">Zendrop / Spocket. Lower margin, fast shipping (2-5 days).</div>
                                </div>
                                <Globe className="h-5 w-5 text-muted-foreground" />
                            </Label>
                        </RadioGroup>
                    </div>

                    {/* Experience Level (Affects Tips) */}
                    <div className="space-y-3 pt-2">
                        <Label className="text-base">Your Experience Level</Label>
                        <Select onValueChange={setExperience} value={experience}>
                            <SelectTrigger className="h-12 bg-white/5 border-white/10">
                                <SelectValue placeholder="Select level..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner (Guide me completely)</SelectItem>
                                <SelectItem value="intermediate">Intermediate (I know the ropes)</SelectItem>
                                <SelectItem value="expert">Expert (Just give me data)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Summary Card */}
                    <Card className="bg-emerald-500/10 border-0 p-4 mt-8">
                        <div className="flex gap-3">
                            <div className="h-10 w-10 text-emerald-400 bg-emerald-400/20 rounded-full flex items-center justify-center shrink-0">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-emerald-400">Profit Projection</h4>
                                <p className="text-xs text-emerald-200/70 leading-relaxed">
                                    Based on <strong>{finalNiche || "selected niche"}</strong> and a <strong>${budget}</strong> budget,
                                    AURA estimates a potential of <strong>2-5 winning products</strong> in the first month.
                                </p>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <Button variant="ghost" onClick={onBack}>Back to Models</Button>
                <Button onClick={handleNext} disabled={!finalNiche} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold">
                    Generate Business Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    )
}
