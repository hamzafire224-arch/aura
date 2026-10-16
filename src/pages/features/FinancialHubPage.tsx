import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BarChart3,
    DollarSign,
    LineChart,
    Calculator,
    Copy,
    Check,
    Loader2,
    Coins,
    Download,
    RotateCcw,
    Percent,
    Sliders
} from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useBusiness } from "@/contexts/BusinessContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const QUICK_FINANCIAL_MODELS = [
    {
        name: "Lean Bootstrapped",
        aov: "45",
        dailySpend: "50",
        cvr: "2.8",
        cogs: "12",
        cpc: "0.85",
        overhead: "150",
        desc: "Low-ticket impulse physical product with lean organic testing."
    },
    {
        name: "Scale DTC Brand",
        aov: "85",
        dailySpend: "250",
        cvr: "2.4",
        cogs: "24",
        cpc: "1.20",
        overhead: "450",
        desc: "Core growth-stage DTC brand investing in Meta & Google PPC."
    },
    {
        name: "High-Ticket E-com",
        aov: "220",
        dailySpend: "600",
        cvr: "1.6",
        cogs: "65",
        cpc: "2.10",
        overhead: "1200",
        desc: "Premium luxury or tech hardware with high gross margins."
    }
]

interface ForecastHistoryItem {
    id: string
    title: string
    aov: string
    spend: string
    output: string
    timestamp: string
}

export default function FinancialHubPage() {
    const { businesses } = useBusiness()
    const activeBusiness = businesses[0]

    // Form inputs
    const [aov, setAov] = useState("85")
    const [dailyAdSpend, setDailyAdSpend] = useState("250")
    const [conversionRate, setConversionRate] = useState("2.4")
    const [cogs, setCogs] = useState("24")
    const [cpc, setCpc] = useState("1.20")
    const [monthlyOverhead, setMonthlyOverhead] = useState("450")
    const [additionalNotes, setAdditionalNotes] = useState("")

    // State
    const [isForecasting, setIsForecasting] = useState(false)
    const [generatedOutput, setGeneratedOutput] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [forecastHistory, setForecastHistory] = useState<ForecastHistoryItem[]>([])

    // Live Unit Economics Calculations for quick preview
    const calculatedMetrics = useMemo(() => {
        const numAov = parseFloat(aov) || 0
        const numSpend = parseFloat(dailyAdSpend) || 0
        const numCvr = parseFloat(conversionRate) || 0
        const numCpc = parseFloat(cpc) || 1
        const numCogs = parseFloat(cogs) || 0

        const monthlySpend = numSpend * 30
        const monthlyVisitors = numCpc > 0 ? (monthlySpend / numCpc) : 0
        const monthlyOrders = Math.round(monthlyVisitors * (numCvr / 100))
        const grossRevenue = monthlyOrders * numAov
        const grossMarginPercent = numAov > 0 ? Math.round(((numAov - numCogs) / numAov) * 100) : 0
        const breakEvenRoas = (numAov - numCogs) > 0 ? (numAov / (numAov - numCogs)).toFixed(2) : "N/A"

        return {
            monthlySpend,
            monthlyOrders,
            grossRevenue,
            grossMarginPercent,
            breakEvenRoas
        }
    }, [aov, dailyAdSpend, conversionRate, cogs, cpc])

    const handleApplyModel = (model: typeof QUICK_FINANCIAL_MODELS[0]) => {
        setAov(model.aov)
        setDailyAdSpend(model.dailySpend)
        setConversionRate(model.cvr)
        setCogs(model.cogs)
        setCpc(model.cpc)
        setMonthlyOverhead(model.overhead)
        toast.info(`Applied financial model: ${model.name}`)
    }

    const handleForecast = async (e: React.FormEvent) => {
        e.preventDefault()

        const numAov = parseFloat(aov)
        const numSpend = parseFloat(dailyAdSpend)
        const numCvr = parseFloat(conversionRate)
        const numCogs = parseFloat(cogs)

        if (isNaN(numAov) || numAov <= 0) {
            toast.error("Please enter a valid Average Order Value (AOV).")
            return
        }

        if (isNaN(numSpend) || numSpend < 0) {
            toast.error("Please enter a valid Daily Ad Spend.")
            return
        }

        if (isNaN(numCvr) || numCvr <= 0) {
            toast.error("Please enter a valid Expected Conversion Rate (%).")
            return
        }

        if (isNaN(numCogs) || numCogs < 0) {
            toast.error("Please enter a valid Cost of Goods Sold (COGS).")
            return
        }

        if (!activeBusiness?.id) {
            toast.error("No active business entity selected", {
                description: "Please select or register a business entity to execute AI agent directives."
            })
            return
        }

        setIsForecasting(true)
        toast.info("Deploying Virtual CFO Agent...", {
            description: "Executing 30/90-day profit modeling via agent-gateway (1 Credit)."
        })

        const structuredPrompt = `Act as an institutional Chief Financial Officer (CFO) and E-Commerce Unit Economics Specialist.
Conduct a rigorous 30-Day and 90-Day Financial Forecast, Break-Even ROAS Calculation, and Cash Flow Risk Audit for:

- Average Order Value (AOV): $${numAov}
- Target Daily Ad Spend: $${numSpend} ($${numSpend * 30}/month)
- Estimated Cost Per Click (CPC): $${parseFloat(cpc) || 1.20}
- Store Conversion Rate (CVR): ${numCvr}%
- Cost of Goods Sold (COGS): $${numCogs} per unit
- Monthly Fixed Overhead (SaaS, rent, payroll): $${parseFloat(monthlyOverhead) || 0}
- Context & Additional Constraints: ${additionalNotes.trim() || "Standard payment processor fee structure (2.9% + $0.30 per order)."}

Required Financial Modules:
1. UNIT ECONOMICS & BREAK-EVEN ROAS MATRIX:
   - Contribution Margin per unit ($ and %).
   - True Break-Even ROAS (Formula and calculated minimum threshold).
   - Target Blended ROAS for a healthy 20%+ Net EBITDA margin.
   - Max allowable Customer Acquisition Cost (CAC) before losing money.

2. 30-DAY PRO FORMA PROFIT & LOSS (P&L):
   - Projected Total Paid Traffic & Total Orders.
   - Gross Revenue ($).
   - Cost of Goods Sold (COGS).
   - Total Marketing Ad Spend.
   - Merchant Processing Fees (2.9% + $0.30/order).
   - Fixed Overhead Allocation.
   - Projected Net Profit ($) and Net Profit Margin (%).

3. 90-DAY SCALING SCENARIOS (Provide 3 Comparative Trajectories):
   - Conservative (Ad fatigue, CPC rises 15%, flat conversion).
   - Base Case (Stable ROAS, 10% repeat customer rate).
   - Aggressive / Scaled (20% repeat purchase rate, $500/day ad spend, bulk supplier discounts).

4. CFO CASH FLOW RISK AUDIT & SCALE BOTTLENECKS:
   - Working Capital Gap: Cash needed upfront for reorders before merchant payouts settle.
   - Payment processor reserve hold risks (Shopify/Stripe rolling reserves).
   - Top 3 actionable recommendations to immediately boost contribution margin by 5-8%.

Format your entire output in clean, boardroom-ready Markdown with structured financial tables, mathematical formulas, and bulleted risk warnings.`

        try {
            const { data: edgeData, error: edgeError } = await supabase.functions.invoke("agent-gateway", {
                body: {
                    businessId: activeBusiness.id,
                    agentType: "market_analyst",
                    intent: "financial_forecast",
                    prompt: structuredPrompt,
                    creditsCost: 1,
                }
            })

            if (edgeError) {
                console.error("Financial forecast error:", edgeError)
                const errorMsg = edgeError.message || ""
                const isInsufficientCredits =
                    errorMsg.includes("402") ||
                    errorMsg.toLowerCase().includes("insufficient") ||
                    (edgeError as any)?.context?.status === 402 ||
                    (edgeError as any)?.status === 402

                if (isInsufficientCredits) {
                    toast.error("Insufficient Credits (402)", {
                        description: "You need at least 1 credit to generate a financial forecast. Please top up your treasury balance."
                    })
                    return
                }

                toast.error("Forecast Failed", {
                    description: errorMsg || "Agent gateway encountered an unexpected inference error."
                })
                return
            }

            const outputText = edgeData?.output || edgeData?.result || "Financial forecast compiled successfully."
            setGeneratedOutput(outputText)

            // Save to session history
            const newHistoryItem: ForecastHistoryItem = {
                id: crypto.randomUUID(),
                title: `AOV $${numAov} • Spend $${numSpend}/d`,
                aov: `$${numAov}`,
                spend: `$${numSpend}/day`,
                output: outputText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
            setForecastHistory((prev) => [newHistoryItem, ...prev])

            toast.success("Financial Model & Forecast Compiled!", {
                description: "1 credit settled via atomic ledger."
            })

        } catch (err: any) {
            console.error("Fatal error invoking agent-gateway:", err)
            toast.error("Inference Error: " + (err.message || "Unknown error"))
        } finally {
            setIsForecasting(false)
        }
    }

    const handleCopy = () => {
        if (!generatedOutput) return
        navigator.clipboard.writeText(generatedOutput)
        setCopied(true)
        toast.success("Copied financial forecast to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        if (!generatedOutput) return
        const blob = new Blob([generatedOutput], { type: "text/markdown" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `financial-forecast-aov${aov}-spend${dailyAdSpend}-${Date.now()}.md`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Downloaded financial forecast Markdown file.")
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
            <title>Financial Hub & Profit Forecaster | AURA Increase</title>
            <meta name="description" content="AI-powered financial modeling, 30/90-day profit forecasting, and unit economics validation" />

            <Navbar />

            <main className="pt-28 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Header / Hero */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                            <Calculator className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Virtual CFO • AI Profit Forecaster</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                            Institutional Profit Forecaster
                        </h1>
                        <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-2xl">
                            Simulate unit economics, compute exact break-even ROAS thresholds, and run 30 & 90-day stress-tests before allocating ad capital.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2.5">
                            <Coins className="h-4 w-4 text-emerald-400" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-mono text-zinc-500">Cost Per Forecast</div>
                                <div className="text-xs font-bold font-mono text-zinc-200">1 Credit</div>
                            </div>
                        </div>

                        {activeBusiness && (
                            <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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

                {/* Instant KPI Preview Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-zinc-500">Est. Monthly Spend</div>
                        <div className="text-xl font-bold font-mono text-white mt-1">
                            ${calculatedMetrics.monthlySpend.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-zinc-500">Est. Monthly Orders</div>
                        <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                            ~{calculatedMetrics.monthlyOrders.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-zinc-500">Gross Margin</div>
                        <div className="text-xl font-bold font-mono text-white mt-1">
                            {calculatedMetrics.grossMarginPercent}%
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5">
                        <div className="text-[10px] font-mono uppercase text-zinc-500">Estimated Break-Even ROAS</div>
                        <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                            {calculatedMetrics.breakEvenRoas}x
                        </div>
                    </div>
                </div>

                {/* Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT PANEL: Form / Directives */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl">
                            <CardHeader className="pb-4 border-b border-white/5">
                                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                    <Sliders className="h-4 w-4 text-emerald-400" />
                                    Unit Economics Parameters
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-400">
                                    Provide baseline economics to calculate cash flow projections.
                                </CardDescription>

                                {/* Quick Presets */}
                                <div className="pt-3">
                                    <div className="text-[10px] font-mono uppercase text-zinc-500 mb-2">Model Archetypes:</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_FINANCIAL_MODELS.map((m) => (
                                            <button
                                                key={m.name}
                                                type="button"
                                                onClick={() => handleApplyModel(m)}
                                                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-emerald-400 transition-colors"
                                            >
                                                + {m.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-5 space-y-4">
                                <form onSubmit={handleForecast} className="space-y-4">
                                    {/* AOV and Daily Ad Spend */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Average Order Value ($)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g., 85"
                                                value={aov}
                                                onChange={(e) => setAov(e.target.value)}
                                                className="bg-black/50 border-white/10 text-sm focus-visible:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Daily Ad Spend ($)
                                            </label>
                                            <Input
                                                type="number"
                                                step="1"
                                                placeholder="e.g., 250"
                                                value={dailyAdSpend}
                                                onChange={(e) => setDailyAdSpend(e.target.value)}
                                                className="bg-black/50 border-white/10 text-sm focus-visible:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Conversion Rate & COGS */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Conversion Rate (%)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g., 2.4"
                                                value={conversionRate}
                                                onChange={(e) => setConversionRate(e.target.value)}
                                                className="bg-black/50 border-white/10 text-sm focus-visible:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                COGS Per Order ($)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g., 24"
                                                value={cogs}
                                                onChange={(e) => setCogs(e.target.value)}
                                                className="bg-black/50 border-white/10 text-sm focus-visible:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* CPC & Monthly Overhead */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Avg. CPC ($)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g., 1.20"
                                                value={cpc}
                                                onChange={(e) => setCpc(e.target.value)}
                                                className="bg-black/50 border-white/10 text-sm focus-visible:ring-emerald-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Fixed Overhead / Mo ($)
                                            </label>
                                            <Input
                                                type="number"
                                                step="1"
                                                placeholder="e.g., 450"
                                                value={monthlyOverhead}
                                                onChange={(e) => setMonthlyOverhead(e.target.value)}
                                                className="bg-black/50 border-white/10 text-sm focus-visible:ring-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Specific Assumptions / Notes */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Custom Nuances & Constraints
                                            </label>
                                            <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
                                        </div>
                                        <Textarea
                                            placeholder="Include return rate expectations (e.g. 5%), shipping fees, supplier terms (30-day net), or customer LTV expectations..."
                                            value={additionalNotes}
                                            onChange={(e) => setAdditionalNotes(e.target.value)}
                                            rows={3}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-emerald-500 resize-none"
                                        />
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        type="submit"
                                        disabled={isForecasting || !aov || !dailyAdSpend}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11 text-sm shadow-lg shadow-emerald-500/20 transition-all mt-2"
                                    >
                                        {isForecasting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Running P&L Simulation...
                                            </>
                                        ) : (
                                            <>
                                                <LineChart className="h-4 w-4 mr-2" />
                                                Generate 30/90-Day Forecast (1 Credit)
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Forecast History Mini-List */}
                        {forecastHistory.length > 0 && (
                            <Card className="bg-zinc-950/40 border-white/5">
                                <CardHeader className="py-3 px-4 border-b border-white/5">
                                    <CardTitle className="text-xs font-mono uppercase text-zinc-400 flex items-center justify-between">
                                        <span>Session Models ({forecastHistory.length})</span>
                                        <RotateCcw className="h-3 w-3 text-zinc-500" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                    {forecastHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setGeneratedOutput(item.output)}
                                            className="p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors flex items-center justify-between group"
                                        >
                                            <div className="truncate pr-2">
                                                <div className="font-semibold text-zinc-200 truncate group-hover:text-emerald-400">
                                                    {item.title}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-mono">AOV: {item.aov}</div>
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
                                        <Calculator className="h-5 w-5 text-emerald-400" />
                                        Virtual CFO Forecasting Terminal
                                    </CardTitle>
                                    <CardDescription className="text-xs font-mono text-zinc-400 mt-0.5">
                                        {generatedOutput ? "P&L Projections & Risk Audit complete" : "Awaiting financial inputs"}
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
                                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-8 text-xs"
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
                                    {isForecasting ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                                        >
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                                                <Calculator className="w-7 h-7 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-white">Synthesizing P&L Model & Scale Scenarios</p>
                                                <p className="text-xs text-zinc-500 font-mono">
                                                    Calculating Break-even ROAS, contribution margin, and reserve risks via agent-gateway...
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
                                                <BarChart3 className="h-8 w-8 text-emerald-400 opacity-60" />
                                            </div>
                                            <div className="space-y-1 max-w-sm mx-auto">
                                                <h3 className="text-base font-semibold text-zinc-300">Forecaster Standby</h3>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    Configure your AOV, daily budget, and unit economics on the left. The CFO agent will deliver an institutional 30/90-day P&L stress test.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Financial Insights Footer */}
                <div className="mt-20 border-t border-white/10 pt-12">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Boardroom-Grade Financial Telemetry</h2>
                        <p className="text-sm text-zinc-400 mt-1">Protect your working capital with institutional unit economic modeling.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">True Break-Even ROAS</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Most founders underestimate merchant fees, return friction, and landed shipping costs. Know the exact blended multiplier needed to stay net cash positive.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <LineChart className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">90-Day Cash Gap Warning</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Fast-growing brands often die from inventory reorder gaps. The forecast alerts you to upcoming working capital bottlenecks before you run out of stock.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Percent className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Contribution Margin Expansion</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Pinpoints tactical opportunities—order bumps, post-purchase funnels, and supplier price tier renegotiations—to immediately widen profit margins.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
