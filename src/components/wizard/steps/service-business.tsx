import { ArrowRight, Check, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepServiceBusinessProps {
    onBack: () => void
    onNext: (data: any) => void
}

export function StepServiceBusiness({ onBack, onNext }: StepServiceBusinessProps) {
    const [serviceType, setServiceType] = useState("")
    const [rate, setRate] = useState("")
    const [experience, setExperience] = useState("intermediate")

    const handleSubmit = () => {
        onNext({
            serviceType,
            rate,
            experience,
            type: 'service'
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
                        <Label>Service Category</Label>
                        <Select onValueChange={setServiceType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="consulting">Consulting & Coaching</SelectItem>
                                <SelectItem value="design">Design & Creative</SelectItem>
                                <SelectItem value="writing">Writing & Translation</SelectItem>
                                <SelectItem value="dev">Development & Tech</SelectItem>
                                <SelectItem value="marketing">Marketing & SEO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Target Hourly Rate ($)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 100"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Experience Level</Label>
                        <RadioGroup value={experience} onValueChange={setExperience}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="beginner" id="beginner" />
                                <Label htmlFor="beginner">Beginner (0-2 years)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="intermediate" id="intermediate" />
                                <Label htmlFor="intermediate">Intermediate (2-5 years)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expert" id="expert" />
                                <Label htmlFor="expert">Expert (5+ years)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onBack}>Back</Button>
                    <Button onClick={handleSubmit} disabled={!serviceType || !rate}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" /> Agency Tips
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Niche down to charge higher rates.
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Package your services (e.g., "Monthly Retainer").
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Focus on results/ROI in your pitch.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
