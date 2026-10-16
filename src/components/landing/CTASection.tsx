import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function CTASection() {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleStart = () => {
        if (email) {
            navigate(`/signup?email=${encodeURIComponent(email)}`)
        } else {
            navigate("/signup")
        }
    }

    return (
        <section className="w-full py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
                        Ready to stop dreaming and <br />
                        <span className="text-primary">start earning?</span>
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Join 1,247 entrepreneurs already building their empire with AI.
                        Launch your first business in the next 60 minutes.
                    </p>

                    <div className="w-full max-w-md space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter your email"
                                className="h-12 bg-background/50 border-white/10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                            />
                            <Button size="lg" className="h-12 px-8" onClick={handleStart}>
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            No credit card required. 30-day money-back guarantee.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>Cancel anytime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>Free 14-day trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
