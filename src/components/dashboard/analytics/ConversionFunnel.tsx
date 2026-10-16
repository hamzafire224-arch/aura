import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ConversionFunnel() {
    const steps = [
        { label: "Total Traffic", value: 12500, dropoff: "45%" },
        { label: "Product Views", value: 6875, dropoff: "60%" },
        { label: "Add to Cart", value: 2750, dropoff: "30%" },
        { label: "Purchases", value: 1925, conversionRate: "15.4%" }
    ]

    const maxVal = steps[0].value

    return (
        <Card className="bg-card/40 backdrop-blur-md border-white/5 h-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Conversion Funnel</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Track user journey from visit to purchase.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
                <CardDescription>Detailed drop-off analysis.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {steps.map((step, i) => (
                        <div key={step.label} className="relative">
                            <div className="flex items-center justify-between text-sm mb-2 z-10 relative">
                                <span className="font-medium flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                        {i + 1}
                                    </div>
                                    {step.label}
                                </span>
                                <div className="text-right">
                                    <span className="font-bold block">{step.value.toLocaleString()}</span>
                                    {step.dropoff && (
                                        <span className="text-[10px] text-red-400">-{step.dropoff} drop-off</span>
                                    )}
                                    {step.conversionRate && (
                                        <span className="text-[10px] text-emerald-400">{step.conversionRate} conv. rate</span>
                                    )}
                                </div>
                            </div>

                            {/* Bar Visual */}
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden w-full relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step.value / maxVal) * 100}%` }}
                                    transition={{ duration: 1, delay: i * 0.2 }}
                                    className={`h-full rounded-full ${i === steps.length - 1 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                />
                            </div>

                            {/* Connector Arrow (visual only, except last) */}
                            {i < steps.length - 1 && (
                                <div className="absolute left-3 top-8 bottom-[-16px] w-px bg-white/5 -z-0"></div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
