import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Target, Globe, Tag, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SpyInputProps {
    onAnalyze: (url: string, sku?: string) => void
    isAnalyzing: boolean
    statusMessage?: string
}

export function SpyInput({ onAnalyze, isAnalyzing, statusMessage }: SpyInputProps) {
    const [url, setUrl] = useState("")
    const [sku, setSku] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim() || isAnalyzing) return
        onAnalyze(url.trim(), sku.trim() || undefined)
    }

    return (
        <div className="w-full max-w-4xl mx-auto relative group">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-primary/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />

            <form onSubmit={handleSubmit} className="relative p-3 bg-black/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
                {/* URL Input */}
                <div className="flex-1 flex items-center px-3 bg-white/5 border border-white/5 rounded-xl focus-within:border-primary/50 transition-all">
                    <Globe className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://competitor-store.com/product"
                        className="bg-transparent border-0 focus-visible:ring-0 text-sm h-11 placeholder:text-muted-foreground/50 text-white"
                        disabled={isAnalyzing}
                    />
                </div>

                {/* SKU Input */}
                <div className="w-full md:w-56 flex items-center px-3 bg-white/5 border border-white/5 rounded-xl focus-within:border-primary/50 transition-all">
                    <Tag className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                    <Input
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="Target SKU (optional)"
                        className="bg-transparent border-0 focus-visible:ring-0 text-sm h-11 placeholder:text-muted-foreground/50 text-white"
                        disabled={isAnalyzing}
                    />
                </div>

                {/* Submit Action */}
                <Button
                    type="submit"
                    disabled={!url.trim() || isAnalyzing}
                    className="w-full md:w-auto h-11 px-5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-black" />
                            <span>Infiltrating...</span>
                        </>
                    ) : (
                        <>
                            <Target className="h-4 w-4 text-black" />
                            <span>Deploy Agent</span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/10 text-black/80 font-bold ml-1">
                                2 Cr
                            </span>
                        </>
                    )}
                </Button>
            </form>

            {/* Infiltration Telemetry Status */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mt-3 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 rounded-lg py-2 px-4"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>{statusMessage || "Agent infiltrating target domain // Extracting SKU telemetry..."}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
