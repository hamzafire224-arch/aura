import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleStart = () => {
        if (email) {
            navigate(`/signup?email=${encodeURIComponent(email)}`)
        } else {
            navigate("/signup")
        }
    }

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, TextPlugin)

        const ctx = gsap.context(() => {
            const headline = headlineRef.current
            if (headline) {
                gsap.from(headline, {
                    y: 100,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power4.out"
                })
            }

            // Floating particles
            gsap.to(".particle", {
                y: "random(-100, 100)",
                x: "random(-100, 100)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            })

            // Stats counter
            gsap.utils.toArray(".stat-number").forEach((el: any) => {
                const target = parseInt(el.getAttribute("data-target"))
                gsap.to(el, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    delay: 1,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString() + (el.getAttribute("data-suffix") || "")
                    }
                })
            })

            // Fade in elements
            gsap.from(".fade-in", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                delay: 0.5,
                ease: "power2.out"
            })

        }, heroRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={heroRef} className="relative min-h-[90vh] w-full overflow-hidden bg-background flex flex-col items-center justify-center pt-20">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
                <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px]" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            {/* Floating Particles */}
            {Array.from({ length: 30 }).map((_, i) => (
                <div
                    key={i}
                    className="particle absolute rounded-full bg-white/20"
                    style={{
                        width: Math.random() * 4 + 1 + "px",
                        height: Math.random() * 4 + 1 + "px",
                        top: Math.random() * 100 + "%",
                        left: Math.random() * 100 + "%",
                    }}
                />
            ))}

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
                <div className="fade-in inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white mb-8 backdrop-blur-md shadow-2xl">
                    <Sparkles className="h-4 w-4 text-primary mr-2" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        The Universal Operating System for Business
                    </span>
                </div>

                <h1 ref={headlineRef} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 max-w-5xl leading-[1.1]">
                    Run Your Empire <br />
                    <span className="text-primary">On Autopilot.</span>
                </h1>

                <p className="fade-in text-lg md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed">
                    Replace your fragmented tools with one intelligent system.
                    <span className="text-white font-medium"> Autonomous Agents</span>,
                    <span className="text-white font-medium"> Smart Workflows</span>, and
                    <span className="text-white font-medium"> Deep Analytics</span> working in perfect harmony.
                </p>

                <div className="fade-in flex flex-col sm:flex-row items-center gap-4 w-full max-w-md sm:max-w-xl relative">
                    {/* Glowing input border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-xl blur opacity-20" />

                    <div className="relative flex w-full gap-2 p-1.5 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                        <Input
                            type="email"
                            placeholder="Enter your email to start..."
                            className="bg-transparent border-none text-white placeholder:text-muted-foreground/50 h-12 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        />
                        <Button
                            size="lg"
                            className="h-12 px-8 text-base font-semibold bg-white text-black hover:bg-white/90 shadow-lg transition-all hover:scale-105 whitespace-nowrap rounded-lg"
                            onClick={handleStart}
                        >
                            Start Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="fade-in mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span>1,200+ Active Founders</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div>No Credit Card Required</div>
                </div>

                {/* Feature Pills */}
                <div className="fade-in mt-20 flex flex-wrap justify-center gap-4 opacity-50">
                    {["AI Agents", "Workflow Automation", "Lead Enrichment", "Financial Modeling"].map((tag) => (
                        <div key={tag} className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs uppercase tracking-wider font-medium text-muted-foreground">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
