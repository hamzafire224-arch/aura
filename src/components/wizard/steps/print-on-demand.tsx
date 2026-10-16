import { ArrowRight, Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface StepPrintOnDemandProps {
    onBack: () => void
    onNext: (data: any) => void
}

export function StepPrintOnDemand({ onBack, onNext }: StepPrintOnDemandProps) {
    const [style, setStyle] = useState("minimalist")
    const [products, setProducts] = useState<string[]>([])

    const toggleProduct = (product: string) => {
        setProducts(prev =>
            prev.includes(product)
                ? prev.filter(p => p !== product)
                : [...prev, product]
        )
    }

    const handleSubmit = () => {
        onNext({
            style,
            products,
            type: 'pod'
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
                        <Label>Preferred Design Style</Label>
                        <RadioGroup value={style} onValueChange={setStyle} className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                <RadioGroupItem value="minimalist" id="minimalist" />
                                <Label htmlFor="minimalist" className="cursor-pointer">Minimalist</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                <RadioGroupItem value="retro" id="retro" />
                                <Label htmlFor="retro" className="cursor-pointer">Retro / Vintage</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                <RadioGroupItem value="typography" id="typography" />
                                <Label htmlFor="typography" className="cursor-pointer">Typography</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                <RadioGroupItem value="artistic" id="artistic" />
                                <Label htmlFor="artistic" className="cursor-pointer">Artistic / Abstract</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Product Types (Select at least one)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {['T-Shirts', 'Hoodies', 'Mugs', 'Posters', 'Phone Cases', 'Tote Bags'].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={item}
                                        checked={products.includes(item)}
                                        onCheckedChange={() => toggleProduct(item)}
                                    />
                                    <Label htmlFor={item}>{item}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onBack}>Back</Button>
                    <Button onClick={handleSubmit} disabled={products.length === 0}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Palette className="h-4 w-4 text-primary" /> Design Tips
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Minimalist designs often sell best on apparel.
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Mugs and posters are great for typography/quotes.
                            </li>
                            <li className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                Start with 2-3 core products to keep it simple.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
