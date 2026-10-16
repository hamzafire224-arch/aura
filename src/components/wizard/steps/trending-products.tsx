import { ArrowRight, Check, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepTrendingProductsProps {
    onBack: () => void
    onNext: (data: any) => void
}

export function StepTrendingProducts({ onBack, onNext }: StepTrendingProductsProps) {
    const [niche, setNiche] = useState("")
    const [budget, setBudget] = useState([500])
    const [interest, setInterest] = useState("medium")

    const handleSubmit = () => {
        onNext({
            niche,
            budget,
            interest,
            type: 'trending'
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-8"
        >
            <div className="md:col-span-2 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select a Niche</Label>
                        <Select onValueChange={setNiche}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a market niche" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tech">Tech & Gadgets</SelectItem>
                                <SelectItem value="home">Home & Living</SelectItem>
                                <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                                <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                                <SelectItem value="pets">Pet Supplies</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Initial Ad Budget (Monthly)</Label>
                        <Slider
                            value={budget}
                            onValueChange={setBudget}
                            min={100}
                            max={5000}
                            step={100}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$100</span>
                            <span>${budget[0]}</span>
                            <span>$5,000+</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Your Interest Level in this Niche</Label>
                        <RadioGroup value={interest} onValueChange={setInterest}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="low" />
                                <Label htmlFor="low">Low (Just want profit)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="medium" />
                                <Label htmlFor="medium">Medium (Somewhat interested)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="high" />
                                <Label htmlFor="high">High (Passionate)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onBack}>Back</Button>
                    <Button onClick={handleSubmit} disabled={!niche}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" /> Market Insights
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Tech gadgets have high viral potential on TikTok.
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Home decor has consistent year-round demand.
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Pet supplies have very high customer retention.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
