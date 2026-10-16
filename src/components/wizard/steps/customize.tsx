import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { useState } from "react"

interface StepCustomizeProps {
    data: any
    onUpdate: (data: any) => void
    onLaunch: () => void
}

export function StepCustomize({ data, onUpdate, onLaunch }: StepCustomizeProps) {
    const [businessName, setBusinessName] = useState(data.generatedBusiness?.businessName || "")
    const [tagline, setTagline] = useState(data.generatedBusiness?.tagline || "")
    const [mission, setMission] = useState(data.generatedBusiness?.missionStatement || "")

    const handleLaunch = () => {
        // Save final changes before launching
        onUpdate({
            generatedBusiness: {
                ...data.generatedBusiness,
                businessName,
                tagline,
                missionStatement: mission
            }
        })
        onLaunch()
    }

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Customize Your Business</h2>
                    <p className="text-muted-foreground">Review and tweak what AI has generated for you.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Business Name</Label>
                        <div className="flex gap-2">
                            <Input
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                            />
                            <Button variant="outline" size="icon"><Sparkles className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tagline</Label>
                        <div className="flex gap-2">
                            <Input
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                            />
                            <Button variant="outline" size="icon"><Sparkles className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Mission Statement</Label>
                        <Textarea
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            className="h-24"
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button variant="outline" className="flex-1">Save Draft</Button>
                    <Button className="flex-1" onClick={handleLaunch}>Launch Business 🚀</Button>
                </div>
            </div>

            <div className="border border-white/10 rounded-lg bg-card/50 p-6">
                <h3 className="font-semibold mb-4">Preview</h3>
                <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden group">
                    {/* Abstract Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50 group-hover:opacity-70 transition-opacity" />

                    <div className="text-center space-y-2 relative z-10">
                        <div className="h-16 w-16 bg-primary/20 rounded-xl mx-auto flex items-center justify-center text-primary font-bold text-2xl shadow-lg border border-white/10 backdrop-blur-sm">
                            {businessName.charAt(0) || "A"}
                        </div>
                        <h4 className="font-bold text-2xl tracking-tight">{businessName || "Your Business"}</h4>
                        <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">{tagline || "Your Tagline"}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
