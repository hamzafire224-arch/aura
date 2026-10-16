import { ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { useState } from "react"

interface StepProductIdeaProps {
    onBack: () => void
    onNext: (data: any) => void
}

export function StepProductIdea({ onBack, onNext }: StepProductIdeaProps) {
    const [details, setDetails] = useState("")
    const [industry, setIndustry] = useState("")
    const [priceRange, setPriceRange] = useState([30])
    const [budget, setBudget] = useState([500])
    const [businessModel, setBusinessModel] = useState("source")

    const handleSubmit = () => {
        onNext({
            details,
            industry,
            priceRange,
            budget,
            businessModel
        })
    }

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-8"
        >
            <div className="md:col-span-2 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tell us about your product idea</Label>
                        <Textarea
                            placeholder="I want to sell minimalist leather wallets for professionals..."
                            className="h-32 bg-card/50"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground text-right">{details.length}/500</p>
                    </div>

                    <div className="space-y-2">
                        <Label>What's your niche/industry?</Label>
                        <Input
                            placeholder="e.g. Fashion & Accessories"
                            className="bg-card/50"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Target Price ($)</Label>
                            <span className="font-mono text-sm font-bold text-primary">${priceRange[0]}</span>
                        </div>
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={200}
                            step={5}
                            className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$200+</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Starting Budget ($)</Label>
                            <span className="font-mono text-sm font-bold text-primary">${budget[0]}</span>
                        </div>
                        <Slider
                            value={budget}
                            onValueChange={setBudget}
                            max={5000}
                            step={100}
                            className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$0</span>
                            <span>$5,000+</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Business model</Label>
                        <RadioGroup value={businessModel} onValueChange={setBusinessModel}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="source" id="source" />
                                <Label htmlFor="source">I make/source products</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dropship" id="dropship" />
                                <Label htmlFor="dropship">Dropshipping</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="saas" id="saas" />
                                <Label htmlFor="saas">SaaS / Digital Product</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="service" id="service" />
                                <Label htmlFor="service">Agency / Consulting</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="creator" id="creator" />
                                <Label htmlFor="creator">Content Creator</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pod" id="pod" />
                                <Label htmlFor="pod">Print on Demand</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="trend" id="trend" />
                                <Label htmlFor="trend">Trend Hunter (Arbitrage)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onBack}>Back</Button>
                    <Button onClick={handleSubmit}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" /> AI Tips
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Be specific about your target audience
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Mention what makes it unique
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Include price point ideas
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
