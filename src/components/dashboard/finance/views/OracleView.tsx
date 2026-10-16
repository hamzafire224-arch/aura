import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from "lucide-react"

export function OracleView() {
    return (
        <div className="h-full max-w-4xl mx-auto p-6 flex flex-col">
            <div className="flex-1 flex flex-col justify-end space-y-6 pb-20">
                {/* AI MESSAGE */}
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-2 max-w-lg">
                        <div className="p-4 rounded-2xl bg-white/10 border border-white/10 rounded-tl-none">
                            <p className="leading-relaxed">
                                I've analyzed your cash flow trends. You are currently burning <span className="text-red-400 font-mono font-bold">$3,200/mo</span> but your crypto portfolio is up <span className="text-green-400 font-mono font-bold">12%</span>.
                            </p>
                            <p className="mt-2 leading-relaxed">
                                Recommendation: Take $5k profit from ETH and extend your runway by 45 days. Shall I execute a limit sell order?
                            </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">Just now • AI Financial Therapist</span>
                    </div>
                </div>

                {/* USER MESSAGE */}
                <div className="flex gap-4 flex-row-reverse">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                        <span className="font-bold text-xs">YOU</span>
                    </div>
                    <div className="space-y-2 max-w-lg">
                        <div className="p-4 rounded-2xl bg-blue-600/20 border border-blue-500/30 rounded-tr-none text-blue-100">
                            <p>What happens if I hire another dev for $5k/mo?</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INPUT AREA */}
            <div className="bg-white/5 border border-white/10 p-2 rounded-full flex items-center gap-2 pl-6 backdrop-blur-xl">
                <Input
                    placeholder="Ask The Oracle about your finances..."
                    className="bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
                />
                <Button size="icon" className="rounded-full h-12 w-12 bg-indigo-600 hover:bg-indigo-700">
                    <Send className="h-5 w-5" />
                </Button>
            </div>

            {/* SUGGESTIONS */}
            <div className="flex gap-2 justify-center mt-4">
                {["Analyze Spending", "Forecast Revenue", "Audit Subscriptions"].map(s => (
                    <button key={s} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors">
                        {s}
                    </button>
                ))}
            </div>
        </div>
    )
}
