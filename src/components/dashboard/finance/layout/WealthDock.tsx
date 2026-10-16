import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Terminal, Zap, MessageSquare, GripHorizontal } from "lucide-react"

export type WealthView = "cockpit" | "crypto" | "equity" | "cashflow" | "oracle"

interface WealthDockProps {
    activeView: WealthView
    onChange: (view: WealthView) => void
}

export function WealthDock({ activeView, onChange }: WealthDockProps) {
    const tabs = [
        { id: "cockpit", label: "Cockpit", icon: GripHorizontal },
        { id: "crypto", label: "Crypto Terminal", icon: Terminal },
        { id: "cashflow", label: "Cash Flow", icon: Zap },
        { id: "oracle", label: "The Oracle", icon: MessageSquare },
    ]

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 shadow-2xl">
                {tabs.map((tab) => {
                    const isActive = activeView === tab.id
                    const Icon = tab.icon

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id as WealthView)}
                            className={cn(
                                "relative px-4 py-3 rounded-xl transition-all duration-300 group flex items-center gap-2",
                                isActive ? "bg-white/10 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                            <span className={cn(
                                "text-sm font-medium transition-all duration-300 overflow-hidden",
                                isActive ? "max-w-[100px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2"
                            )}>
                                {tab.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent border border-white/10 -z-10"
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
