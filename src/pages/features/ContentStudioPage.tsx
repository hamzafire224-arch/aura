import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Sparkles, 
    Copy, 
    Check, 
    Loader2, 
    Coins, 
    FileText, 
    Bot, 
    Download, 
    Wand2, 
    RotateCcw
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

const CONTENT_TYPES = [
    { id: "facebook_ad", label: "Facebook & Instagram Ad Copy", desc: "Hooks, primary text, headline, and CTA angles" },
    { id: "product_description", label: "High-Converting Product Description", desc: "Benefits, feature breakdowns, and sensory triggers" },
    { id: "seo_blog", label: "SEO-Optimized Blog Post", desc: "Search-ranked longform outline and keyword-rich body" },
    { id: "email_sequence", label: "Email Sales Sequence", desc: "Nurture, cart-abandonment, or product launch emails" },
    { id: "video_script", label: "TikTok / Reel Video Script", desc: "3-second visual hooks, audio directions, and call-to-action" },
    { id: "google_ad", label: "Google Search Ads (PPC)", desc: "High-intent responsive search headlines and descriptions" },
]

const TONE_PRESETS = [
    "High-Converting & Direct (Direct Response)",
    "Luxury & Sophisticated (E-Commerce Elite)",
    "Punchy & Viral (Social Media / Gen-Z)",
    "Authoritative & Educational (Thought Leadership)",
    "Urgent & Scarcity-Driven (Flash Sales)",
]

interface GeneratedCopyDraft {
    id: string
    productName: string
    contentType: string
    output: string
    timestamp: string
}

export default function ContentStudioPage() {
    const { businesses } = useBusiness()
    const activeBusiness = businesses[0]

    // Form inputs
    const [productName, setProductName] = useState("")
    const [contentType, setContentType] = useState("facebook_ad")
    const [targetAudience, setTargetAudience] = useState("")
    const [keyBenefits, setKeyBenefits] = useState("")
    const [tone, setTone] = useState(TONE_PRESETS[0])

    // State
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedOutput, setGeneratedOutput] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [draftHistory, setDraftHistory] = useState<GeneratedCopyDraft[]>([])

    const selectedTypeObj = CONTENT_TYPES.find((t) => t.id === contentType) || CONTENT_TYPES[0]

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!productName.trim()) {
            toast.error("Please enter a product or brand name.")
            return
        }

        if (!activeBusiness?.id) {
            toast.error("No active business entity selected", {
                description: "Please log in or register a business entity to execute AI agent directives."
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
        setGeneratedOutput("") // Reset output terminal for incoming token stream

        toast.info("Deploying Content Creator Agent...", {
            description: "Executing real-time streaming engine via agent-gateway."
        })

        const structuredPrompt = `Act as an elite direct-response copywriter and Conversion Rate Optimization (CRO) expert.
Generate world-class, ready-to-publish ${selectedTypeObj.label} for:

- Product/Brand: ${productName.trim()}
- Target Audience / Demographic: ${targetAudience.trim() || "General e-commerce buyers looking for quality and value"}
- Tone of Voice: ${tone}
- Key Benefits / USPs / Specs: ${keyBenefits.trim() || "Superior build quality, modern aesthetics, fast shipping, 100% satisfaction guarantee"}

Execution Instructions:
1. Provide 3 scroll-stopping Headline/Hook variations (Curiosity, Benefit, and Negative-Frame).
2. Generate the full, persuasive body copy adhering strictly to the PAS (Problem-Agitate-Solution) or AIDA framework.
3. Provide 2 distinct Call-To-Action (CTA) triggers optimized for high click-through rates.
4. Include 3 bulleted angles for A/B testing creative variations.

Format your entire output in clean, readable Markdown with bold headers and bullet points.`

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
                    agentType: "content_creator",
                    intent: "generate_copy",
                    prompt: structuredPrompt,
                    creditsCost: 1,
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

                // 402 Payment Required / Insufficient Credits Handling
                if (response.status === 402 || errorData.code === "INSUFFICIENT_CREDITS") {
                    toast.error("Insufficient Credits (402)", {
                        description: errorData.error || "You need at least 1 credit to generate copy. Please top up your treasury balance."
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

                toast.error("Generation Failed", {
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
                            // If stream line is raw text rather than JSON
                            accumulatedText += dataContent
                            setGeneratedOutput(accumulatedText)
                        }
                    }
                }
            }

            // Flush remaining buffer content if present
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

            // Add completed output to session draft history
            if (accumulatedText.trim()) {
                const newDraft: GeneratedCopyDraft = {
                    id: crypto.randomUUID(),
                    productName: productName.trim(),
                    contentType: selectedTypeObj.label,
                    output: accumulatedText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
                setDraftHistory((prev) => [newDraft, ...prev])

                toast.success("Copy Generated Successfully!", {
                    description: "1 credit settled via atomic ledger."
                })
            }

        } catch (err: any) {
            console.error("Fatal error during stream ingestion:", err)
            toast.error("Inference Error: " + (err.message || "Unknown error"))
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = () => {
        if (!generatedOutput) return
        navigator.clipboard.writeText(generatedOutput)
        setCopied(true)
        toast.success("Copy copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        if (!generatedOutput) return
        const blob = new Blob([generatedOutput], { type: "text/markdown;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${productName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-copy.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/20 flex flex-col font-sans">
            <title>AI Copywriter Studio | AURA</title>
            <meta name="description" content="Autonomous AI copywriter wired directly to the Aura agent-gateway" />

            <Navbar />

            <main className="flex-1 pt-28 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase tracking-wider">
                                <Bot className="h-3 w-3 mr-1" />
                                Content Creator Agent
                            </Badge>
                            <Badge variant="secondary" className="bg-white/5 text-zinc-400 font-mono text-[10px] border border-white/5">
                                <Coins className="h-2.5 w-2.5 mr-1 text-amber-400" />
                                1 Credit Per Run
                            </Badge>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                            <Wand2 className="h-8 w-8 text-cyan-400" />
                            AI Copywriter Studio
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Deploy autonomous direct-response copywriters to engineer high-converting ads, descriptions, and sales scripts with zero-latency streaming.
                        </p>
                    </div>

                    {activeBusiness && (
                        <div className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span>Active Entity:</span>
                            <span className="text-white font-semibold">{activeBusiness.name}</span>
                        </div>
                    )}
                </div>

                {/* Studio Grid: Left Form, Right Live Telemetry Output */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT PANEL: Generation Controls Form */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-xl">
                            <CardHeader className="pb-4 border-b border-white/5">
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-cyan-400" />
                                    Directive Parameters
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-400 font-mono">
                                    Define the audience, value props, and target channels.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <form onSubmit={handleGenerate} className="space-y-4">
                                    {/* Product / Offer Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Product or Brand Name <span className="text-cyan-400">*</span>
                                        </label>
                                        <Input
                                            placeholder="e.g. Lumina Ergonomic Desk Lamp"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-cyan-500"
                                            required
                                        />
                                    </div>

                                    {/* Content Type Selector */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Content Asset Type
                                        </label>
                                        <Select value={contentType} onValueChange={setContentType}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Choose Content Type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {CONTENT_TYPES.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                                            {selectedTypeObj.desc}
                                        </p>
                                    </div>

                                    {/* Target Audience */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Target Audience & Demographics
                                        </label>
                                        <Input
                                            placeholder="e.g. Remote software engineers and home office enthusiasts"
                                            value={targetAudience}
                                            onChange={(e) => setTargetAudience(e.target.value)}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-cyan-500"
                                        />
                                    </div>

                                    {/* Tone of Voice */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono uppercase text-zinc-300">
                                            Tone & Brand Personality
                                        </label>
                                        <Select value={tone} onValueChange={setTone}>
                                            <SelectTrigger className="bg-black/50 border-white/10 text-sm">
                                                <SelectValue placeholder="Choose Tone" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                                {TONE_PRESETS.map((t) => (
                                                    <SelectItem key={t} value={t}>
                                                        {t}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Key Benefits & Features */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-mono uppercase text-zinc-300">
                                                Key Value Props / Features
                                            </label>
                                            <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
                                        </div>
                                        <Textarea
                                            placeholder="List core benefits, materials, price, guarantee, or differentiators..."
                                            value={keyBenefits}
                                            onChange={(e) => setKeyBenefits(e.target.value)}
                                            rows={3}
                                            className="bg-black/50 border-white/10 text-sm focus-visible:ring-cyan-500 resize-none"
                                        />
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        type="submit"
                                        disabled={isGenerating || !productName.trim()}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold h-11 text-sm shadow-lg shadow-cyan-500/20 transition-all mt-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Streaming Live Copy...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Generate Copy with AI (1 Credit)
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Session History Mini-List */}
                        {draftHistory.length > 0 && (
                            <Card className="bg-zinc-950/40 border-white/5">
                                <CardHeader className="py-3 px-4 border-b border-white/5">
                                    <CardTitle className="text-xs font-mono uppercase text-zinc-400 flex items-center justify-between">
                                        <span>Session Drafts ({draftHistory.length})</span>
                                        <RotateCcw className="h-3 w-3 text-zinc-500" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                    {draftHistory.map((draft) => (
                                        <div
                                            key={draft.id}
                                            onClick={() => setGeneratedOutput(draft.output)}
                                            className="p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors flex items-center justify-between group"
                                        >
                                            <div className="truncate pr-2">
                                                <div className="font-semibold text-zinc-200 truncate group-hover:text-cyan-400">
                                                    {draft.productName}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-mono">{draft.contentType}</div>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-600 shrink-0">{draft.timestamp}</span>
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
                                        Agent Output Terminal
                                    </CardTitle>
                                    <CardDescription className="text-xs font-mono text-zinc-400 mt-0.5">
                                        {isGenerating
                                            ? "Streaming live tokens via agent-gateway..."
                                            : generatedOutput
                                            ? "Synthesized copy ready for deployment"
                                            : "Awaiting directive dispatch"}
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
                                    {isGenerating && !generatedOutput ? (
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
                                                <p className="text-sm font-semibold text-white">Synthesizing Persuasion Architecture</p>
                                                <p className="text-xs text-zinc-500 font-mono">
                                                    Connecting to neural gateway and establishing SSE stream...
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : generatedOutput !== null && generatedOutput !== undefined ? (
                                        <motion.div
                                            key="output"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="h-full flex flex-col"
                                        >
                                            <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[620px] select-text">
                                                {generatedOutput}
                                                {isGenerating && (
                                                    <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle" />
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
                                                <Sparkles className="h-8 w-8 text-cyan-400 opacity-60" />
                                            </div>
                                            <div className="space-y-1 max-w-sm mx-auto">
                                                <h3 className="text-base font-semibold text-zinc-300">Studio Idle</h3>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    Enter your product details on the left and dispatch the directive. Your AI copy will be synthesized and streamed here in real-time.
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
