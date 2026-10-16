import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bot,
    Copy,
    Check,
    Loader2,
    Coins,
    Download,
    RotateCcw,
    Zap,
    MessageSquare,
    Workflow,
    Sliders,
    ShieldCheck
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

const WORKFLOW_GOALS = [
    {
        id: "abandoned_cart",
        label: "Abandoned Cart & Checkout Recovery",
        desc: "Recover high-intent drop-offs with urgency hooks, social proof, and tiered discounts."
    },
    {
        id: "welcome_nurture",
        label: "VIP New Customer Onboarding & Welcome",
        desc: "Indoctrinate new buyers, reinforce brand value, and drive second-purchase velocity."
    },
    {
        id: "win_back",
        label: "Dormant Customer Win-Back (60-90 Days)",
        desc: "Reactivate inactive subscribers through curiosity hooks, updates, and comeback incentives."
    },
    {
        id: "post_purchase_upsell",
        label: "Post-Purchase Cross-Sell & LTV Multiplier",
        desc: "Trigger complementary product offers immediately after checkout to maximize AOV."
    },
    {
        id: "lead_qualification",
        label: "High-Ticket Inbound Lead Qualification",
        desc: "Filter, score, and guide prospective leads toward booking discovery demos."
    },
    {
        id: "flash_sale",
        label: "Limited-Time Flash Sale & Scarcity Blitz",
        desc: "A rapid 72-hour countdown sequence with escalating psychological scarcity."
    }
]

const TONE_PRESETS = [
    "Urgent & High-Converting (Scarcity & Direct Action)",
    "Conversational & Empathetic (Supportive Problem-Solver)",
    "Luxury & Exclusive (High-Status, Elegant & Reserved)",
    "Direct-Response Punchy (Short, Provocative, Hyper-Focused)",
    "Authoritative & Consultative (B2B Enterprise Standard)",
]

const CHANNELS = [
    { id: "omnichannel", label: "Omnichannel (Email + SMS + In-App Push)" },
    { id: "email_only", label: "Email Sequences (Multi-Day Drip)" },
    { id: "sms_whatsapp", label: "Direct SMS & WhatsApp Follow-Ups" },
    { id: "conversational_bot", label: "Live Interactive Chat & Triggered Modals" },
]

const QUICK_PRESETS = [
    {
        name: "Cart Recovery",
        audience: "Shoppers who abandoned cart with $70+ order value",
        goal: "abandoned_cart",
        tone: "Urgent & High-Converting (Scarcity & Direct Action)",
        channel: "omnichannel",
        context: "Offer code SAVE10 for 10% off expiring in 24 hours. Highlight free shipping and 30-day money-back guarantee."
    },
    {
        name: "SaaS Onboarding",
        audience: "Free trial users who haven't completed product setup in 48 hours",
        goal: "welcome_nurture",
        tone: "Conversational & Empathetic (Supportive Problem-Solver)",
        channel: "email_only",
        context: "Focus on 5-minute setup win, link to interactive video walkthrough, offer 1-on-1 concierge onboarding call."
    },
    {
        name: "VIP Win-Back",
        audience: "Customers who made 2+ purchases but have been inactive for 90 days",
        goal: "win_back",
        tone: "Luxury & Exclusive (High-Status, Elegant & Reserved)",
        channel: "omnichannel",
        context: "Provide VIP exclusive secret collection access and complimentary gift with next order."
    }
]

interface WorkflowDraft {
    id: string
    title: string
    goal: string
    output: string
    timestamp: string
}

export default function SalesAutopilotPage() {
    const { businesses } = useBusiness()
    const activeBusiness = businesses[0]

    // Form inputs
    const [targetAudience, setTargetAudience] = useState("")
    const [workflowGoal, setWorkflowGoal] = useState("abandoned_cart")
    const [tone, setTone] = useState(TONE_PRESETS[0])
    const [channel, setChannel] = useState("omnichannel")
    const [additionalContext, setAdditionalContext] = useState("")

    // State
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedOutput, setGeneratedOutput] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [workflowHistory, setWorkflowHistory] = useState<WorkflowDraft[]>([])

    const selectedGoal = WORKFLOW_GOALS.find((g) => g.id === workflowGoal) || WORKFLOW_GOALS[0]
    const selectedChannel = CHANNELS.find((c) => c.id === channel) || CHANNELS[0]

    const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
        setTargetAudience(preset.audience)
        setWorkflowGoal(preset.goal)
        setTone(preset.tone)
        setChannel(preset.channel)
        setAdditionalContext(preset.context)
        toast.info(`Applied preset: ${preset.name}`)
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!targetAudience.trim()) {
            toast.error("Please specify your target audience.")
            return
        }

        if (!activeBusiness?.id) {
            toast.error("No active business entity selected", {
                description: "Please select or register a business entity to execute AI agent directives."
            })
            return
        }

        setIsGenerating(true)
        toast.info("Deploying Sales Autopilot Agent...", {
            description: "Executing workflow synthesis via agent-gateway (2 Credits)."
        })

        const structuredPrompt = `Act as an elite Sales Automation Engineer and Conversion Architect.
Design a battle-tested, high-converting automated sales workflow for:

- Target Audience: ${targetAudience.trim()}
- Primary Workflow Goal: ${selectedGoal.label} (${selectedGoal.desc})
- Communication Tone: ${tone}
- Primary Channel: ${selectedChannel.label}
- Additional Context / Offers / Constraints: ${additionalContext.trim() || "Standard e-commerce / SaaS business model with standard guarantees."}

Execution Requirements:
1. TRIGGER & FILTER ARCHITECTURE:
   - Define exact entry triggers (e.g. checkout_abandoned, cart_value > $50, inactive_days = 60).
   - Set up filter criteria and suppression lists (e.g. exclude current buyers, unsubscribe tags).

2. MULTI-STEP ACTION SEQUENCE (Provide 4-5 Chronological Steps):
   - For each step specify:
     * Timing & Delay (e.g., +15 mins, +4 hours, +24 hours, Day 3).
     * Delivery Channel (Email, SMS, Push, or Bot Hook).
     * Subject Line / Opening Hook: Provide 2 A/B test variations with high open-rate triggers.
     * Full Message Script: Ready-to-deploy copy including dynamic tags (e.g. {{first_name}}, {{cart_items}}, {{discount_code}}).
     * Goal of this specific step and psychological trigger (Loss Aversion, Social Proof, Scarcity, Reciprocity).

3. LOGIC BRANCHING & EXIT CONDITIONS:
   - Define exact conditions that move the user to a different sequence or terminate the automation upon purchase/action.

4. PROJECTED KPIS & BENCHMARKS:
   - Target Open Rate (%), Click-Through Rate (%), and Expected Conversion / Recovery Rate (%).

Format your entire output in clean, readable Markdown with clear headings, structured tables, and highlighted copy blocks.`

        try {
            const { data: edgeData, error: edgeError } = await supabase.functions.invoke("agent-gateway", {
                body: {
                    businessId: activeBusiness.id,
                    agentType: "general_agent",
                    intent: "generate_sales_workflow",
                    prompt: structuredPrompt,
                    creditsCost: 2,
                }
            })

            if (edgeError) {
                console.error("Sales workflow generation error:", edgeError)
                const errorMsg = edgeError.message || ""
                const isInsufficientCredits =
                    errorMsg.includes("402") ||
                    errorMsg.toLowerCase().includes("insufficient") ||
                    (edgeError as any)?.context?.status === 402 ||
                    (edgeError as any)?.status === 402

                if (isInsufficientCredits) {
                    toast.error("Insufficient Credits (402)", {
                        description: "You need at least 2 credits to synthesize an automated sales workflow. Please top up your treasury balance."
                    })
                    return
                }

                toast.error("Workflow Synthesis Failed", {
                    description: errorMsg || "Agent gateway encountered an unexpected inference error."
                })
                return
            }

            const outputText = edgeData?.output || edgeData?.result || "Sales workflow synthesized successfully."
            setGeneratedOutput(outputText)

            // Save to session history
            const newDraft: WorkflowDraft = {
                id: crypto.randomUUID(),
                title: `${selectedGoal.label} (${targetAudience.slice(0, 24)}...)`,
                goal: selectedGoal.label,
                output: outputText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
            setWorkflowHistory((prev) => [newDraft, ...prev])

            toast.success("Sales Workflow Synthesized!", {
                description: "2 credits settled via atomic ledger."
            })

        } catch (err: any) {
            console.error("Fatal error invoking agent-gateway:", err)
            toast.error("Inference Error: " + (err.message || "Unknown error"))
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = () => {
        if (!generatedOutput) return
        navigator.clipboard.writeText(generatedOutput)
        setCopied(true)
        toast.success("Copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        if (!generatedOutput) return
        const blob = new Blob([generatedOutput], { type: "text/markdown" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `sales-workflow-${selectedGoal.id}-${Date.now()}.md`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Downloaded workflow Markdown file.")
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
            <title>Sales Autopilot | AURA Increase</title>
            <meta name="description" content="AI-powered sales automation workflows, trigger engines, and multi-channel customer recovery" />

            <Navbar />

            <main className="pt-28 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Header / Hero */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <Bot className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Velociraptor • AI Workflow Engineer</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                            Sales Autopilot Engine
                        </h1>
                        <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-2xl">
                            Deploy high-converting sales sequences, trigger-based objection handlers, and recovery workflows wired directly to your customer lifecycle.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2.5">
                            <Coins className="h-4 w-4 text-cyan-400" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-mono text-zinc-500">Cost Per Run</div>
                                <div className="text-xs font-bold font-mono text-zinc-200">2 Credits</div>
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

                {/* Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT PANEL: Form / Directives */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl">
                            <CardHeader className="pb-4 border-b border-white/5">
                                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                    <Sliders className="h-4 w-4 text-cyan-400" />
                                    Workflow Architecture Directives
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-400">
                                    Configure trigger logic, goal, and tone for the Velociraptor AI agent.
                                </CardDescription>

                                {/* Quick Presets */}
                                <div className="pt-3">
                                    <div className="text-[10px] font-mono uppercase text-zinc-500 mb-2">Quick Blueprints:</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_PRESETS.map((p) => (
                                            <button
                                                key={p.name}
                                                type="button"
                                                onClick={() => handleApplyPreset(p)}
                                                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-cyan-400 transition-colors"
                                            >
                                                + {p.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-5 space-y-4">
                                <form onSubmit={handleGenerate} className="space-y-4">
                                    {/* Workflow Goal */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300 flex items-center justify-between">
                                            <span>Primary Goal</span>
                                            <span className="text-[10px] text-cyan-400 font-mono">Objective</span>
                                        </label>
                                        <Select value={workflowGoal} onValueChange={setWorkflowGoal}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Choose Workflow Goal" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {WORKFLOW_GOALS.map((g) => (
                                                    <SelectItem key={g.id} value={g.id}>
                                                        <div className="py-0.5">
                                                            <div className="font-semibold text-xs">{g.label}</div>
                                                            <div className="text-[10px] text-zinc-400 truncate max-w-xs">{g.desc}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Target Audience */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Target Audience & Segmentation
                                        </label>
                                        <Input
                                            placeholder="e.g., Abandoned checkout buyers with cart > $80"
                                            value={targetAudience}
                                            onChange={(e) => setTargetAudience(e.target.value)}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-cyan-500"
                                            required
                                        />
                                    </div>

                                    {/* Tone of Voice */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Voice & Persuasion Tone
                                        </label>
                                        <Select value={tone} onValueChange={setTone}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Choose Tone" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {TONE_PRESETS.map((t) => (
                                                    <SelectItem key={t} value={t} className="text-xs">
                                                        {t}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Delivery Channel */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Channel Architecture
                                        </label>
                                        <Select value={channel} onValueChange={setChannel}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Choose Channel" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {CHANNELS.map((c) => (
                                                    <SelectItem key={c.id} value={c.id} className="text-xs">
                                                        {c.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Additional Context / Constraints */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Offers, Guarantees & Constraints
                                            </label>
                                            <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
                                        </div>
                                        <Textarea
                                            placeholder="Include discount codes, free gifts, shipping perks, or specific urgency timeframes..."
                                            value={additionalContext}
                                            onChange={(e) => setAdditionalContext(e.target.value)}
                                            rows={3}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-cyan-500 resize-none"
                                        />
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        type="submit"
                                        disabled={isGenerating || !targetAudience.trim()}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold h-11 text-sm shadow-lg shadow-cyan-500/20 transition-all mt-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Synthesizing Workflow via Gateway...
                                            </>
                                        ) : (
                                            <>
                                                <Workflow className="h-4 w-4 mr-2" />
                                                Synthesize Sales Workflow (2 Credits)
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Session History Mini-List */}
                        {workflowHistory.length > 0 && (
                            <Card className="bg-zinc-950/40 border-white/5">
                                <CardHeader className="py-3 px-4 border-b border-white/5">
                                    <CardTitle className="text-xs font-mono uppercase text-zinc-400 flex items-center justify-between">
                                        <span>Session Workflows ({workflowHistory.length})</span>
                                        <RotateCcw className="h-3 w-3 text-zinc-500" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                    {workflowHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setGeneratedOutput(item.output)}
                                            className="p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors flex items-center justify-between group"
                                        >
                                            <div className="truncate pr-2">
                                                <div className="font-semibold text-zinc-200 truncate group-hover:text-cyan-400">
                                                    {item.title}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-mono">{item.goal}</div>
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
                                        <Bot className="h-5 w-5 text-cyan-400" />
                                        Velociraptor Workflow Terminal
                                    </CardTitle>
                                    <CardDescription className="text-xs font-mono text-zinc-400 mt-0.5">
                                        {generatedOutput ? "Multi-step automated sequence compiled" : "Awaiting workflow directive dispatch"}
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
                                            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold h-8 text-xs"
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
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                                        >
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                                                <Bot className="w-7 h-7 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-white">Synthesizing Sales Automation Engine</p>
                                                <p className="text-xs text-zinc-500 font-mono">
                                                    Constructing trigger logic, email/SMS copy, and conversion funnels via agent-gateway...
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
                                                <Workflow className="h-8 w-8 text-cyan-400 opacity-60" />
                                            </div>
                                            <div className="space-y-1 max-w-sm mx-auto">
                                                <h3 className="text-base font-semibold text-zinc-300">Autopilot Offline</h3>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    Select a goal and define your target audience on the left. The agent will formulate a complete multi-step automation workflow.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Architecture Capabilities Grid */}
                <div className="mt-20 border-t border-white/10 pt-12">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Engineered for Maximum Recovery</h2>
                        <p className="text-sm text-zinc-400 mt-1">Autonomous triggers designed to capture revenue that would otherwise slip away.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Micro-Timed Triggers</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Avoid generic bulk blasts. Automations trigger at precise intervals (e.g. +15 minutes for SMS, +4 hours for email) when psychological purchase intent is highest.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Dynamic Objection Tackling</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Addresses specific friction points—shipping fees, return anxieties, product fit—with customized psychological levers woven into every touchpoint.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-semibold text-white">Atomic RLS Isolation</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Every generated blueprint is securely tied to your active business entity ID and isolated behind Supabase Row Level Security.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
