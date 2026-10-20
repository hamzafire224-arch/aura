import { useState, useMemo } from "react"
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
    Compass,
    TrendingUp,
    DollarSign,
    Target,
    ShieldAlert,
    CheckCircle2,
    Calendar,
    Layers,
    Code,
    LayoutGrid
} from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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

interface BusinessBlueprint {
    market_feasibility: {
        score: number
        rationale: string
        tam: string
        som: string
    }
    unit_economics: {
        target_cogs: string
        retail_price: string
        gross_margin_percent: number | string
    }
    gtm_sprint: Array<{
        week: number | string
        action: string
    }>
    financials: {
        target_cac: string
        target_ltv: string
        break_even_units: number | string
    }
    risks: Array<{
        threat: string
        mitigation: string
    }>
}

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
    const [generatedOutput, setGeneratedOutput] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [viewMode, setViewMode] = useState<"visual" | "raw">("visual")

    const selectedIndustry = INDUSTRIES.find((i) => i.id === industry) || INDUSTRIES[0]
    const selectedCapital = CAPITAL_TIERS.find((c) => c.id === capitalTier) || CAPITAL_TIERS[1]

    // Computed structured blueprint from streaming JSON
    const parsedBlueprint = useMemo<BusinessBlueprint | null>(() => {
        if (!generatedOutput || !generatedOutput.trim()) return null
        try {
            let cleaned = generatedOutput.trim()
            // Clean potential markdown fences if present
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "")
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "")
            }
            const parsed = JSON.parse(cleaned)
            if (parsed && typeof parsed === "object" && (parsed.market_feasibility || parsed.unit_economics)) {
                return parsed as BusinessBlueprint
            }
            return null
        } catch {
            return null
        }
    }, [generatedOutput])

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

        // Verify active Supabase auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !session?.access_token) {
            toast.error("Authentication required", {
                description: "Please log in to execute AI agent directives."
            })
            return
        }

        setIsGenerating(true)
        setGeneratedOutput("") // Reset terminal for incoming stream
        setViewMode("visual")

        toast.info("Mobilizing Market Analyst Agent...", {
            description: "Architecting structured venture blueprint with real-time streaming (2 Credits)."
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

You must respond ONLY with a raw, valid JSON object matching the following structure. Do not include markdown formatting or code blocks.

{
  "market_feasibility": { "score": 85, "rationale": "Detailed strategic evaluation...", "tam": "$X.X Billion...", "som": "$XX Million..." },
  "unit_economics": { "target_cogs": "$XX.XX", "retail_price": "$XX.XX", "gross_margin_percent": 75 },
  "gtm_sprint": [
    { "week": 1, "action": "Digital asset build, store configuration, and tracking setup." },
    { "week": 2, "action": "Creative asset production (ad hooks, scripts, angle testing)." },
    { "week": 3, "action": "Channel launch & traffic testing ($20-$50/day ad tests)." },
    { "week": 4, "action": "Optimization, conversion rate tuning, and scale triggers." }
  ],
  "financials": { "target_cac": "$XX.XX", "target_ltv": "$XXX.XX", "break_even_units": 100 },
  "risks": [
    { "threat": "Top primary risk factor...", "mitigation": "Concrete defensive action..." },
    { "threat": "Secondary risk factor...", "mitigation": "Concrete defensive action..." }
  ]
}`

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        try {
            const response = await fetch(`${supabaseUrl}/functions/v1/agent-gateway`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`,
                    "apikey": supabaseAnonKey,
                },
                body: JSON.stringify({
                    businessId: activeBusiness.id,
                    agentType: "market_analyst",
                    intent: "business_strategy",
                    prompt: architectPrompt,
                    creditsCost: 2,
                    stream: true,
                }),
            })

            // Strict error verification before reading SSE stream
            if (!response.ok) {
                let errorData: any = {}
                try {
                    errorData = await response.json()
                } catch {
                    errorData = { error: response.statusText }
                }

                if (response.status === 402 || errorData.code === "INSUFFICIENT_CREDITS") {
                    toast.error("Insufficient Credits (402)", {
                        description: errorData.error || "You need at least 2 credits to architect a business strategy blueprint. Please top up your treasury balance."
                    })
                    setGeneratedOutput(null)
                    return
                }

                if (response.status === 401) {
                    toast.error("Unauthorized (401)", {
                        description: "Your session has expired. Please log in again."
                    })
                    setGeneratedOutput(null)
                    return
                }

                toast.error("Strategy Architecture Failed", {
                    description: errorData.error || `Agent gateway returned status ${response.status}.`
                })
                setGeneratedOutput(null)
                return
            }

            if (!response.body) {
                throw new Error("No response stream received from agent gateway.")
            }

            // Real-Time SSE Stream Reader
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let accumulatedText = ""
            let buffer = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split("\n")
                buffer = lines.pop() ?? ""

                for (const line of lines) {
                    const trimmed = line.trim()
                    if (!trimmed || trimmed.startsWith(":")) continue

                    if (trimmed === "data: [DONE]") {
                        continue
                    }

                    if (trimmed.startsWith("data: ")) {
                        const dataContent = trimmed.slice(6)
                        try {
                            const parsed = JSON.parse(dataContent)
                            if (parsed.error) {
                                toast.error("Stream Error", { description: parsed.error })
                                continue
                            }
                            const token = parsed.token ?? parsed.text ?? parsed.choices?.[0]?.delta?.content
                            if (token) {
                                accumulatedText += token
                                setGeneratedOutput(accumulatedText)
                            }
                        } catch {
                            accumulatedText += dataContent
                            setGeneratedOutput(accumulatedText)
                        }
                    }
                }
            }

            // Flush remaining buffer content
            if (buffer.trim().startsWith("data: ")) {
                const trimmed = buffer.trim()
                if (trimmed !== "data: [DONE]") {
                    const dataContent = trimmed.slice(6)
                    try {
                        const parsed = JSON.parse(dataContent)
                        const token = parsed.token ?? parsed.text ?? parsed.choices?.[0]?.delta?.content
                        if (token) {
                            accumulatedText += token
                            setGeneratedOutput(accumulatedText)
                        }
                    } catch {
                        accumulatedText += dataContent
                        setGeneratedOutput(accumulatedText)
                    }
                }
            }

            if (accumulatedText.trim()) {
                toast.success("Business Blueprint Synthesized!", {
                    description: "2 credits deducted via atomic ledger."
                })
            }

        } catch (err: any) {
            console.error("Fatal error generating business strategy:", err)
            toast.error("Generation Error: " + (err.message || "Unknown error"))
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = () => {
        if (!generatedOutput) return
        navigator.clipboard.writeText(generatedOutput)
        setCopied(true)
        toast.success("Complete business plan copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        if (!generatedOutput) return
        const isJson = Boolean(parsedBlueprint)
        const blob = new Blob([generatedOutput], { 
            type: isJson ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8" 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${niche.toLowerCase().replace(/[^a-z0-9]/g, "-")}-business-blueprint.${isJson ? "json" : "md"}`
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
                            Transform an abstract idea into an institutional-grade, mathematical launch blueprint with real-time visual streaming.
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

                    {/* RIGHT PANEL: Live Strategy Blueprint Output & Structured Visual Cards */}
                    <div className="lg:col-span-7">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl min-h-[620px] flex flex-col">
                            <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-blue-400" />
                                        Venture Architecture Dossier
                                    </CardTitle>
                                    <CardDescription className="text-xs font-mono text-zinc-400 mt-0.5">
                                        {isGenerating
                                            ? "Streaming live structured JSON blueprint..."
                                            : parsedBlueprint
                                            ? "Institutional structured blueprint compiled successfully"
                                            : generatedOutput
                                            ? "Raw blueprint received"
                                            : "Awaiting strategy parameter dispatch"}
                                    </CardDescription>
                                </div>

                                {generatedOutput && (
                                    <div className="flex items-center gap-2">
                                        {parsedBlueprint && (
                                            <div className="flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5 mr-1">
                                                <button
                                                    onClick={() => setViewMode("visual")}
                                                    className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-all ${
                                                        viewMode === "visual"
                                                            ? "bg-blue-500/20 text-blue-400 font-semibold"
                                                            : "text-zinc-400 hover:text-white"
                                                    }`}
                                                >
                                                    <LayoutGrid className="w-3 h-3" />
                                                    Cards
                                                </button>
                                                <button
                                                    onClick={() => setViewMode("raw")}
                                                    className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-all ${
                                                        viewMode === "raw"
                                                            ? "bg-blue-500/20 text-blue-400 font-semibold"
                                                            : "text-zinc-400 hover:text-white"
                                                    }`}
                                                >
                                                    <Code className="w-3 h-3" />
                                                    JSON
                                                </button>
                                            </div>
                                        )}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownload}
                                            className="border-white/10 text-zinc-300 hover:text-white h-8 text-xs font-mono"
                                        >
                                            <Download className="h-3.5 w-3.5 mr-1.5" />
                                            {parsedBlueprint ? ".json" : ".md"}
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
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="flex-1 p-6 flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    {isGenerating && !generatedOutput ? (
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
                                                    Connecting to neural gateway and establishing SSE stream...
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : parsedBlueprint && viewMode === "visual" ? (
                                        <motion.div
                                            key="visual-cards"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6 overflow-y-auto max-h-[640px] pr-1 select-text"
                                        >
                                            {/* CARD 1: Market Feasibility Score & Sizing */}
                                            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-950/30 via-zinc-950 to-black border border-blue-500/20 shadow-xl space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div>
                                                        <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                                                            <TrendingUp className="w-3.5 h-3.5" />
                                                            Market Feasibility Score
                                                        </div>
                                                        <p className="text-xs text-zinc-400 mt-0.5">
                                                            Institutional venture viability rating
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-3xl font-extrabold text-white tracking-tight">
                                                            {parsedBlueprint.market_feasibility?.score ?? 85}
                                                            <span className="text-xs font-mono text-zinc-500 ml-1">/ 100</span>
                                                        </div>
                                                        <Badge className={`${
                                                            (parsedBlueprint.market_feasibility?.score ?? 85) >= 80 
                                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                                                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                                        } font-mono text-[10px]`}>
                                                            {(parsedBlueprint.market_feasibility?.score ?? 85) >= 80 ? "High Feasibility" : "Moderate Risk"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <Progress 
                                                    value={parsedBlueprint.market_feasibility?.score ?? 85} 
                                                    className="h-2.5 bg-white/5 border border-white/5" 
                                                />

                                                {parsedBlueprint.market_feasibility?.rationale && (
                                                    <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                                                        {parsedBlueprint.market_feasibility.rationale}
                                                    </p>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                    <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                                        <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                                                            <Target className="w-3 h-3 text-blue-400" />
                                                            Total Addressable Market (TAM)
                                                        </div>
                                                        <div className="text-sm font-bold text-white mt-1">
                                                            {parsedBlueprint.market_feasibility?.tam || "N/A"}
                                                        </div>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                                        <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                                                            <Target className="w-3 h-3 text-cyan-400" />
                                                            Serviceable Obtainable Market (SOM)
                                                        </div>
                                                        <div className="text-sm font-bold text-cyan-400 mt-1">
                                                            {parsedBlueprint.market_feasibility?.som || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CARD 2: Unit Economics Side-by-Side */}
                                            <div className="p-5 rounded-xl bg-zinc-950/80 border border-white/10 space-y-3">
                                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-emerald-400" />
                                                        Unit Economics & Margin Architecture
                                                    </div>
                                                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                                                        {parsedBlueprint.unit_economics?.gross_margin_percent}% Gross Margin
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                                    <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 text-center">
                                                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Target COGS</span>
                                                        <span className="text-lg font-bold text-zinc-200 mt-0.5 block font-mono">
                                                            {parsedBlueprint.unit_economics?.target_cogs || "N/A"}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-600 block mt-0.5">Manufacturing & fulfillment</span>
                                                    </div>

                                                    <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 text-center">
                                                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Retail MSRP</span>
                                                        <span className="text-lg font-bold text-white mt-0.5 block font-mono">
                                                            {parsedBlueprint.unit_economics?.retail_price || "N/A"}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-600 block mt-0.5">Recommended selling price</span>
                                                    </div>

                                                    <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-center">
                                                        <span className="text-[10px] font-mono text-emerald-400 uppercase block">Margin Spread</span>
                                                        <span className="text-lg font-bold text-emerald-400 mt-0.5 block font-mono">
                                                            {parsedBlueprint.unit_economics?.gross_margin_percent}%
                                                        </span>
                                                        <span className="text-[10px] text-emerald-600 block mt-0.5">Defensible cash flow</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CARD 3: 30-Day Go-To-Market Sprint Roadmap */}
                                            {Array.isArray(parsedBlueprint.gtm_sprint) && parsedBlueprint.gtm_sprint.length > 0 && (
                                                <div className="p-5 rounded-xl bg-zinc-950/80 border border-white/10 space-y-4">
                                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                        <div className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-blue-400" />
                                                            30-Day Go-To-Market (GTM) Sprint
                                                        </div>
                                                        <span className="text-[11px] font-mono text-zinc-500">4-Week Launch Sequence</span>
                                                    </div>

                                                    <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-500/20">
                                                        {parsedBlueprint.gtm_sprint.map((sprint, idx) => (
                                                            <div key={idx} className="relative flex items-start gap-3 group">
                                                                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-950 border border-blue-400 flex items-center justify-center">
                                                                    <Check className="w-2.5 h-2.5 text-blue-400" />
                                                                </div>
                                                                <div className="bg-black/40 border border-white/5 p-3 rounded-lg flex-1 hover:border-blue-500/30 transition-colors">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400 font-mono py-0">
                                                                            Week {sprint.week}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                                                                        {sprint.action}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* CARD 4: Financial Metric Targets */}
                                            {parsedBlueprint.financials && (
                                                <div className="p-5 rounded-xl bg-zinc-950/80 border border-white/10 space-y-3">
                                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                        <div className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                                                            <Layers className="w-4 h-4 text-cyan-400" />
                                                            Financial Metric Targets
                                                        </div>
                                                        <span className="text-[11px] font-mono text-zinc-500">Unit Economics Benchmarks</span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                                        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                                            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Target CAC</span>
                                                            <span className="text-base font-bold text-white mt-1 block font-mono">
                                                                {parsedBlueprint.financials.target_cac || "N/A"}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500">Max acquisition cost</span>
                                                        </div>
                                                        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                                            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Target LTV</span>
                                                            <span className="text-base font-bold text-cyan-400 mt-1 block font-mono">
                                                                {parsedBlueprint.financials.target_ltv || "N/A"}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500">Projected customer value</span>
                                                        </div>
                                                        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                                            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Monthly Break-Even</span>
                                                            <span className="text-base font-bold text-emerald-400 mt-1 block font-mono">
                                                                {parsedBlueprint.financials.break_even_units} Units
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500">Fixed-overhead hurdle</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* CARD 5: Risk Mitigation & Moats */}
                                            {Array.isArray(parsedBlueprint.risks) && parsedBlueprint.risks.length > 0 && (
                                                <div className="p-5 rounded-xl bg-zinc-950/80 border border-white/10 space-y-3">
                                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                        <div className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                                                            <ShieldAlert className="w-4 h-4 text-amber-400" />
                                                            Risk Mitigation & Defensive Moats
                                                        </div>
                                                        <span className="text-[11px] font-mono text-zinc-500">{parsedBlueprint.risks.length} Vectors Scanned</span>
                                                    </div>

                                                    <div className="space-y-2.5 pt-1">
                                                        {parsedBlueprint.risks.map((risk, idx) => (
                                                            <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                                                                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                                    <span>Threat: {risk.threat}</span>
                                                                </div>
                                                                <div className="flex items-start gap-2 text-xs text-zinc-300 pl-3.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                                                    <span className="font-mono text-[11px] leading-relaxed">
                                                                        Mitigation: {risk.mitigation}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : generatedOutput ? (
                                        <motion.div
                                            key="raw-output"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="h-full flex flex-col"
                                        >
                                            {isGenerating && (
                                                <div className="mb-2 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono flex items-center gap-2">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    <span>Streaming structured JSON tokens... (Visual cards render on stream completion)</span>
                                                </div>
                                            )}
                                            <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[640px] select-text">
                                                {generatedOutput}
                                                {isGenerating && (
                                                    <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle" />
                                                )}
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
                                                    Complete the 3 configuration steps on the left to deploy the Market Analyst Agent. Your mathematical blueprint will be compiled into visual cards here in real-time.
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
