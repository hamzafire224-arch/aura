import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Coins, 
    Bot, 
    Check, 
    Copy, 
    Download, 
    Loader2, 
    Sparkles, 
    ArrowRight, 
    ArrowLeft, 
    Briefcase,
    Compass
} from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useBusiness } from "@/contexts/BusinessContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const INDUSTRIES = [
    { id: "dropship", label: "E-Commerce / Dropshipping", desc: "High-margin physical DTC consumer products" },
    { id: "saas", label: "B2B Micro-SaaS / Software", desc: "Recurring software solutions for specific niches" },
    { id: "agency", label: "Productized Agency / Services", desc: "High-ticket done-for-you service packages" },
    { id: "creator", label: "Digital Products / Info-Empire", desc: "Communities, digital assets, and high-margin courses" },
    { id: "local", label: "Local Service Business", desc: "Lead generation and tech-enabled local services" },
]

const CAPITAL_TIERS = [
    { id: "micro", label: "$500 – $1,500 (Lean Bootstrapped)", desc: "Organic marketing, lean validation, zero ad waste" },
    { id: "standard", label: "$1,500 – $5,000 (Calculated Sprint)", desc: "Paid ads testing, professional assets, fast validation" },
    { id: "scale", label: "$5,000 – $20,000 (Growth Capital)", desc: "Bulk sourcing, influencer seeding, multi-channel ads" },
    { id: "venture", label: "$20,000+ (Full Arsenal)", desc: "Custom manufacturing, aggressive PPC, brand moat" },
]

const DISTRIBUTION_CHANNELS = [
    "Shopify Store + Meta & TikTok Paid Ads",
    "Organic Content Marketing (TikTok, Reels, YouTube Shorts)",
    "Cold B2B Email + LinkedIn Social Selling",
    "Search Engine Optimization (SEO) & High-Intent Blogging",
    "Amazon FBA / Multi-Marketplace Arbitrage",
]

export default function BusinessWizardPage() {
    const { businesses } = useBusiness()
    const activeBusiness = businesses[0]

    // Multi-Step Form State
    const [currentStep, setCurrentStep] = useState(1)

    // Form inputs
    const [industry, setIndustry] = useState("dropship")
    const [niche, setNiche] = useState("")
    const [demographic, setDemographic] = useState("")
    const [coreProblem, setCoreProblem] = useState("")
    const [capitalTier, setCapitalTier] = useState("standard")
    const [distribution, setDistribution] = useState(DISTRIBUTION_CHANNELS[0])
    const [strategicGoal, setStrategicGoal] = useState("Achieve $10,000/month net profit within 90 days")

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false)
    const [strategyOutput, setStrategyOutput] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const selectedIndustry = INDUSTRIES.find((i) => i.id === industry) || INDUSTRIES[0]
    const selectedCapital = CAPITAL_TIERS.find((c) => c.id === capitalTier) || CAPITAL_TIERS[1]

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!niche.trim()) {
            toast.error("Please specify your business niche or concept.")
            setCurrentStep(1)
            return
        }

        if (!demographic.trim()) {
            toast.error("Please define your target customer demographic.")
            setCurrentStep(2)
            return
        }

        if (!activeBusiness?.id) {
            toast.error("Active business profile required", {
                description: "Please log in or select a business entity to execute the strategy architect."
            })
            return
        }

        setIsGenerating(true)
        toast.info("Mobilizing Market Analyst Agent...", {
            description: "Architecting 360-degree business blueprint (2 Credits)."
        })

        const architectPrompt = `Act as an elite venture architect, top-tier management consultant, and seasoned e-commerce operator.
Construct an end-to-end, highly actionable, mathematically sound Business Strategy Blueprint based on these parameters:

- Selected Industry: ${selectedIndustry.label}
- Target Niche: ${niche.trim()}
- Ideal Customer Profile (ICP) / Demographic: ${demographic.trim()}
- Core Problem Solved / Unique Value Proposition: ${coreProblem.trim() || "Providing an affordable, reliable, modern alternative with superior customer experience"}
- Starting Capital Tier: ${selectedCapital.label}
- Primary Distribution Channel: ${distribution}
- Primary Growth Horizon: ${strategicGoal.trim()}

Structure your response into 5 comprehensive modules using clean Markdown headings, bullet points, and tables:

### MODULE 1: EXECUTIVE FEASIBILITY & MARKET SIZING
- Market Viability Score (out of 100) with strategic rationale.
- Total Addressable Market (TAM) & Serviceable Obtainable Market (SOM) estimation.
- Top 3 unfair competitive advantages to exploit immediately.

### MODULE 2: PRODUCT ARCHITECTURE & UNIT ECONOMICS
- Recommended flagship product/service offer breakdown.
- Target Cost of Goods Sold (COGS), recommended retail price, and target gross margin %.
- Supplier sourcing strategy and shipping/fulfillment recommendations.

### MODULE 3: 30-DAY GO-TO-MARKET (GTM) EXECUTION SPRINT
- Week 1: Digital asset build, store configuration, and tracking setup.
- Week 2: Creative asset production (ad hooks, scripts, angle testing).
- Week 3: Channel launch & traffic testing ($20-$50/day ad tests).
- Week 4: Optimization, conversion rate tuning, and scale triggers.

### MODULE 4: FINANCIAL BLUEPRINT & METRIC TARGETS
- Customer Acquisition Cost (CAC) benchmark for this niche.
- Target Lifetime Value (LTV) and 30-day cash return on ad spend (ROAS).
- Break-even unit sales count needed per month.

### MODULE 5: RISK MITIGATION & COMPETITIVE MOATS
- Top 3 fatal failure modes for this specific niche and how to systematically prevent them.
- Retention & expansion strategy to build a long-term defensible moat.

Avoid fluff, cliches, and vague generalities. Provide concrete, numbers-driven strategic directives.`

        try {
            const { data: edgeData, error: edgeError } = await supabase.functions.invoke("agent-gateway", {
                body: {
                    businessId: activeBusiness.id,
                    agentType: "market_analyst",
                    intent: "business_strategy",
                    prompt: architectPrompt,
                    creditsCost: 2,
                }
            })

            if (edgeError) {
                console.error("Strategy generation error:", edgeError)
                const errorMsg = edgeError.message || ""
                const isInsufficientCredits = 
                    errorMsg.includes("402") || 
                    errorMsg.toLowerCase().includes("insufficient") ||
                    (edgeError as any)?.context?.status === 402 ||
                    (edgeError as any)?.status === 402

                if (isInsufficientCredits) {
                    toast.error("Insufficient Credits (402)", {
                        description: "You need at least 2 credits to architect a business strategy blueprint. Please top up your treasury balance."
                    })
                    return
                }

                toast.error("Strategy Architecture Failed", {
                    description: errorMsg || "Agent gateway encountered an unexpected inference error."
                })
                return
            }

            const outputText = edgeData?.output || edgeData?.result || "Business blueprint synthesized successfully."
            setStrategyOutput(outputText)
            toast.success("Business Blueprint Synthesized!", {
                description: "2 credits deducted via atomic ledger."
            })

        } catch (err: any) {
            console.error("Fatal error generating business strategy:", err)
            toast.error("Generation Error: " + (err.message || "Unknown error"))
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = () => {
        if (!strategyOutput) return
        navigator.clipboard.writeText(strategyOutput)
        setCopied(true)
        toast.success("Complete business plan copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        if (!strategyOutput) return
        const blob = new Blob([strategyOutput], { type: "text/markdown;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${niche.toLowerCase().replace(/[^a-z0-9]/g, "-")}-business-blueprint.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/20 flex flex-col font-sans">
            <title>AI Business Strategy Architect | AURA</title>
            <meta name="description" content="Autonomous AI venture architect that engineers comprehensive 360-degree business plans" />

            <Navbar />

            <main className="flex-1 pt-28 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400 font-mono text-[10px] uppercase tracking-wider">
                                <Bot className="h-3 w-3 mr-1" />
                                Market Analyst Agent
                            </Badge>
                            <Badge variant="secondary" className="bg-white/5 text-zinc-400 font-mono text-[10px] border border-white/5">
                                <Coins className="h-2.5 w-2.5 mr-1 text-amber-400" />
                                2 Credits Per Blueprint
                            </Badge>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                            <Compass className="h-8 w-8 text-blue-400" />
                            AI Business Strategy Architect
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Transform an abstract idea into an institutional-grade, mathematical launch blueprint in seconds.
                        </p>
                    </div>

                    {activeBusiness && (
                        <div className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span>Active Entity:</span>
                            <span className="text-white font-semibold">{activeBusiness.name}</span>
                        </div>
                    )}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT PANEL: Multi-Step Input Wizard */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl">
                            {/* Stepper Header */}
                            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono text-xs font-bold">
                                        {currentStep}
                                    </span>
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                                        {currentStep === 1 && "Step 1: Market & Industry Foundation"}
                                        {currentStep === 2 && "Step 2: ICP & Core Value Proposition"}
                                        {currentStep === 3 && "Step 3: Capital & Sales Architecture"}
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono text-zinc-500">Step {currentStep} of 3</span>
                            </div>

                            <CardContent className="p-5">
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    {/* STEP 1 */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-mono uppercase text-zinc-300">
                                                    Industry Category
                                                </label>
                                                <Select value={industry} onValueChange={setIndustry}>
                                                    <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                        <SelectValue placeholder="Select Industry" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                        {INDUSTRIES.map((ind) => (
                                                            <SelectItem key={ind.id} value={ind.id}>
                                                                {ind.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[11px] text-zinc-500 font-mono">
                                                    {selectedIndustry.desc}
                                                </p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-mono uppercase text-zinc-300">
                                                    Specific Business Niche / Product Line <span className="text-blue-400">*</span>
                                                </label>
                                                <Input
                                                    placeholder="e.g. Ergonomic carbon-fiber desk accessories for engineers"
                                                    value={niche}
                                                    onChange={(e) => setNiche(e.target.value)}
                                                    className="bg-black/50 border-white/10 text-sm focus-visible:ring-blue-500"
                                                    required
                                                />
                                                <p className="text-[11px] text-zinc-500">
                                                    Be specific: narrow niches yield vastly superior unit economics.
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (!niche.trim()) {
                                                        toast.error("Please enter a target niche.")
                                                        return
                                                    }
                                                    setCurrentStep(2)
                                                }}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-10 mt-2"
                                            >
                                                Next: Define ICP & Value Proposition <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* STEP 2 */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-mono uppercase text-zinc-300">
                                                    Target Demographic & Audience (ICP) <span className="text-blue-400">*</span>
                                                </label>
                                                <Input
                                                    placeholder="e.g. Remote developers aged 24-42 making $90k+ annually"
                                                    value={demographic}
                                                    onChange={(e) => setDemographic(e.target.value)}
                                                    className="bg-black/50 border-white/10 text-sm focus-visible:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-mono uppercase text-zinc-300">
                                                    Core Problem Solved / Unique Value Prop
                                                </label>
                                                <Textarea
                                                    placeholder="e.g. Eliminates posture fatigue and wrist strain during 10-hour coding sessions with lifetime durability..."
                                                    value={coreProblem}
                                                    onChange={(e) => setCoreProblem(e.target.value)}
                                                    rows={3}
                                                    className="bg-black/50 border-white/10 text-sm focus-visible:ring-blue-500 resize-none"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setCurrentStep(1)}
                                                    className="w-1/3 border-white/10 text-zinc-400 hover:text-white text-xs h-10"
                                                >
                                                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!demographic.trim()) {
                                                            toast.error("Please enter your target demographic.")
                                                            return
                                                        }
                                                        setCurrentStep(3)
                                                    }}
                                                    className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-10"
                                                >
                                                    Next: Capital & Distribution <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3 */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-mono uppercase text-zinc-300">
                                                    Starting Capital & Budget Tier
                                                </label>
                                                <Select value={capitalTier} onValueChange={setCapitalTier}>
                                                    <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                        <SelectValue placeholder="Select Capital Tier" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                        {CAPITAL_TIERS.map((tier) => (
                                                            <SelectItem key={tier.id} value={tier.id}>
                                                                {tier.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[11px] text-zinc-500 font-mono">
                                                    {selectedCapital.desc}
                                                </p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-mono uppercase text-zinc-300">
                                                    Primary Go-To-Market Channel
                                                </label>
                                                <Select value={distribution} onValueChange={setDistribution}>
                                                    <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                        <SelectValue placeholder="Select Channel" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                        {DISTRIBUTION_CHANNELS.map((ch) => (
                                                            <SelectItem key={ch} value={ch}>
                                                                {ch}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-mono uppercase text-zinc-300">
                                                    Strategic 90-Day Target Goal
                                                </label>
                                                <Input
                                                    value={strategicGoal}
                                                    onChange={(e) => setStrategicGoal(e.target.value)}
                                                    className="bg-black/50 border-white/10 text-sm focus-visible:ring-blue-500"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setCurrentStep(2)}
                                                    className="w-1/3 border-white/10 text-zinc-400 hover:text-white text-xs h-10"
                                                >
                                                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isGenerating}
                                                    className="w-2/3 bg-blue-500 hover:bg-blue-400 text-black font-semibold text-xs h-10 shadow-lg shadow-blue-500/20"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Synthesizing Blueprint...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="h-4 w-4 mr-1.5" />
                                                            Architect Plan (2 Credits)
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT PANEL: Live Strategy Blueprint Output */}
                    <div className="lg:col-span-7">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl min-h-[620px] flex flex-col">
                            <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-blue-400" />
                                        Venture Architecture Dossier
                                    </CardTitle>
                                    <CardDescription className="text-xs font-mono text-zinc-400 mt-0.5">
                                        {strategyOutput ? "Comprehensive launch and market blueprint" : "Awaiting strategy parameter dispatch"}
                                    </CardDescription>
                                </div>

                                {strategyOutput && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownload}
                                            className="border-white/10 text-zinc-300 hover:text-white h-8 text-xs font-mono"
                                        >
                                            <Download className="h-3.5 w-3.5 mr-1.5" />
                                            .md
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleCopy}
                                            className="bg-blue-500 hover:bg-blue-400 text-black font-semibold h-8 text-xs"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 mr-1.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                                                    Copy Blueprint
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="flex-1 p-6 flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                                        >
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                                                <Compass className="w-7 h-7 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-white">Synthesizing Market Architecture</p>
                                                <p className="text-xs text-zinc-500 font-mono">
                                                    Evaluating TAM, unit economics, 30-day GTM roadmap, and defensive moats...
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : strategyOutput ? (
                                        <motion.div
                                            key="output"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="h-full flex flex-col"
                                        >
                                            <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[640px] select-text">
                                                {strategyOutput}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-24 space-y-4 text-zinc-500"
                                        >
                                            <div className="p-4 rounded-full bg-white/5 border border-white/10 w-fit mx-auto">
                                                <Compass className="h-8 w-8 text-blue-400 opacity-60" />
                                            </div>
                                            <div className="space-y-1 max-w-sm mx-auto">
                                                <h3 className="text-base font-semibold text-zinc-300">Architect Idle</h3>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    Complete the 3 configuration steps on the left to deploy the Market Analyst Agent. Your mathematical blueprint will be compiled here.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
