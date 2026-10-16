import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Eye,
    TrendingUp,
    Search,
    Copy,
    Check,
    Loader2,
    Coins,
    Download,
    RotateCcw,
    BarChart3,
    ShieldAlert,
    Target,
    Sliders
} from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

const TARGET_REGIONS = [
    { id: "us", label: "United States (US Tier-1 High Volume)" },
    { id: "uk_eu", label: "United Kingdom & European Union" },
    { id: "tier1_global", label: "Global Tier-1 (US, UK, CA, AU, NZ)" },
    { id: "apac", label: "Asia-Pacific & Southeast Asia (High Growth)" },
    { id: "latam", label: "Latin America (Emerging E-Commerce)" },
    { id: "global", label: "Global / Cross-Border Worldwide" },
]

const PRICE_TIERS = [
    { id: "low_impulse", label: "Low-Ticket Impulse ($20 – $49)", desc: "High volume, fast checkout, heavy reliance on TikTok ads" },
    { id: "sweet_spot", label: "Mid-Ticket Sweet Spot ($50 – $149)", desc: "Optimal balance of CAC, healthy gross margin, and volume" },
    { id: "high_ticket", label: "High-Ticket Premium ($150 – $499)", desc: "Higher AOV, requires strong brand authority and reviews" },
    { id: "luxury", label: "Ultra-Luxury ($500+)", desc: "Exclusive materials, custom concierge, high margin moats" },
]

const SOURCING_MODELS = [
    { id: "private_label", label: "Private Label / Custom Brand Manufacturing" },
    { id: "dropship_arbitrage", label: "High-Speed Dropshipping / Sourcing Arbitrage" },
    { id: "print_on_demand", label: "Custom Print-On-Demand (POD) Apparel/Gear" },
    { id: "hybrid_bundle", label: "Physical Product + Digital Membership Bundle" },
]

const QUICK_SCAN_PRESETS = [
    {
        name: "Smart Home & IoT",
        niche: "Smart Home Automation, Energy-Saving Plugs, Ambient Tech",
        region: "us",
        priceTier: "sweet_spot",
        model: "private_label",
        notes: "Focus on matter-compatible devices, easy retrofit solutions for renters."
    },
    {
        name: "Pet Biohacking",
        niche: "Canine & Feline Longevity Supplements, Orthopedic Beds",
        region: "tier1_global",
        priceTier: "sweet_spot",
        model: "private_label",
        notes: "High recurring LTV, pet parents willing to pay premium for verifiable clinical ingredients."
    },
    {
        name: "Ergonomic EDC",
        niche: "Everyday Carry (EDC) Titanium Tools, Modular Wallets",
        region: "global",
        priceTier: "low_impulse",
        model: "dropship_arbitrage",
        notes: "Focus on viral visual demonstration potential for short-form video ads."
    }
]

interface MarketScanReport {
    id: string
    niche: string
    region: string
    output: string
    timestamp: string
}

export default function MarketIntelligencePage() {
    const { businesses } = useBusiness()
    const activeBusiness = businesses[0]

    // Form inputs
    const [niche, setNiche] = useState("")
    const [targetRegion, setTargetRegion] = useState("tier1_global")
    const [priceTier, setPriceTier] = useState("sweet_spot")
    const [sourcingModel, setSourcingModel] = useState("private_label")
    const [competitorNotes, setCompetitorNotes] = useState("")

    // State
    const [isScanning, setIsScanning] = useState(false)
    const [generatedOutput, setGeneratedOutput] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [scanHistory, setScanHistory] = useState<MarketScanReport[]>([])

    const selectedRegion = TARGET_REGIONS.find((r) => r.id === targetRegion) || TARGET_REGIONS[0]
    const selectedPrice = PRICE_TIERS.find((p) => p.id === priceTier) || PRICE_TIERS[0]
    const selectedModel = SOURCING_MODELS.find((m) => m.id === sourcingModel) || SOURCING_MODELS[0]

    const handleApplyPreset = (preset: typeof QUICK_SCAN_PRESETS[0]) => {
        setNiche(preset.niche)
        setTargetRegion(preset.region)
        setPriceTier(preset.priceTier)
        setSourcingModel(preset.model)
        setCompetitorNotes(preset.notes)
        toast.info(`Applied scan preset: ${preset.name}`)
    }

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!niche.trim()) {
            toast.error("Please enter a target niche or category.")
            return
        }

        if (!activeBusiness?.id) {
            toast.error("No active business entity selected", {
                description: "Please select or register a business entity to execute AI agent directives."
            })
            return
        }

        setIsScanning(true)
        toast.info("Deploying Market Analyst Agent...", {
            description: "Executing deep-dive arbitrage scan via agent-gateway (3 Credits)."
        })

        const structuredPrompt = `Act as an institutional Hedge Fund Equity Analyst and Principal E-Commerce Arbitrage Researcher.
Conduct an exhaustive, data-driven Market Intelligence & Arbitrage Scan for:

- Niche / Category: ${niche.trim()}
- Target Region: ${selectedRegion.label}
- Pricing Sweet Spot: ${selectedPrice.label} (${selectedPrice.desc})
- Sourcing / Fulfillment Model: ${selectedModel.label}
- Specific Focus & Competitor Notes: ${competitorNotes.trim() || "Analyze top incumbents, customer pain points, and current viral product trends."}

Execution Instructions (Generate Complete Modules):
1. MACRO SECTOR METRICS & TREND VELOCITY:
   - Estimated Market Size (TAM/SAM) and 3-Year Projected CAGR.
   - Search Volume Velocity & Seasonality Trajectory.
   - Core Demographic Profile (Income, age bracket, primary purchase trigger).

2. COMPREHENSIVE SWOT MATRIX:
   - Strengths: Inherent market moats, repeat purchase rate potential, viral sharing loops.
   - Weaknesses: Return rate risks, fragility, sizing issues, shipping cost overhead.
   - Opportunities: Untapped sub-niches, weak incumbent marketing, packaging arbitrage.
   - Threats: Ad fatigue, Amazon commoditization, platform policy risks.

3. TOP 3 TRENDING SUB-NICHES & BREAKOUT PRODUCT ANGLES:
   - Provide 3 hyper-targeted sub-niche breakout ideas.
   - For each: Landed COGS vs Target Retail Selling Price, Estimated Gross Margin %, and ideal Unique Selling Proposition (USP).

4. COMPETITOR VULNERABILITY & REVIEW MINING:
   - Analyze the top 3 persistent complaints found in 1-star to 3-star reviews of current bestsellers.
   - How a challenger brand can easily fix these vulnerabilities to capture market share.

5. SOURCING DIFFICULTY & ARBITRAGE BLUEPRINT:
   - Sourcing complexity rating (1-10), recommended manufacturing hubs (e.g. Shenzhen, Vietnam, Mexico, US domestic).
   - Expected initial Minimum Order Quantity (MOQ) and lead times.
   - Overall Viability Score (0-100) with a decisive Final Verdict.

Format the entire output in clean, structured Markdown with clear section headings, comparison tables, and bulleted takeaways.`

        try {
            const { data: edgeData, error: edgeError } = await supabase.functions.invoke("agent-gateway", {
                body: {
                    businessId: activeBusiness.id,
                    agentType: "market_analyst",
                    intent: "market_research",
                    prompt: structuredPrompt,
                    creditsCost: 3,
                }
            })

            if (edgeError) {
                console.error("Market scan error:", edgeError)
                const errorMsg = edgeError.message || ""
                const isInsufficientCredits =
                    errorMsg.includes("402") ||
                    errorMsg.toLowerCase().includes("insufficient") ||
                    (edgeError as any)?.context?.status === 402 ||
                    (edgeError as any)?.status === 402

                if (isInsufficientCredits) {
                    toast.error("Insufficient Credits (402)", {
                        description: "You need at least 3 credits to run a deep Market Intelligence scan. Please top up your treasury balance."
                    })
                    return
                }

                toast.error("Market Scan Failed", {
                    description: errorMsg || "Agent gateway encountered an unexpected inference error."
                })
                return
            }

            const outputText = edgeData?.output || edgeData?.result || "Market research analysis completed successfully."
            setGeneratedOutput(outputText)

            // Save to session history
            const newReport: MarketScanReport = {
                id: crypto.randomUUID(),
                niche: niche.trim(),
                region: selectedRegion.label.split("(")[0].trim(),
                output: outputText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
            setScanHistory((prev) => [newReport, ...prev])

            toast.success("Market Intelligence Dossier Compiled!", {
                description: "3 credits settled via atomic ledger."
            })

        } catch (err: any) {
            console.error("Fatal error invoking agent-gateway:", err)
            toast.error("Inference Error: " + (err.message || "Unknown error"))
        } finally {
            setIsScanning(false)
        }
    }

    const handleCopy = () => {
        if (!generatedOutput) return
        navigator.clipboard.writeText(generatedOutput)
        setCopied(true)
        toast.success("Copied report to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        if (!generatedOutput) return
        const blob = new Blob([generatedOutput], { type: "text/markdown" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `market-intelligence-${niche.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${Date.now()}.md`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Downloaded report Markdown file.")
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-black">
            <title>Market Intelligence | AURA Increase</title>
            <meta name="description" content="AI-powered trend detection, SWOT analysis, and e-commerce arbitrage discovery" />

            <Navbar />

            <main className="pt-28 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Header / Hero */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                            <Eye className="h-3.5 w-3.5 text-purple-400" />
                            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">The Oracle • Market Analyst Agent</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                            Predatory Market Intelligence
                        </h1>
                        <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-2xl">
                            Scan product categories, uncover high-margin sub-niches, calculate unit economics, and exploit competitor weaknesses before the market catches on.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2.5">
                            <Coins className="h-4 w-4 text-purple-400" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-mono text-zinc-500">Cost Per Scan</div>
                                <div className="text-xs font-bold font-mono text-zinc-200">3 Credits</div>
                            </div>
                        </div>

                        {activeBusiness && (
                            <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-mono text-zinc-500">Active Entity</div>
                                    <div className="text-xs font-bold font-mono text-zinc-200 truncate max-w-[120px]">
                                        {activeBusiness.name}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT PANEL: Form / Directives */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl">
                            <CardHeader className="pb-4 border-b border-white/5">
                                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                    <Sliders className="h-4 w-4 text-purple-400" />
                                    Scan Scope & Parameters
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-400">
                                    Define the niche, target geography, and economics for the Oracle to evaluate.
                                </CardDescription>

                                {/* Quick Presets */}
                                <div className="pt-3">
                                    <div className="text-[10px] font-mono uppercase text-zinc-500 mb-2">Scan Blueprints:</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_SCAN_PRESETS.map((p) => (
                                            <button
                                                key={p.name}
                                                type="button"
                                                onClick={() => handleApplyPreset(p)}
                                                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-purple-400 transition-colors"
                                            >
                                                + {p.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-5 space-y-4">
                                <form onSubmit={handleScan} className="space-y-4">
                                    {/* Niche / Category */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300 flex items-center justify-between">
                                            <span>Target Niche or Category</span>
                                            <span className="text-[10px] text-purple-400 font-mono">Mandatory</span>
                                        </label>
                                        <Input
                                            placeholder="e.g., Smart Home Automation, Canine Supplements, Minimalist EDC"
                                            value={niche}
                                            onChange={(e) => setNiche(e.target.value)}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-purple-500"
                                            required
                                        />
                                    </div>

                                    {/* Target Region */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Target Market Geography
                                        </label>
                                        <Select value={targetRegion} onValueChange={setTargetRegion}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Select Target Market" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {TARGET_REGIONS.map((r) => (
                                                    <SelectItem key={r.id} value={r.id} className="text-xs">
                                                        {r.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price Tier */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Retail Pricing Sweet Spot
                                        </label>
                                        <Select value={priceTier} onValueChange={setPriceTier}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Select Price Range" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {PRICE_TIERS.map((p) => (
                                                    <SelectItem key={p.id} value={p.id} className="text-xs">
                                                        <div>
                                                            <div className="font-semibold">{p.label}</div>
                                                            <div className="text-[10px] text-zinc-400 truncate max-w-xs">{p.desc}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sourcing / Business Model */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Fulfillment & Sourcing Vector
                                        </label>
                                        <Select value={sourcingModel} onValueChange={setSourcingModel}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Select Sourcing Strategy" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {SOURCING_MODELS.map((m) => (
                                                    <SelectItem key={m.id} value={m.id} className="text-xs">
                                                        {m.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Competitor / Specific Angle */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Known Competitors / Specific Inquiries
                                            </label>
                                            <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
                                        </div>
                                        <Textarea
                                            placeholder="Mention specific rival brands, Amazon bestsellers, or angle hypotheses you want audited..."
                                            value={competitorNotes}
                                            onChange={(e) => setCompetitorNotes(e.target.value)}
                                            rows={3}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-purple-500 resize-none"
                                        />
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        type="submit"
                                        disabled={isScanning || !niche.trim()}
                                        className="w-full bg-purple-500 hover:bg-purple-400 text-black font-semibold h-11 text-sm shadow-lg shadow-purple-500/20 transition-all mt-2"
                                    >
                                        {isScanning ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Scanning Market & Formulating Dossier...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4 mr-2" />
                                                Run Market Intelligence Scan (3 Credits)
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Scan History Mini-List */}
                        {scanHistory.length > 0 && (
                            <Card className="bg-zinc-950/40 border-white/5">
                                <CardHeader className="py-3 px-4 border-b border-white/5">
                                    <CardTitle className="text-xs font-mono uppercase text-zinc-400 flex items-center justify-between">
                                        <span>Session Dossiers ({scanHistory.length})</span>
                                        <RotateCcw className="h-3 w-3 text-zinc-500" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                    {scanHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setGeneratedOutput(item.output)}
                                            className="p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors flex items-center justify-between group"
                                        >
                                            <div className="truncate pr-2">
                                                <div className="font-semibold text-zinc-200 truncate group-hover:text-purple-400">
                                                    {item.niche}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-mono">{item.region}</div>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-600 shrink-0">{item.timestamp}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* RIGHT PANEL: Live Output Terminal */}
                    <div className="lg:col-span-7">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl min-h-[580px] flex flex-col">
                            <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-purple-400" />
                                        The Oracle Intelligence Terminal
                                    </CardTitle>
                                    <CardDescription className="text-xs font-mono text-zinc-400 mt-0.5">
                                        {generatedOutput ? "Market Dossier compiled and verified" : "Awaiting scan parameters"}
                                    </CardDescription>
                                </div>

                                {generatedOutput && (
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
                                            className="bg-purple-500 hover:bg-purple-400 text-black font-semibold h-8 text-xs"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 mr-1.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                                                    Copy to Clipboard
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="flex-1 p-6 flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    {isScanning ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                                        >
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                                                <Eye className="w-7 h-7 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-white">Synthesizing Market Intelligence Dossier</p>
                                                <p className="text-xs text-zinc-500 font-mono">
                                                    Calculating SWOT vectors, margin spreads, and competitor flaws via agent-gateway...
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : generatedOutput ? (
                                        <motion.div
                                            key="output"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="h-full flex flex-col"
                                        >
                                            <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[620px] select-text">
                                                {generatedOutput}
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
                                                <Target className="h-8 w-8 text-purple-400 opacity-60" />
                                            </div>
                                            <div className="space-y-1 max-w-sm mx-auto">
                                                <h3 className="text-base font-semibold text-zinc-300">Scanner Ready</h3>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    Enter any category or product concept on the left. The Oracle will generate a complete SWOT audit, unit economics breakdown, and breakout sub-niche plan.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Analytical Moats Section */}
                <div className="mt-20 border-t border-white/10 pt-12">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Institutional Grade Arbitrage Intelligence</h2>
                        <p className="text-sm text-zinc-400 mt-1">Don't guess which products will sell. Know the exact math before allocating capital.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Trend Acceleration Signals</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Pinpoint categories experiencing exponential search velocity and social engagement before wholesale prices inflate.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Landed Margin Modeling</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Automatically calculate true landed cost: manufacturing, air/sea freight, merchant interchange, and target ad CAC.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Negative Review Arbitrage</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Uncover exact design and customer service flaws plaguing incumbent category leaders and eliminate them in your offer.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
